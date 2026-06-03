#!/usr/bin/env python3
"""Create MIDI control tracks from long audio files.

The EQ mode is designed for Fusion/Resolve animation: it writes one MIDI track
per frequency band, with Control Change values mapped from band energy.
"""

from __future__ import annotations

import argparse
import math
import shutil
import struct
import subprocess
import sys
from pathlib import Path

import numpy as np


SAMPLE_RATE = 22_050
DEFAULT_MIN_FREQ = 30.0
DEFAULT_MAX_FREQ = 16_000.0
DEFAULT_BANDS = 12
DEFAULT_FPS = 24.0
PPQ = 480
BPM = 120
CC_BASE = 20
FFMPEG_CANDIDATES = (
    "ffmpeg",
    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/usr/bin/ffmpeg",
)


def vlq(value: int) -> bytes:
    if value < 0:
        raise ValueError("VLQ cannot encode negative values")

    buffer = value & 0x7F
    value >>= 7
    while value:
        buffer <<= 8
        buffer |= ((value & 0x7F) | 0x80)
        value >>= 7

    out = bytearray()
    while True:
        out.append(buffer & 0xFF)
        if buffer & 0x80:
            buffer >>= 8
        else:
            break
    return bytes(out)


def meta_event(delta: int, event_type: int, payload: bytes) -> bytes:
    return vlq(delta) + bytes([0xFF, event_type]) + vlq(len(payload)) + payload


def midi_chunk(chunk_type: bytes, payload: bytes) -> bytes:
    return chunk_type + struct.pack(">I", len(payload)) + payload


def tempo_track() -> bytes:
    microseconds_per_quarter = int(60_000_000 / BPM)
    payload = bytearray()
    payload += meta_event(0, 0x03, b"Tempo")
    payload += meta_event(0, 0x51, microseconds_per_quarter.to_bytes(3, "big"))
    payload += meta_event(0, 0x2F, b"")
    return midi_chunk(b"MTrk", bytes(payload))


def cc_track(name: str, events: list[tuple[int, int]], cc_number: int, channel: int = 0) -> bytes:
    payload = bytearray()
    payload += meta_event(0, 0x03, name.encode("ascii", "replace")[:80])

    last_tick = 0
    status = 0xB0 | (channel & 0x0F)
    for tick, value in events:
        delta = max(0, tick - last_tick)
        payload += vlq(delta)
        payload += bytes([status, cc_number & 0x7F, value & 0x7F])
        last_tick = tick

    payload += meta_event(0, 0x2F, b"")
    return midi_chunk(b"MTrk", bytes(payload))


def write_midi(path: Path, tracks: list[bytes]) -> None:
    header = struct.pack(">HHH", 1, len(tracks), PPQ)
    data = midi_chunk(b"MThd", header) + b"".join(tracks)
    path.write_bytes(data)


def log_bands(count: int, min_freq: float, max_freq: float) -> list[tuple[float, float]]:
    edges = np.geomspace(min_freq, max_freq, count + 1)
    return [(float(edges[i]), float(edges[i + 1])) for i in range(count)]


def find_ffmpeg() -> str:
    for candidate in FFMPEG_CANDIDATES:
        if "/" not in candidate:
            found = shutil.which(candidate)
            if found:
                return found
            continue

        path = Path(candidate)
        if path.exists() and path.is_file():
            return str(path)

    raise RuntimeError(
        "ffmpeg is required but was not found. Expected it at /opt/homebrew/bin/ffmpeg."
    )


def read_audio_frames(input_path: Path, frame_samples: int):
    ffmpeg_path = find_ffmpeg()

    command = [
        ffmpeg_path,
        "-v",
        "error",
        "-i",
        str(input_path),
        "-ac",
        "1",
        "-ar",
        str(SAMPLE_RATE),
        "-f",
        "s16le",
        "-",
    ]
    process = subprocess.Popen(command, stdout=subprocess.PIPE)
    assert process.stdout is not None

    bytes_per_frame = frame_samples * 2
    while True:
        chunk = process.stdout.read(bytes_per_frame)
        if not chunk:
            break
        samples = np.frombuffer(chunk, dtype=np.int16).astype(np.float32) / 32768.0
        if samples.size < frame_samples:
            samples = np.pad(samples, (0, frame_samples - samples.size))
        yield samples

    return_code = process.wait()
    if return_code != 0:
        raise RuntimeError(f"ffmpeg failed with exit code {return_code}.")


def analyze_bands(
    input_path: Path,
    bands: list[tuple[float, float]],
    fps: float,
) -> np.ndarray:
    frame_samples = max(256, int(round(SAMPLE_RATE / fps)))
    window = np.hanning(frame_samples).astype(np.float32)
    freqs = np.fft.rfftfreq(frame_samples, d=1.0 / SAMPLE_RATE)
    band_masks = [(freqs >= low) & (freqs < high) for low, high in bands]

    rows: list[list[float]] = []
    for index, samples in enumerate(read_audio_frames(input_path, frame_samples), start=1):
        spectrum = np.abs(np.fft.rfft(samples * window))
        row = []
        for mask in band_masks:
            if not np.any(mask):
                row.append(-120.0)
                continue
            energy = float(np.mean(spectrum[mask] ** 2))
            row.append(10.0 * math.log10(energy + 1e-12))
        rows.append(row)

        if index % 1000 == 0:
            seconds = index / fps
            print(f"Analyzed {seconds / 60:.1f} min", file=sys.stderr)

    if not rows:
        raise RuntimeError("No audio samples were decoded from the input file.")
    return np.asarray(rows, dtype=np.float32)


def normalize(values: np.ndarray, sensitivity: float) -> np.ndarray:
    low = np.percentile(values, 10, axis=0)
    high = np.percentile(values, 95, axis=0)
    spread = np.maximum(high - low, 1.0)
    scaled = (values - low) / spread
    scaled = np.clip(scaled * sensitivity, 0.0, 1.0)
    return np.rint(scaled * 127.0).astype(np.int16)


def smooth(values: np.ndarray, amount: float) -> np.ndarray:
    if amount <= 0:
        return values

    alpha = max(0.01, min(1.0, 1.0 - amount))
    output = np.empty_like(values, dtype=np.float32)
    output[0] = values[0]
    for i in range(1, values.shape[0]):
        output[i] = (alpha * values[i]) + ((1.0 - alpha) * output[i - 1])
    return np.rint(output).astype(np.int16)


def build_eq_tracks(
    values: np.ndarray,
    bands: list[tuple[float, float]],
    fps: float,
    change_threshold: int,
) -> list[bytes]:
    ticks_per_second = BPM * PPQ / 60.0
    tracks = [tempo_track()]

    for band_index, (low, high) in enumerate(bands):
        events: list[tuple[int, int]] = []
        last_value: int | None = None

        for frame_index, value in enumerate(values[:, band_index]):
            current = int(value)
            tick = int(round((frame_index / fps) * ticks_per_second))
            should_emit = (
                last_value is None
                or abs(current - last_value) >= change_threshold
                or frame_index == values.shape[0] - 1
            )
            if should_emit:
                events.append((tick, current))
                last_value = current

        name = f"Band {band_index + 1:02d} {low:.0f}-{high:.0f}Hz CC{CC_BASE + band_index}"
        tracks.append(cc_track(name, events, CC_BASE + band_index))

    return tracks


def eq_command(args: argparse.Namespace) -> None:
    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    bands = log_bands(args.bands, args.min_freq, args.max_freq)
    raw = analyze_bands(input_path, bands, args.fps)
    values = normalize(raw, args.sensitivity)
    values = smooth(values, args.smoothing)
    tracks = build_eq_tracks(values, bands, args.fps, args.change_threshold)
    write_midi(output_path, tracks)

    print(f"Wrote {output_path}")
    print(f"Tracks: {args.bands} frequency bands + tempo")
    print(f"Frames analyzed: {values.shape[0]}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create MIDI files from audio for Resolve/Fusion animation."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    eq = subparsers.add_parser("eq", help="Create MIDI CC tracks from frequency bands.")
    eq.add_argument("input", help="Input audio file: wav, mp3, m4a, flac, ogg, etc.")
    eq.add_argument("output", help="Output .mid path.")
    eq.add_argument("--bands", type=int, default=DEFAULT_BANDS, help="Number of frequency tracks.")
    eq.add_argument("--fps", type=float, default=DEFAULT_FPS, help="Analysis rate. Use your timeline FPS.")
    eq.add_argument("--min-freq", type=float, default=DEFAULT_MIN_FREQ, help="Lowest analyzed frequency.")
    eq.add_argument("--max-freq", type=float, default=DEFAULT_MAX_FREQ, help="Highest analyzed frequency.")
    eq.add_argument("--sensitivity", type=float, default=1.0, help="Boost or reduce MIDI movement.")
    eq.add_argument("--smoothing", type=float, default=0.65, help="0 is sharp, 0.9 is very smooth.")
    eq.add_argument(
        "--change-threshold",
        type=int,
        default=1,
        help="Only write a MIDI event when value changes by this amount.",
    )
    eq.set_defaults(func=eq_command)

    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.func(args)


if __name__ == "__main__":
    main()

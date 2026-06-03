# Audio To MIDI

Local tool for creating MIDI control data from long audio files.

The main mode is `eq`: it analyzes the audio spectrum and creates one MIDI
track per frequency band. The default is 12 bands, which is intended for
Fusion/Resolve equalizer-style animation.

## Requirements

- Python 3
- `numpy`
- `ffmpeg`

This machine already has `ffmpeg` and `numpy` available.

## Usage

Double-click this Desktop app:

```text
MYZE Audio To MIDI.app
```

Or run from Terminal:

```bash
python3 tools/audio-to-midi/audio_to_midi.py eq input.mp3 output.mid
```

Recommended for a 24 FPS timeline:

```bash
python3 tools/audio-to-midi/audio_to_midi.py eq input.mp3 output.mid --fps 24
```

For a 30 FPS timeline:

```bash
python3 tools/audio-to-midi/audio_to_midi.py eq input.mp3 output.mid --fps 30
```

## Defaults

- `--bands 12`
- `--min-freq 30`
- `--max-freq 16000`
- `--fps 24`
- `--smoothing 0.65`

Each band becomes a separate MIDI track:

```text
Band 01 ... CC20
Band 02 ... CC21
Band 03 ... CC22
...
Band 12 ... CC31
```

## Useful Controls

Make movement stronger:

```bash
--sensitivity 1.3
```

Make movement smoother:

```bash
--smoothing 0.8
```

Make movement sharper:

```bash
--smoothing 0.3
```

Reduce MIDI file size:

```bash
--change-threshold 3
```

## Notes

This EQ mode is separate from Spotify Basic Pitch. Basic Pitch is best for
transcribing musical notes. For visual equalizer animation, frequency-band MIDI
control tracks are usually more practical.

#!/usr/bin/env python3
"""Small desktop launcher for the Audio To MIDI tool."""

from __future__ import annotations

import queue
import subprocess
import sys
import threading
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk


APP_DIR = Path(__file__).resolve().parent
CLI_PATH = APP_DIR / "audio_to_midi.py"


class AudioToMidiApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("MYZE Audio To MIDI")
        self.geometry("680x460")
        self.minsize(620, 420)

        self.input_path = tk.StringVar()
        self.output_path = tk.StringVar()
        self.fps = tk.StringVar(value="24")
        self.bands = tk.StringVar(value="12")
        self.sensitivity = tk.StringVar(value="1.0")
        self.smoothing = tk.StringVar(value="0.65")
        self.status = tk.StringVar(value="Ready")
        self.log_queue: queue.Queue[str] = queue.Queue()
        self.worker: threading.Thread | None = None

        self._build_ui()
        self.after(100, self._drain_log_queue)

    def _build_ui(self) -> None:
        outer = ttk.Frame(self, padding=22)
        outer.pack(fill="both", expand=True)
        outer.columnconfigure(1, weight=1)

        title = ttk.Label(outer, text="MYZE Audio To MIDI", font=("Helvetica", 20, "bold"))
        title.grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 16))

        ttk.Label(outer, text="Audio file").grid(row=1, column=0, sticky="w", pady=6)
        ttk.Entry(outer, textvariable=self.input_path).grid(row=1, column=1, sticky="ew", padx=8)
        ttk.Button(outer, text="Choose", command=self.choose_input).grid(row=1, column=2, sticky="ew")

        ttk.Label(outer, text="MIDI output").grid(row=2, column=0, sticky="w", pady=6)
        ttk.Entry(outer, textvariable=self.output_path).grid(row=2, column=1, sticky="ew", padx=8)
        ttk.Button(outer, text="Save As", command=self.choose_output).grid(row=2, column=2, sticky="ew")

        controls = ttk.Frame(outer)
        controls.grid(row=3, column=0, columnspan=3, sticky="ew", pady=(14, 8))
        for column in range(4):
            controls.columnconfigure(column, weight=1)

        self._control(controls, "Bands", self.bands, 0)
        self._control(controls, "FPS", self.fps, 1)
        self._control(controls, "Sensitivity", self.sensitivity, 2)
        self._control(controls, "Smoothing", self.smoothing, 3)

        run_row = ttk.Frame(outer)
        run_row.grid(row=4, column=0, columnspan=3, sticky="ew", pady=(8, 10))
        run_row.columnconfigure(0, weight=1)
        ttk.Label(run_row, textvariable=self.status).grid(row=0, column=0, sticky="w")
        self.run_button = ttk.Button(run_row, text="Create MIDI", command=self.create_midi)
        self.run_button.grid(row=0, column=1, sticky="e")

        self.log = tk.Text(outer, height=11, wrap="word", state="disabled")
        self.log.grid(row=5, column=0, columnspan=3, sticky="nsew")
        outer.rowconfigure(5, weight=1)

    def _control(self, parent: ttk.Frame, label: str, variable: tk.StringVar, column: int) -> None:
        frame = ttk.Frame(parent)
        frame.grid(row=0, column=column, sticky="ew", padx=(0 if column == 0 else 8, 0))
        ttk.Label(frame, text=label).pack(anchor="w")
        ttk.Entry(frame, textvariable=variable, width=12).pack(fill="x")

    def choose_input(self) -> None:
        path = filedialog.askopenfilename(
            title="Choose audio file",
            filetypes=[
                ("Audio files", "*.wav *.mp3 *.m4a *.flac *.ogg *.aac"),
                ("All files", "*.*"),
            ],
        )
        if not path:
            return
        self.input_path.set(path)
        if not self.output_path.get():
            self.output_path.set(str(Path(path).with_suffix(".mid")))

    def choose_output(self) -> None:
        initial = Path(self.input_path.get()).with_suffix(".mid") if self.input_path.get() else Path.home() / "Desktop" / "output.mid"
        path = filedialog.asksaveasfilename(
            title="Save MIDI file",
            initialfile=initial.name,
            initialdir=str(initial.parent),
            defaultextension=".mid",
            filetypes=[("MIDI files", "*.mid"), ("All files", "*.*")],
        )
        if path:
            self.output_path.set(path)

    def create_midi(self) -> None:
        input_path = self.input_path.get().strip()
        output_path = self.output_path.get().strip()
        if not input_path or not output_path:
            messagebox.showerror("Missing file", "Choose an audio file and MIDI output path.")
            return

        try:
            bands = int(self.bands.get())
            fps = float(self.fps.get())
            sensitivity = float(self.sensitivity.get())
            smoothing = float(self.smoothing.get())
        except ValueError:
            messagebox.showerror("Invalid settings", "Bands, FPS, sensitivity, and smoothing must be numbers.")
            return

        command = [
            sys.executable,
            str(CLI_PATH),
            "eq",
            input_path,
            output_path,
            "--bands",
            str(bands),
            "--fps",
            str(fps),
            "--sensitivity",
            str(sensitivity),
            "--smoothing",
            str(smoothing),
        ]

        self._set_running(True)
        self._append_log("Starting conversion...\n")
        self.worker = threading.Thread(target=self._run_command, args=(command,), daemon=True)
        self.worker.start()

    def _run_command(self, command: list[str]) -> None:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        assert process.stdout is not None
        for line in process.stdout:
            self.log_queue.put(line)
        return_code = process.wait()
        if return_code == 0:
            self.log_queue.put("__DONE__")
        else:
            self.log_queue.put(f"__ERROR__:{return_code}")

    def _drain_log_queue(self) -> None:
        try:
            while True:
                item = self.log_queue.get_nowait()
                if item == "__DONE__":
                    self._append_log("Done.\n")
                    self.status.set("Finished")
                    self._set_running(False)
                    messagebox.showinfo("Finished", "MIDI file created.")
                elif item.startswith("__ERROR__:"):
                    self._append_log(f"Failed with exit code {item.split(':', 1)[1]}.\n")
                    self.status.set("Failed")
                    self._set_running(False)
                    messagebox.showerror("Failed", "MIDI creation failed. Check the log.")
                else:
                    self._append_log(item)
        except queue.Empty:
            pass
        self.after(100, self._drain_log_queue)

    def _append_log(self, text: str) -> None:
        self.log.configure(state="normal")
        self.log.insert("end", text)
        self.log.see("end")
        self.log.configure(state="disabled")

    def _set_running(self, running: bool) -> None:
        self.run_button.configure(state="disabled" if running else "normal")
        self.status.set("Working..." if running else self.status.get())


if __name__ == "__main__":
    AudioToMidiApp().mainloop()

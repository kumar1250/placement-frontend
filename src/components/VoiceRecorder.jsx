import { Mic, Square, RotateCcw, Check } from "lucide-react";
import Waveform from "./Waveform";
import { formatTime } from "../utils/copy";

/**
 * Presentational recorder UI. All MediaRecorder logic lives in useRecorder;
 * this component just reflects recorderState and calls back into the
 * handlers the parent wires up.
 */
export default function VoiceRecorder({
  recorderState, // idle | requesting | recording | stopped
  elapsed,
  level,
  isEmptyRecording,
  submitting,
  submitted,
  onStart,
  onStop,
  onReRecord,
  disabled,
}) {
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-good-dim text-good">
          <Check className="h-6 w-6" />
        </span>
        <p className="font-mono text-sm uppercase tracking-wide text-good">Answer submitted</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Waveform bars={9} tone="brass" />
        <p className="font-mono text-sm uppercase tracking-wide text-paper-muted">
          Analyzing your response...
        </p>
      </div>
    );
  }

  if (recorderState === "stopped" && isEmptyRecording) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="text-sm text-weak">
          That recording came through empty. Try answering again.
        </p>
        <button
          onClick={onReRecord}
          className="flex items-center gap-2 rounded-full border border-weak px-5 py-2.5 text-sm font-semibold text-weak transition hover:bg-weak hover:text-paper"
        >
          <RotateCcw className="h-4 w-4" />
          Re-record
        </button>
      </div>
    );
  }

  if (recorderState === "recording") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <Waveform bars={14} size="lg" live level={level} tone="brass" />
        <p className="font-mono text-2xl tabular-nums text-ink">{formatTime(elapsed)}</p>
        <button
          onClick={onStop}
          className="flex items-center gap-2 rounded-full bg-weak px-6 py-3 text-sm font-semibold text-paper shadow-sm transition hover:brightness-110"
        >
          <Square className="h-4 w-4 fill-current" />
          Stop Answer
        </button>
      </div>
    );
  }

  // idle, requesting, or stopped-but-not-empty (auto-submits, brief flash)
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <button
        onClick={onStart}
        disabled={disabled || recorderState === "requesting"}
        className="flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mic className="h-4 w-4" />
        {recorderState === "requesting" ? "Requesting microphone..." : "Start Answer"}
      </button>
      <p className="text-xs text-paper-muted">
        Speak your answer aloud — we'll transcribe and score it automatically.
      </p>
    </div>
  );
}

import Waveform from "./Waveform";

const STATUS_COPY = {
  asking: "Asking question",
  listening: "Listening",
  evaluating: "Evaluating answer",
  idle: "Waiting",
};

export default function AIInterviewer({ status = "idle" }) {
  const label = STATUS_COPY[status] || STATUS_COPY.idle;
  const active = status === "asking" || status === "evaluating";

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${
          active ? "border-brass" : "border-ink-border"
        } bg-ink-soft`}
      >
        <span className="font-display text-lg font-semibold text-brass">AI</span>
        {status === "listening" && (
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-ink bg-weak pulse-rec" />
        )}
      </div>
      <div>
        <p className="font-display text-base font-semibold text-paper">Your interviewer</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">{label}</span>
          {(status === "asking" || status === "evaluating") && (
            <Waveform bars={4} size="sm" tone="brass" />
          )}
        </div>
      </div>
    </div>
  );
}

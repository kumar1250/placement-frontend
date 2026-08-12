import { useState } from "react";
import { ChevronDown, ThumbsUp, ThumbsDown, ListChecks, Lightbulb } from "lucide-react";

function ListBlock({ icon: Icon, label, items, tone }) {
  if (!items || items.length === 0) return null;
  const toneClass = tone === "good" ? "text-good" : tone === "weak" ? "text-weak" : "text-brass-dim";
  return (
    <div>
      <div className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide ${toneClass}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-snug text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FeedbackCard({ answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-paper-border bg-white/60">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <span className="font-mono text-xs uppercase tracking-wide text-paper-muted">
            Question {answer.question_number}
          </span>
          <p className="mt-1 truncate font-display text-base font-medium text-ink sm:text-lg">
            {answer.question_text}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-lg font-semibold tabular-nums text-ink">
            {Math.round(answer.overall_score)}
          </span>
          <ChevronDown className={`h-4 w-4 text-paper-muted transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="fade-up space-y-5 border-t border-paper-border px-5 py-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-wide text-paper-muted">Your answer</span>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{answer.transcript}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ListBlock icon={ThumbsUp} label="Strengths" items={answer.strengths} tone="good" />
            <ListBlock icon={ThumbsDown} label="Weaknesses" items={answer.weaknesses} tone="weak" />
            <ListBlock icon={ListChecks} label="Missing points" items={answer.missing_points} tone="brass" />
            <ListBlock
              icon={Lightbulb}
              label="Try next time"
              items={answer.improvement_suggestions}
              tone="brass"
            />
          </div>

          {answer.ideal_answer && (
            <div className="rounded-lg border border-brass/30 bg-paper-dim px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-wide text-brass-dim">
                One strong way to answer this
              </span>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink">
                {answer.ideal_answer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

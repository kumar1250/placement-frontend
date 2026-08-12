import { Volume2, VolumeX } from "lucide-react";

export default function QuestionCard({ questionNumber, questionText, category, onReplay, speaking }) {
  return (
    <div className="fade-up rounded-xl border border-ink-border bg-ink-soft p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-wide text-brass">
          Question {questionNumber}
          {category ? ` · ${category}` : ""}
        </span>
        <button
          onClick={onReplay}
          aria-label={speaking ? "Stop reading question aloud" : "Read question aloud"}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
            speaking
              ? "border-brass bg-brass text-ink"
              : "border-ink-border text-ink-muted hover:border-brass hover:text-brass"
          }`}
        >
          {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-4 font-display text-xl font-medium leading-snug text-paper sm:text-2xl">
        {questionText}
      </p>
    </div>
  );
}

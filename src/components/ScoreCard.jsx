const TONE_CLASSES = {
  good: "text-good",
  brass: "text-brass-dim",
  weak: "text-weak",
  muted: "text-paper-muted",
};

function toneForScore(score) {
  if (score == null) return "muted";
  if (score >= 75) return "good";
  if (score >= 55) return "brass";
  return "weak";
}

export default function ScoreCard({ label, score, size = "md" }) {
  const tone = toneForScore(score);
  const valueSize = size === "lg" ? "text-6xl" : "text-3xl";

  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-paper-border bg-white/60 px-5 py-6 text-center">
      <span className={`font-display font-semibold tabular-nums ${valueSize} ${TONE_CLASSES[tone]}`}>
        {score != null ? Math.round(score) : "—"}
      </span>
      <span className="font-mono text-xs uppercase tracking-wide text-paper-muted">{label}</span>
    </div>
  );
}

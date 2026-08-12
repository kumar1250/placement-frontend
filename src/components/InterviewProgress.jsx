export default function InterviewProgress({ current, total }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-ink-muted">
        <span>
          Question {current} of {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-border">
        <div
          className="h-full rounded-full bg-brass transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

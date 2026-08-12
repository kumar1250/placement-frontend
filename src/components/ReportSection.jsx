export default function ReportSection({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`fade-up ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-4">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-wide text-brass-dim">{eyebrow}</p>
          )}
          {title && <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}

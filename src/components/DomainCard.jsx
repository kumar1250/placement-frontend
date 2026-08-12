import { getDomainIcon } from "../utils/domainIcons";

export default function DomainCard({ domain, onSelect }) {
  const Icon = getDomainIcon(domain.icon);

  return (
    <button
      onClick={() => onSelect(domain)}
      className="group flex flex-col items-start gap-3 rounded-xl border border-paper-border bg-white/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-brass hover:shadow-[0_8px_24px_-12px_rgba(20,23,31,0.25)] focus-visible:-translate-y-0.5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-brass transition group-hover:bg-brass group-hover:text-ink">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold leading-tight text-ink">{domain.name}</h3>
        <p className="mt-1 text-sm leading-snug text-paper-muted">{domain.description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-wide text-brass-dim">
        <span>{domain.default_difficulty}</span>
        <span aria-hidden="true">·</span>
        <span>{domain.default_questions} questions</span>
      </div>
    </button>
  );
}

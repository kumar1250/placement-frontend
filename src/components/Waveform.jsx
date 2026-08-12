const DEFAULT_HEIGHTS = [0.4, 0.7, 1, 0.55, 0.85, 0.35, 0.65, 0.9, 0.45, 0.75, 0.5, 0.3];

/**
 * A row of animated bars — the recurring visual metaphor for this product:
 * spoken answers resolving into a scored transcript.
 *
 * live=true drives bar heights from a real mic level (0..1) instead of the
 * ambient animation, so the recorder screen visibly reacts to the student's voice.
 */
export default function Waveform({ bars = 12, live = false, level = 0, tone = "brass", size = "md" }) {
  const heights = DEFAULT_HEIGHTS.slice(0, bars);
  const colorClass =
    tone === "paper" ? "bg-paper" : tone === "ink" ? "bg-ink" : tone === "weak" ? "bg-weak" : "bg-brass";
  const heightClass = size === "sm" ? "h-4" : size === "lg" ? "h-16" : "h-8";

  return (
    <div className={`flex items-center gap-[3px] ${heightClass}`} aria-hidden="true">
      {heights.map((h, i) => {
        const scale = live ? Math.max(0.15, Math.min(1, level * (0.6 + h * 0.8))) : h;
        return (
          <span
            key={i}
            className={`w-[3px] rounded-full ${colorClass} ${!live ? "wf-bar" : ""}`}
            style={{
              height: "100%",
              transform: `scaleY(${scale})`,
              animationDelay: !live ? `${i * 0.08}s` : undefined,
              transition: live ? "transform 90ms linear" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

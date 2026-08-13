const WIDTH = 600;
const HEIGHT = 160;
const PADDING = 20;

export default function ScoreTrendSparkline({ points }) {
  if (!points || points.length === 0) return null;

  const scores = points.map((p) => p.overall_score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 100);
  const range = maxScore - minScore || 1;

  const usableWidth = WIDTH - PADDING * 2;
  const usableHeight = HEIGHT - PADDING * 2;

  const coords = points.map((p, i) => {
    const x = points.length === 1 ? WIDTH / 2 : PADDING + (i / (points.length - 1)) * usableWidth;
    const y = PADDING + usableHeight - ((p.overall_score - minScore) / range) * usableHeight;
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${HEIGHT - PADDING} L ${coords[0].x.toFixed(1)} ${HEIGHT - PADDING} Z`;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Overall score over time">
      <path d={areaPath} fill="var(--color-brass)" opacity="0.12" />
      <path d={linePath} fill="none" stroke="var(--color-brass)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r="4" fill="var(--color-paper)" stroke="var(--color-brass-dim)" strokeWidth="2" />
          <title>
            {c.domain} · {Math.round(c.overall_score)}
          </title>
        </g>
      ))}
    </svg>
  );
}

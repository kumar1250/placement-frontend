import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import ScoreCard from "../components/ScoreCard";
import ReportSection from "../components/ReportSection";
import ScoreTrendSparkline from "../components/ScoreTrendSparkline";
import { fetchDashboard } from "../services/dashboardApi";
import { toApiError } from "../services/api";

function PhraseList({ icon: Icon, title, items, tone, emptyLabel }) {
  const toneClass = tone === "good" ? "text-good" : "text-weak";
  return (
    <div className="rounded-xl border border-paper-border bg-white/60 p-6">
      <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wide ${toneClass}`}>
        <Icon className="h-4 w-4" />
        {title}
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-paper-muted">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-3 text-sm leading-relaxed text-ink">
              <span>{item.text}</span>
              <span className="shrink-0 rounded-full bg-paper-dim px-2 py-0.5 font-mono text-[11px] text-paper-muted">
                ×{item.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    setData(null);
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(toApiError(err)));
  };

  useEffect(load, []);

  if (error) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-6 py-20">
          <ErrorMessage code={error.code} message={error.error} onRetry={load} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <LoadingState message="Loading your dashboard..." full />
      </div>
    );
  }

  if (data.completed_interviews === 0) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="fade-up font-display text-3xl font-semibold text-ink">No interviews yet</h1>
          <p className="fade-up mt-2 text-sm text-paper-muted">
            Complete your first practice interview to see where you're strong and where to improve.
          </p>
          <Link
            to="/domains"
            className="fade-up mt-8 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition hover:bg-ink-soft"
          >
            Start an interview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto max-w-4xl space-y-14 px-6 py-14">
        <ReportSection eyebrow={`${data.completed_interviews} completed interviews`} title="Your dashboard">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <ScoreCard label="Overall" score={data.average_overall_score} size="lg" />
            <ScoreCard label="Technical" score={data.average_technical_score} />
            <ScoreCard label="Communication" score={data.average_communication_score} />
            <ScoreCard label="Confidence" score={data.average_confidence_score} />
            <ScoreCard label="Problem solving" score={data.average_problem_solving_score} />
          </div>
        </ReportSection>

        {data.score_trend.length > 1 && (
          <ReportSection title="Score over time">
            <div className="flex items-center gap-2 rounded-xl border border-paper-border bg-white/60 p-6">
              <TrendingUp className="hidden h-5 w-5 shrink-0 text-brass-dim sm:block" />
              <ScoreTrendSparkline points={data.score_trend} />
            </div>
          </ReportSection>
        )}

        <ReportSection title="Where you stand">
          <div className="grid gap-5 md:grid-cols-2">
            <PhraseList
              icon={ThumbsUp}
              title="You're strong here"
              items={data.top_strengths}
              tone="good"
              emptyLabel="Not enough feedback yet to spot a pattern."
            />
            <PhraseList
              icon={ThumbsDown}
              title="Focus on improving"
              items={data.top_weaknesses}
              tone="weak"
              emptyLabel="Not enough feedback yet to spot a pattern."
            />
          </div>
        </ReportSection>

        {data.by_domain.length > 0 && (
          <ReportSection title="By domain">
            <div className="divide-y divide-paper-border rounded-xl border border-paper-border bg-white/60">
              {data.by_domain.map((d) => (
                <div key={d.domain} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-ink">{d.domain}</p>
                    <p className="font-mono text-xs uppercase tracking-wide text-paper-muted">
                      {d.count} interview{d.count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="font-display text-2xl font-semibold tabular-nums text-ink">
                    {d.average_score != null ? Math.round(d.average_score) : "—"}
                  </span>
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        <div className="flex justify-center gap-4 pb-6">
          <Link
            to="/interviews/history"
            className="rounded-full border border-paper-border px-8 py-4 text-sm font-semibold text-ink transition hover:border-brass"
          >
            View interview history
          </Link>
          <Link
            to="/domains"
            className="rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition hover:bg-ink-soft"
          >
            Practice another interview
          </Link>
        </div>
      </div>
    </div>
  );
}

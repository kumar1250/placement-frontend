import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import { fetchReport } from "../services/interviewApi";
import { toApiError } from "../services/api";
import { scoreLevel } from "../utils/copy";

export default function ResultPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    setReport(null);
    fetchReport(sessionId)
      .then(setReport)
      .catch((err) => {
        const apiErr = toApiError(err);
        if (apiErr.code === "report_not_ready") {
          navigate(`/interview/${sessionId}`, { replace: true });
          return;
        }
        setError(apiErr);
      });
  };

  useEffect(load, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-6 py-20">
          <ErrorMessage
            code={error.code}
            message={error.error}
            onRetry={load}
            action={
              <Link to="/domains" className="rounded-md border border-weak/40 px-3 py-1.5 text-sm font-medium text-weak">
                Start new
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <LoadingState message="Loading your results..." full />
      </div>
    );
  }

  const level = scoreLevel(report.overall_score);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brass text-ink">
          <Trophy className="h-7 w-7" />
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-brass-dim">
          Interview complete
        </p>
        <p className="mt-3 font-display text-7xl font-semibold tabular-nums text-ink">
          {Math.round(report.overall_score)}
        </p>
        <p className="mt-2 font-medium text-paper-muted">{level.label}</p>

        <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper-muted">
          {report.domain} · {report.difficulty} · {report.interview_type}
        </p>

        <Link
          to={`/interview/${sessionId}/report`}
          className="mt-10 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition hover:bg-ink-soft"
        >
          View full report
        </Link>
      </div>
    </div>
  );
}

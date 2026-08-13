import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import ReportSection from "../components/ReportSection";
import { fetchInterviewHistory } from "../services/dashboardApi";
import { toApiError } from "../services/api";

const STATUS_LABEL = {
  created: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    setSessions(null);
    fetchInterviewHistory()
      .then(setSessions)
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

  if (!sessions) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <LoadingState message="Loading your interviews..." full />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-14">
        <ReportSection eyebrow={`${sessions.length} interview${sessions.length === 1 ? "" : "s"}`} title="Interview history">
          {sessions.length === 0 ? (
            <div className="rounded-xl border border-paper-border bg-white/60 p-10 text-center">
              <p className="text-sm text-paper-muted">You haven't started any interviews yet.</p>
              <Link
                to="/domains"
                className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold text-paper transition hover:bg-ink-soft"
              >
                Start an interview
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-paper-border rounded-xl border border-paper-border bg-white/60">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">{session.domain}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-wide text-paper-muted">
                      <span>{session.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>{session.interview_type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(session.created_at)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-display text-2xl font-semibold tabular-nums text-ink">
                        {session.overall_score != null ? Math.round(session.overall_score) : "—"}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-paper-muted">
                        {STATUS_LABEL[session.status] || session.status}
                      </p>
                    </div>
                    {session.status === "completed" ? (
                      <Link
                        to={`/interview/${session.session_id}/report`}
                        className="flex items-center gap-1.5 rounded-full border border-paper-border px-4 py-2 text-sm font-medium text-ink transition hover:border-brass"
                      >
                        <FileText className="h-4 w-4" />
                        Report
                      </Link>
                    ) : (
                      <Link
                        to={`/interview/${session.session_id}`}
                        className="rounded-full border border-paper-border px-4 py-2 text-sm font-medium text-ink transition hover:border-brass"
                      >
                        Resume
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportSection>
      </div>
    </div>
  );
}

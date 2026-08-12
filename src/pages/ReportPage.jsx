import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import ScoreCard from "../components/ScoreCard";
import ReportSection from "../components/ReportSection";
import FeedbackCard from "../components/FeedbackCard";
import { fetchReport } from "../services/interviewApi";
import { toApiError } from "../services/api";
import { scoreLevel } from "../utils/copy";

function BulletList({ icon: Icon, title, items, tone }) {
  const toneClass = tone === "good" ? "text-good" : tone === "weak" ? "text-weak" : "text-brass-dim";
  return (
    <div className="rounded-xl border border-paper-border bg-white/60 p-6">
      <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wide ${toneClass}`}>
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReportPage() {
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
        <LoadingState message="Loading your report..." full />
      </div>
    );
  }

  const level = scoreLevel(report.overall_score);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto max-w-4xl space-y-14 px-6 py-14">
        <ReportSection eyebrow={`${report.domain} · ${report.difficulty} · ${report.interview_type}`}>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-7xl font-semibold tabular-nums text-ink">
                {Math.round(report.overall_score)}
              </p>
              <p className="mt-1 font-medium text-paper-muted">{level.label} · Overall score</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ScoreCard label="Technical" score={report.technical_score} />
              <ScoreCard label="Communication" score={report.communication_score} />
              <ScoreCard label="Confidence" score={report.confidence_score} />
              <ScoreCard label="Problem solving" score={report.problem_solving_score} />
            </div>
          </div>
        </ReportSection>

        <ReportSection title="AI's final feedback">
          <div className="rounded-xl border border-brass/30 bg-paper-dim px-6 py-5">
            <p className="text-base leading-relaxed text-ink">{report.final_feedback}</p>
          </div>
        </ReportSection>

        <ReportSection title="Where you stand">
          <div className="grid gap-5 md:grid-cols-3">
            <BulletList icon={ThumbsUp} title="Strengths" items={report.strengths} tone="good" />
            <BulletList icon={ThumbsDown} title="Weaknesses" items={report.weaknesses} tone="weak" />
            <BulletList icon={Lightbulb} title="Recommendations" items={report.recommendations} tone="brass" />
          </div>
        </ReportSection>

        <ReportSection title="Question by question" eyebrow={`${report.answers.length} answers`}>
          <div className="space-y-3">
            {report.answers.map((answer) => (
              <FeedbackCard key={answer.question_number} answer={answer} />
            ))}
          </div>
        </ReportSection>

        <div className="flex justify-center pb-6">
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

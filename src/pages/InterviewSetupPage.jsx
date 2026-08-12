import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import InterviewSetupForm from "../components/InterviewSetupForm";
import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import { getDomainIcon } from "../utils/domainIcons";
import { startInterview } from "../services/interviewApi";
import { toApiError } from "../services/api";
import { useSelection } from "../context/SelectionContext";

export default function InterviewSetupPage() {
  const { selectedDomain } = useSelection();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState(selectedDomain?.default_difficulty || "Intermediate");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [numberOfQuestions, setNumberOfQuestions] = useState(selectedDomain?.default_questions || 10);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDomain) {
      navigate("/domains", { replace: true });
    }
  }, [selectedDomain, navigate]);

  if (!selectedDomain) return null;

  const Icon = getDomainIcon(selectedDomain.icon);

  const handleChange = (patch) => {
    if (patch.difficulty !== undefined) setDifficulty(patch.difficulty);
    if (patch.interviewType !== undefined) setInterviewType(patch.interviewType);
    if (patch.numberOfQuestions !== undefined) setNumberOfQuestions(patch.numberOfQuestions);
  };

  const handleStart = async () => {
    setError(null);
    setStarting(true);
    try {
      const session = await startInterview({
        domain: selectedDomain.name,
        difficulty,
        interviewType,
        numberOfQuestions,
      });
      navigate(`/interview/${session.session_id}`);
    } catch (err) {
      setError(toApiError(err));
      setStarting(false);
    }
  };

  if (starting) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <LoadingState message="Starting your interview..." full />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-14">
        <Link
          to="/domains"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-paper-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Change domain
        </Link>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-brass-dim">Step 2 of 2</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-brass">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {selectedDomain.name}
          </h1>
        </div>

        <div className="mt-10 rounded-xl border border-paper-border bg-white/60 p-6 sm:p-8">
          <InterviewSetupForm
            difficulty={difficulty}
            interviewType={interviewType}
            numberOfQuestions={numberOfQuestions}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="mt-6">
            <ErrorMessage code={error.code} message={error.error} onRetry={handleStart} />
          </div>
        )}

        <button
          onClick={handleStart}
          className="mt-8 w-full rounded-full bg-ink py-4 text-sm font-semibold text-paper transition hover:bg-ink-soft sm:w-auto sm:px-10"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AIInterviewer from "../components/AIInterviewer";
import QuestionCard from "../components/QuestionCard";
import VoiceRecorder from "../components/VoiceRecorder";
import InterviewProgress from "../components/InterviewProgress";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import Waveform from "../components/Waveform";
import { useRecorder } from "../hooks/useRecorder";
import { useSpeech } from "../hooks/useSpeech";
import {
  fetchSession,
  fetchCurrentQuestion,
  submitAnswer,
  completeInterview,
} from "../services/interviewApi";
import { toApiError } from "../services/api";

// phase: loading | ready | submitting | answer-feedback | finishing | fatal-error
export default function LiveInterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("loading");
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [answerError, setAnswerError] = useState(null);
  const [fatalError, setFatalError] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const speech = useSpeech();
  const recorder = useRecorder();
  const spokenQuestionId = useRef(null);

  const loadQuestion = useCallback(async () => {
    try {
      const q = await fetchCurrentQuestion(sessionId);
      setQuestion(q);
      setPhase("ready");
    } catch (err) {
      setFatalError(toApiError(err));
      setPhase("fatal-error");
    }
  }, [sessionId]);

  // Initial load: session status, then the current question.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchSession(sessionId);
        if (cancelled) return;
        setSession(s);
        setTotalQuestions(s.total_questions);

        if (s.status === "completed") {
          navigate(`/interview/${sessionId}/report`, { replace: true });
          return;
        }

        const q = await fetchCurrentQuestion(sessionId);
        if (cancelled) return;
        setQuestion(q);
        setPhase("ready");
      } catch (err) {
        if (!cancelled) {
          setFatalError(toApiError(err));
          setPhase("fatal-error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Auto-read each new question aloud, once.
  useEffect(() => {
    if (question && spokenQuestionId.current !== question.id) {
      spokenQuestionId.current = question.id;
      speech.speak(question.question_text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const handleReplay = () => {
    if (speech.speaking) {
      speech.cancel();
    } else if (question) {
      speech.speak(question.question_text);
    }
  };

  const handleStartRecording = () => {
    speech.cancel();
    setAnswerError(null);
    recorder.start();
  };

  const submitCurrentAnswer = useCallback(
    async (blob) => {
      setPhase("submitting");
      setAnswerError(null);
      try {
        const result = await submitAnswer(sessionId, {
          questionId: question.id,
          audioBlob: blob,
        });
        setLastResult(result);
        setPhase("answer-feedback");

        setTimeout(async () => {
          if (result.is_last_question) {
            setPhase("finishing");
            try {
              await completeInterview(sessionId);
              navigate(`/interview/${sessionId}/result`);
            } catch (err) {
              setFatalError(toApiError(err));
              setPhase("fatal-error");
            }
          } else {
            recorder.reset();
            setLastResult(null);
            setQuestion({
              id: result.next_question_id,
              question_number: (question?.question_number || 0) + 1,
              question_text: result.next_question,
              category: null,
              difficulty: session?.difficulty,
            });
            setPhase("ready");
          }
        }, 2200);
      } catch (err) {
        setAnswerError(toApiError(err));
        setPhase("ready");
      }
    },
    [sessionId, question, session, navigate, recorder]
  );

  // When the recorder finishes with real audio, submit automatically.
  useEffect(() => {
    if (recorder.state === "stopped" && recorder.audioBlob && !recorder.isEmptyRecording) {
      submitCurrentAnswer(recorder.audioBlob);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.state, recorder.audioBlob, recorder.isEmptyRecording]);

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-ink">
        <LoadingState message="Loading interview..." full />
      </div>
    );
  }

  if (phase === "fatal-error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <div className="w-full max-w-md">
          <ErrorMessage
            code={fatalError?.code}
            message={fatalError?.error}
            action={
              <Link
                to="/domains"
                className="rounded-md border border-brass/40 px-3 py-1.5 text-sm font-medium text-brass transition hover:bg-brass hover:text-ink"
              >
                Start a new interview
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const aiStatus =
    phase === "submitting" || phase === "finishing"
      ? "evaluating"
      : recorder.state === "recording"
      ? "listening"
      : speech.speaking
      ? "asking"
      : "idle";

  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <AIInterviewer status={aiStatus} />
          <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
            {session?.domain}
          </span>
        </div>

        <div className="mt-8">
          <InterviewProgress current={question?.question_number || 1} total={totalQuestions || 1} />
        </div>

        <div className="mt-8 flex-1">
          {question && (
            <QuestionCard
              questionNumber={question.question_number}
              questionText={question.question_text}
              category={question.category}
              onReplay={handleReplay}
              speaking={speech.speaking}
            />
          )}

          {phase === "finishing" ? (
            <div className="mt-8 flex flex-col items-center gap-4 py-6 text-center">
              <Waveform bars={9} tone="brass" />
              <p className="font-mono text-sm uppercase tracking-wide text-ink-muted">
                Generating final report...
              </p>
            </div>
          ) : phase === "answer-feedback" && lastResult ? (
            <div className="fade-up mt-8 rounded-xl border border-brass/30 bg-ink-soft px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-brass">This answer</span>
                <span className="font-mono text-2xl font-semibold text-brass">
                  {Math.round(lastResult.score)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{lastResult.feedback}</p>
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-ink-border bg-ink-soft/60 p-6">
              <VoiceRecorder
                recorderState={recorder.state}
                elapsed={recorder.elapsed}
                level={recorder.level}
                isEmptyRecording={recorder.isEmptyRecording}
                submitting={phase === "submitting"}
                submitted={false}
                onStart={handleStartRecording}
                onStop={recorder.stop}
                onReRecord={recorder.reset}
                disabled={phase !== "ready"}
              />
              {recorder.error && (
                <ErrorMessage code={recorder.error.code} onRetry={handleStartRecording} />
              )}
              {answerError && (
                <ErrorMessage
                  code={answerError.code}
                  message={answerError.error}
                  onRetry={() => {
                    recorder.reset();
                    setAnswerError(null);
                    if (answerError.code === "already_answered" || answerError.code === "session_completed") {
                      setPhase("loading");
                      loadQuestion();
                    }
                  }}
                  retryLabel={
                    answerError.code === "already_answered" || answerError.code === "session_completed"
                      ? "Continue"
                      : "Re-record"
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

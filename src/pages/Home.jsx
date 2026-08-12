import { Link } from "react-router-dom";
import { Mic, Sparkles, Target, Gauge, MessageSquareText, Trophy } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import Waveform from "../components/Waveform";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI interviewer",
    body: "An adaptive interviewer that builds on what you've already said — no two interviews play out the same way.",
  },
  {
    icon: Mic,
    title: "Voice-based interview",
    body: "Answer out loud, the way you would in the real room. Your interviewer asks questions aloud, too.",
  },
  {
    icon: Target,
    title: "Domain-specific questions",
    body: "Pick from 20 real placement tracks, from Python and React to HR and case interviews.",
  },
  {
    icon: Gauge,
    title: "Instant evaluation",
    body: "Every answer is scored the moment you finish speaking — technical accuracy, clarity, and more.",
  },
  {
    icon: MessageSquareText,
    title: "Personalized feedback",
    body: "Specific strengths, gaps, and a stronger way to answer each question, not just a number.",
  },
  {
    icon: Trophy,
    title: "Placement readiness score",
    body: "A final report you can act on before the real interview, not after it.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      {/* Hero — thesis: spoken answers resolving into a scored transcript */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="fade-up">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-dim">
              Placement interview practice
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Practice interviews
              <br /> with an AI that
              <br /> actually listens.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-muted">
              Prepare for your placement interviews with realistic, voice-based
              sessions — spoken questions, spoken answers, scored feedback.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/domains"
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-ink-soft"
              >
                Start Interview
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-paper-border px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-brass"
              >
                How It Works
              </a>
            </div>
          </div>

          <div className="fade-up rounded-2xl border border-ink-border bg-ink p-7" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wide text-brass">Live transcript</span>
              <Waveform bars={5} size="sm" tone="brass" />
            </div>
            <p className="mt-6 font-display text-lg leading-snug text-paper">
              "Can you walk me through how you'd design a rate limiter for a
              public API?"
            </p>
            <div className="mt-8 rounded-lg bg-ink-soft px-4 py-3">
              <p className="font-mono text-sm leading-relaxed text-ink-muted">
                A token bucket per client, refilled on a fixed interval
                <span className="transcript-caret" />
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-ink-border pt-5">
              <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Scoring answer</span>
              <span className="font-mono text-sm font-semibold text-brass">84</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="border-t border-paper-border bg-paper-dim/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-ink">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-paper-border bg-white/60 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-brass">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-paper-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              to="/domains"
              className="rounded-full bg-brass px-8 py-4 text-sm font-semibold text-ink shadow-sm transition hover:brightness-105"
            >
              Choose your domain
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-paper-border px-6 py-8 text-center font-mono text-xs text-paper-muted">
        No account needed — every session is anonymous.
      </footer>
    </div>
  );
}

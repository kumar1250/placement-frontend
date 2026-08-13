import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-lg border border-paper-border bg-white/60 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/domains";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(username, password);
    setSubmitting(false);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-col gap-8 px-6 py-20">
        <div className="fade-up text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-brass">
            <LogIn className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-paper-muted">Log in to continue your interview practice.</p>
        </div>

        <form onSubmit={handleSubmit} className="fade-up flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="font-mono text-xs uppercase tracking-wide text-paper-muted">
              Username or email
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-xs uppercase tracking-wide text-paper-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-2 ${inputClass}`}
            />
          </div>

          {error && <ErrorMessage code={error.code} message={error.error} />}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-ink px-8 py-3 text-sm font-semibold text-paper transition hover:bg-ink-soft disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="fade-up text-center text-sm text-paper-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

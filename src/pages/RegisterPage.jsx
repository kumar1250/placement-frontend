import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-lg border border-paper-border bg-white/60 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/domains";

  const [fields, setFields] = useState({ username: "", email: "", password: "", password2: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await register(fields);
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
            <UserPlus className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-paper-muted">
            Track every interview and see where you're strong and where you're weak.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fade-up flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="font-mono text-xs uppercase tracking-wide text-paper-muted">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={fields.username}
              onChange={update("username")}
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="email" className="font-mono text-xs uppercase tracking-wide text-paper-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={fields.email}
              onChange={update("email")}
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
              autoComplete="new-password"
              required
              minLength={8}
              value={fields.password}
              onChange={update("password")}
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="password2" className="font-mono text-xs uppercase tracking-wide text-paper-muted">
              Confirm password
            </label>
            <input
              id="password2"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={fields.password2}
              onChange={update("password2")}
              className={`mt-2 ${inputClass}`}
            />
          </div>

          {error && <ErrorMessage code={error.code} message={error.error} />}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-ink px-8 py-3 text-sm font-semibold text-paper transition hover:bg-ink-soft disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="fade-up text-center text-sm text-paper-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline decoration-brass decoration-2 underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

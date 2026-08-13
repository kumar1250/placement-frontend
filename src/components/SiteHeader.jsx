import { Link, useNavigate } from "react-router-dom";
import Waveform from "./Waveform";
import { useAuth } from "../context/AuthContext";

export default function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="border-b border-paper-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Waveform bars={4} size="sm" tone="ink" />
          <span className="font-display text-lg font-semibold tracking-tight">Panel</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-paper-muted">
          {isAuthenticated ? (
            <>
              <Link to="/domains" className="transition hover:text-ink">
                Start an interview
              </Link>
              <Link to="/dashboard" className="transition hover:text-ink">
                Dashboard
              </Link>
              <span className="hidden text-paper-muted/70 sm:inline">{user?.username}</span>
              <button onClick={handleLogout} className="transition hover:text-ink">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-ink-soft"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

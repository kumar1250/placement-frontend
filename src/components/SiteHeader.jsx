import { Link } from "react-router-dom";
import Waveform from "./Waveform";

export default function SiteHeader() {
  return (
    <header className="border-b border-paper-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Waveform bars={4} size="sm" tone="ink" />
          <span className="font-display text-lg font-semibold tracking-tight">Panel</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-paper-muted">
          <Link to="/domains" className="transition hover:text-ink">
            Start an interview
          </Link>
        </nav>
      </div>
    </header>
  );
}

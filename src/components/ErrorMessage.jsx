import { AlertTriangle } from "lucide-react";
import { friendlyError } from "../utils/copy";

export default function ErrorMessage({ code, message, onRetry, retryLabel = "Try again", action }) {
  const text = friendlyError(code, message);
  return (
    <div className="fade-up flex flex-col gap-3 rounded-lg border border-weak/30 bg-weak-dim px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-weak" />
        <p className="text-sm text-ink">{text}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-8 sm:pl-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md border border-weak/40 px-3 py-1.5 text-sm font-medium text-weak transition hover:bg-weak hover:text-paper"
          >
            {retryLabel}
          </button>
        )}
        {action}
      </div>
    </div>
  );
}

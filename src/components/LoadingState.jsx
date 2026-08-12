import Waveform from "./Waveform";

export default function LoadingState({ message = "Loading...", full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${
        full ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <Waveform bars={9} size="md" tone="brass" />
      <p className="font-mono text-sm tracking-wide text-paper-muted">{message}</p>
    </div>
  );
}

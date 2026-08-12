const ERROR_MESSAGES = {
  missing_audio: "We didn't receive a recording. Please record your answer before sending it.",
  empty_audio: "That recording came through empty. Try answering again.",
  audio_too_large: "That recording is too large to upload. Try a shorter answer.",
  unsupported_audio_type: "Your browser recorded audio in a format we can't process. Try a different browser.",
  already_answered: "This question was already answered. Loading the next one...",
  session_completed: "This interview has already finished.",
  gemini_unavailable: "Unable to process your answer right now. Please try again.",
  gemini_invalid_response: "Unable to process your answer right now. Please try again.",
  transcription_failed: "We couldn't transcribe that recording. Please try answering again.",
  no_question: "There's no active question for this interview right now.",
  report_not_ready: "This interview hasn't been completed yet.",
  network_error: "Can't reach the server. Check your connection and that the backend is running.",
  mic_permission_denied: "Microphone access was denied. Allow microphone access in your browser settings, then try again.",
  mic_unavailable: "We couldn't access a microphone on this device.",
};

export function friendlyError(code, fallback) {
  return ERROR_MESSAGES[code] || fallback || "Something went wrong. Please try again.";
}

export function scoreLevel(score) {
  if (score == null) return { label: "—", tone: "muted" };
  if (score >= 85) return { label: "Placement-ready", tone: "good" };
  if (score >= 70) return { label: "Strong performance", tone: "good" };
  if (score >= 55) return { label: "Developing", tone: "brass" };
  return { label: "Needs practice", tone: "weak" };
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

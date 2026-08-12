import { useCallback, useEffect, useRef, useState } from "react";

// States: idle -> requesting -> recording -> stopped -> (reset to idle)
// "denied" is a terminal error state until the user retries.
export function useRecorder() {
  const [state, setState] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0); // 0..1 mic level, for the waveform
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const cleanupAudioGraph = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupAudioGraph();
      stopStream();
    };
  }, [cleanupAudioGraph, stopStream]);

  const monitorLevel = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setLevel(Math.min(1, avg / 90));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeCandidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
      ];
      const mimeType = mimeCandidates.find((t) => MediaRecorder.isTypeSupported?.(t));

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setState("stopped");
        cleanupAudioGraph();
        stopStream();
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorderRef.current = recorder;

      // Level metering for the waveform visual
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        monitorLevel();
      }

      recorder.start();
      setState("recording");
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch (err) {
      cleanupAudioGraph();
      stopStream();
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        setError({ code: "mic_permission_denied" });
      } else {
        setError({ code: "mic_unavailable" });
      }
      setState("idle");
    }
  }, [cleanupAudioGraph, monitorLevel, stopStream]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setElapsed(0);
    setLevel(0);
    setAudioBlob(null);
    setError(null);
    chunksRef.current = [];
  }, []);

  const isEmptyRecording = elapsed < 1 && audioBlob && audioBlob.size < 2000;

  return { state, elapsed, level, audioBlob, error, isEmptyRecording, start, stop, reset };
}

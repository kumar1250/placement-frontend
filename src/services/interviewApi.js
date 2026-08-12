import { api } from "./api";

export async function fetchDomains() {
  const res = await api.get("/domains/");
  return res.data;
}

export async function startInterview({ domain, difficulty, interviewType, numberOfQuestions }) {
  const res = await api.post("/interviews/start/", {
    domain,
    difficulty,
    interview_type: interviewType,
    number_of_questions: numberOfQuestions,
  });
  return res.data;
}

export async function fetchSession(sessionId) {
  const res = await api.get(`/interviews/${sessionId}/`);
  return res.data;
}

export async function fetchCurrentQuestion(sessionId) {
  const res = await api.get(`/interviews/${sessionId}/current-question/`);
  return res.data;
}

export async function submitAnswer(sessionId, { questionId, audioBlob, fileName }) {
  const formData = new FormData();
  formData.append("question_id", questionId);
  formData.append("audio", audioBlob, fileName || "answer.webm");

  const res = await api.post(`/interviews/${sessionId}/answer/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchNextQuestion(sessionId) {
  const res = await api.post(`/interviews/${sessionId}/next-question/`);
  return res.data;
}

export async function completeInterview(sessionId) {
  const res = await api.post(`/interviews/${sessionId}/complete/`);
  return res.data;
}

export async function fetchReport(sessionId) {
  const res = await api.get(`/interviews/${sessionId}/report/`);
  return res.data;
}

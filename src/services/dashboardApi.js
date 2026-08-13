import { api } from "./api";

export async function fetchDashboard() {
  const res = await api.get("/dashboard/");
  return res.data;
}

export async function fetchInterviewHistory() {
  const res = await api.get("/interviews/history/");
  return res.data;
}

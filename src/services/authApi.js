import { api } from "./api";

export async function register({ username, email, password, password2 }) {
  const res = await api.post("/auth/register/", { username, email, password, password2 });
  return res.data;
}

export async function login({ username, password }) {
  const res = await api.post("/auth/login/", { username, password });
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout/");
  return res.data;
}

export async function fetchMe() {
  const res = await api.get("/auth/me/");
  return res.data;
}

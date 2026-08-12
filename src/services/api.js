import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Normalizes any Axios error into a plain { error, code } shape that
 * matches the backend's error contract, so UI components never have to
 * branch on where the failure came from (network vs. 4xx vs. 5xx).
 */
export function toApiError(err) {
  if (!err.response) {
    return {
      error: "Can't reach the server. Check your connection and that the backend is running.",
      code: "network_error",
    };
  }

  const data = err.response.data;

  if (data && typeof data === "object") {
    if (data.error) {
      return { error: data.error, code: data.code || "unknown_error" };
    }
    // DRF-style field validation errors: { field: ["message"] }
    const firstField = Object.keys(data)[0];
    if (firstField && Array.isArray(data[firstField])) {
      return { error: data[firstField][0], code: "validation_error", field: firstField };
    }
  }

  return { error: "Something went wrong. Please try again.", code: "unknown_error" };
}

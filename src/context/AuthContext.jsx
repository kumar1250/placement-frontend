import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { setAuthToken, onUnauthorized, toApiError } from "../services/api";
import { login as loginRequest, register as registerRequest, logout as logoutRequest, fetchMe } from "../services/authApi";

const STORAGE_KEY = "panel:authToken";

const AuthContext = createContext(null);

function readStoredToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistToken(token) {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable — auth still works for this tab via state
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(readStoredToken);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    persistToken(null);
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  // Any 401/403 from the API (expired token, wrong-owner access, etc.)
  // drops the session so RequireAuth sends the user back to /login.
  useEffect(() => {
    onUnauthorized(() => clearAuth());
  }, [clearAuth]);

  // Restore the session on first load.
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setAuthToken(token);
    fetchMe()
      .then(setUser)
      .catch(() => clearAuth())
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySession = useCallback(({ token: newToken, user: newUser }) => {
    persistToken(newToken);
    setAuthToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(
    async (username, password) => {
      try {
        const data = await loginRequest({ username, password });
        applySession(data);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: toApiError(err) };
      }
    },
    [applySession]
  );

  const register = useCallback(
    async (fields) => {
      try {
        const data = await registerRequest(fields);
        applySession(data);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: toApiError(err) };
      }
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      if (token) await logoutRequest();
    } catch {
      // Even if the server call fails, still clear the local session.
    }
    clearAuth();
  }, [token, clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API_BASE } from "@/lib/apiBase";

export interface Officer {
  name: string;
  designation: string;
}

interface AuthState {
  token: string | null;
  officer: Officer | null;
  loading: boolean; // true while restoring session on first load
}

interface AuthContextValue extends AuthState {
  login: (officerName: string, designation: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "truthtrace_auth";
const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): { token: string; officer: Officer } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, officer: null, loading: true });

  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setState({ token: null, officer: null, loading: false });
      return;
    }
    // Verify the stored token is still valid server-side (sessions can be
    // invalidated by logout elsewhere) before trusting it.
    fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${stored.token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("expired");
        return res.json();
      })
      .then((officer: Officer) => setState({ token: stored.token, officer, loading: false }))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setState({ token: null, officer: null, loading: false });
      });
  }, []);

  async function login(officerName: string, designation: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officer_name: officerName, designation, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail || "Authentication Failed — Invalid officer credentials.");
    }
    const data = await res.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: data.token, officer: data.officer }));
    setState({ token: data.token, officer: data.officer, loading: false });
  }

  function logout() {
    const stored = readStored();
    if (stored) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${stored.token}` },
      }).catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEY);
    setState({ token: null, officer: null, loading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Reads the current auth token directly from storage (for the API client,
 * which is a plain module and can't use the React hook). */
export function getStoredToken(): string | null {
  return readStored()?.token ?? null;
}

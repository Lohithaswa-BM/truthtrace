import type { AppConfig, CaseDetail, CaseSummary, IndexedMedia } from "@/types/case";
import { getStoredToken } from "@/lib/auth";
import { API_BASE as BASE } from "@/lib/apiBase";

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Thrown on a 401 so callers/UI can distinguish "session expired" from
 * other errors without duplicating auth logic per-call. */
export class UnauthorizedError extends Error {
  constructor() { super("Not authenticated"); this.name = "UnauthorizedError"; }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  health: () => get<{ status: string }>("/api/health"),
  config: () => get<AppConfig>("/api/config"),
  listCases: () => get<CaseSummary[]>("/api/cases"),
  getCase: (id: string) => get<CaseDetail>(`/api/cases/${id}`),
  listIndexedMedia: () => get<IndexedMedia[]>("/api/indexed-media"),

  // P4: real upload/analyze
  analyze: async (file: File, officer: string): Promise<CaseSummary> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("officer_name", officer);
    const res = await fetch(`${BASE}/api/analyze`, { method: "POST", body: fd, headers: authHeaders() });
    if (res.status === 401) throw new UnauthorizedError();
    if (!res.ok) throw new Error(`Analyze failed: ${res.status}`);
    return res.json();
  },

  reportUrl: (caseId: string) => `${BASE}/api/cases/${caseId}/report.pdf`,

  // The report endpoint requires auth, so plain <a href>/window.open can't
  // carry the token — fetch it as an authenticated blob instead.
  fetchReportBlob: async (caseId: string): Promise<Blob> => {
    const res = await fetch(`${BASE}/api/cases/${caseId}/report.pdf`, { headers: authHeaders() });
    if (res.status === 401) throw new UnauthorizedError();
    if (!res.ok) throw new Error(`Report fetch failed: ${res.status}`);
    return res.blob();
  },
};

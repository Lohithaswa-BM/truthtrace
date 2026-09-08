// Backend API base URL. In local dev this is unset, so requests stay
// relative ("") and go through the Vite dev proxy (see vite.config.ts)
// straight to localhost:8000. In production (e.g. Vercel), set
// VITE_API_BASE_URL to the deployed backend's origin — a static frontend
// build has no dev proxy to rely on.
export const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? "";

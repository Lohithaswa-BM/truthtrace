/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API origin for production builds (e.g. Vercel). Unset in local
   * dev, where requests stay relative and go through the Vite dev proxy. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

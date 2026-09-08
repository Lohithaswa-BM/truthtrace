# TRUTH TRACE — Deployment Notes

This documents what was inspected, what was changed, and — critically —
what will **not** work correctly if deployed as-is on a serverless platform
like Vercel. Read the "Blockers" section before deploying the backend.

## Architecture as discovered

- **Frontend**: Vite + React + TypeScript, static build (`vite build` →
  `frontend/dist`). All API calls go through `frontend/src/lib/api.ts` and
  `frontend/src/lib/auth.tsx`, which previously hardcoded relative URLs
  (`fetch("/api/...")`) that only work behind Vite's dev proxy
  (`vite.config.ts` → `server.proxy["/api"]`).
- **Backend**: FastAPI, single ASGI app at `backend/app/main.py:app`. Routers:
  `auth`, `cases`, `analyze`, `meta`. Runs via `uvicorn app.main:app`.
- **Database**: SQLAlchemy + SQLite, a single file at
  `backend/truthtrace.db` (path from `Settings.DATABASE_URL`, local disk by
  default).
- **Evidence storage**: uploaded files are written directly to local disk
  under `backend/app/storage/<case_id>/` (`Settings.STORAGE_DIR`), and later
  read back from that same path (media serving, video frame extraction).
- **PDF generation**: fully in-memory (`io.BytesIO` in
  `app/services/report.py`), streamed as the HTTP response. No disk
  dependency — this part is serverless-safe as-is.
- **Video fingerprinting**: `app/core/video.py` and `app/core/metadata.py`
  shell out to `ffmpeg`/`ffprobe` via `subprocess`, detected with
  `shutil.which()`. There is an honest fallback
  (`content_hash_fallback`, non-perceptual) when these binaries are absent —
  but that fallback exists for local robustness, not deployment.
- **CORS**: previously hardcoded to two localhost origins only.

## Deployment blockers (backend) — do not ignore these

These are platform-architecture mismatches, not code bugs. Deploying the
backend to Vercel's Python serverless runtime as-is will **not** work
correctly for the full flow:

1. **SQLite on local disk is not viable on Vercel.** Serverless functions
   get an ephemeral, read-only (or at best per-invocation-scoped)
   filesystem. Every cold start can see a different, empty
   `truthtrace.db` — cases, the demo case, officer accounts (Phase 5.2
   auth!), and indexed evidence would be inconsistent or vanish between
   requests. **This affects login, dashboard, cases, and evidence.**
2. **Local evidence file storage is not viable on Vercel.** Uploaded
   images/videos written to `STORAGE_DIR` will not reliably survive past
   the current invocation, and won't be visible to a different serverless
   instance handling a later request for the same file (e.g. media
   playback, PDF regeneration referencing stored evidence).
3. **`ffmpeg`/`ffprobe` are not available in Vercel's Python serverless
   runtime**, and there is no writable persistent layer to install them
   into at build time in a way that survives to request time. Real video
   perceptual fingerprinting (`perceptual_video_frames`) and real video
   metadata (`ffprobe` duration/resolution) would silently degrade to the
   existing fallback paths (`content_hash_fallback`, "Unknown" metadata)
   for every video, not just when genuinely unavailable — because on
   Vercel they'd *always* be unavailable.

None of this is worked around in this pass, per instructions: the correct
fix is a managed Postgres database (e.g. Neon, Supabase, Vercel Postgres)
and managed object storage (e.g. S3, Vercel Blob) plus a host that gives
you a real, persistent filesystem or a container with `ffmpeg` installed
(e.g. Render, Railway, Fly.io, a Docker-based host, or a VM) — none of
which is "hack around it," it's "use infrastructure this architecture
actually needs." That is out of scope for this pass (no new features/
rewrites), so it's called out here instead of quietly working by accident.

**If you deploy the backend anywhere with a real persistent filesystem and
ffmpeg installed (e.g. Docker on Render/Railway/Fly.io, or a VM), the
existing code runs unmodified** — `DATABASE_URL` and `STORAGE_DIR` are
already configurable, and `ffmpeg_available()` will correctly detect the
binaries if present. The blockers above are specific to Vercel's
serverless Python runtime, not the app itself.

## Files changed (frontend)

- `frontend/src/lib/apiBase.ts` — **new**. Single source of truth for the
  backend origin: `import.meta.env.VITE_API_BASE_URL ?? ""`.
- `frontend/src/lib/api.ts` — now imports `API_BASE` from `apiBase.ts`
  instead of a hardcoded empty string. No other logic changed.
- `frontend/src/lib/auth.tsx` — its three direct `fetch("/api/...")` calls
  (login, logout, session restore) now use the same `API_BASE` prefix.
  No other logic changed.
- `frontend/src/vite-env.d.ts` — **new**. Standard Vite env-var type
  declarations so `import.meta.env.VITE_API_BASE_URL` typechecks.
- `frontend/.env.example` — **new**. Documents `VITE_API_BASE_URL`.

## Files changed (backend)

- `backend/app/core/config.py` — comment-only change clarifying
  `CORS_ORIGINS` is already overridable via a JSON-array env var (verified
  working with `pydantic-settings`, no code change was needed for the
  mechanism itself).
- `backend/.env.example` — **new**. Documents `DATABASE_URL`,
  `CORS_ORIGINS`, `STORAGE_DIR`.

No forensic pipeline, database model, authentication logic, or dashboard
code was touched.

## Required environment variables

### Frontend (public — safe to expose in the browser bundle)

| Variable | Where | Required | Value |
|---|---|---|---|
| `VITE_API_BASE_URL` | Vercel Project → Environment Variables | Production only | Deployed backend's public origin, e.g. `https://truthtrace-api.example.com` (no trailing slash). Leave unset for local dev. |

### Backend (server-side only — never sent to the frontend)

| Variable | Required for a real (non-Vercel) deploy | Value |
|---|---|---|
| `DATABASE_URL` | Yes, if not using local SQLite | A real Postgres (or other SQLAlchemy-supported) connection string |
| `CORS_ORIGINS` | Yes | JSON array of allowed frontend origins, e.g. `["https://truthtrace.vercel.app"]` |
| `STORAGE_DIR` | Yes, if not using local disk | Path to persistent, writable storage |

No credentials, API keys, or secrets currently exist in this codebase —
none were found during inspection, and none were introduced.

## Frontend deployment steps (Vercel)

1. In Vercel, import the repo, set the project root to `frontend/`.
2. Build command: `npm run build` (unchanged). Output directory: `dist`
   (unchanged, Vite default).
3. Set the environment variable `VITE_API_BASE_URL` to your deployed
   backend's origin, in Vercel Project Settings → Environment Variables
   (Production, and Preview if desired).
4. Deploy. Local development is unaffected — `npm run dev` still works
   exactly as before with no env var set, using the existing Vite proxy.

## Backend deployment steps (NOT Vercel — see blockers above)

1. Choose a host that gives the FastAPI app a real, persistent filesystem
   (or a managed volume) and lets you install `ffmpeg`: e.g. Render,
   Railway, Fly.io, or a Docker container on any VM.
2. Provision a managed Postgres database and set `DATABASE_URL` to it
   (SQLAlchemy already supports this — no code change needed to switch
   from SQLite to Postgres, only the connection string and a Postgres
   driver such as `psycopg2-binary`, which is not currently declared in
   `requirements.txt` and would need to be added when you actually pick a
   database).
3. Mount persistent storage at the path you set `STORAGE_DIR` to (or leave
   the default if the host provides a persistent disk at that path).
4. Ensure `ffmpeg`/`ffprobe` are installed in the deployment image (e.g. via
   `apt-get install ffmpeg` in a Dockerfile, or the host's buildpack).
5. Set `CORS_ORIGINS` to your deployed frontend's origin.
6. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   (standard ASGI entrypoint, already present, unchanged).
7. On boot, `lifespan` already calls `seed()`, which creates tables and
   seeds the demo case/officer if absent — this works against a fresh
   Postgres database exactly as it does against local SQLite, since it's
   plain SQLAlchemy with no SQLite-specific syntax.

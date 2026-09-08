import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [officerName, setOfficerName] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(officerName, designation, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authentication Failed — Invalid officer credentials."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-root px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 ring-1 ring-accent-blue/30">
            <ShieldCheck size={22} className="text-accent-blue" />
          </div>
          <div className="text-[17px] font-bold tracking-wide text-text-primary">
            TRUTH<span className="text-accent-blue">TRACE</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-text-muted">
            AI Digital Forensic Platform
          </div>
        </div>

        <form onSubmit={handleSubmit} className="tt-card space-y-4 p-6">
          <h1 className="text-[15px] font-semibold text-text-primary">Officer Sign In</h1>

          <div>
            <label className="mb-1 block text-[11px] text-text-muted">Officer Name</label>
            <input
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              placeholder="e.g. Demo Officer"
              required
              className="w-full rounded-lg border border-border-subtle bg-bg-cardalt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-text-muted">Designation</label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Cyber Crime Officer"
              required
              className="w-full rounded-lg border border-border-subtle bg-bg-cardalt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-border-subtle bg-bg-cardalt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue/50"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-status-red/40 bg-status-red/10 px-3 py-2 text-[12px] text-status-red">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-bluedim to-accent-blue py-2.5 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Authenticating…</>
            ) : (
              "Authenticate & Continue"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-text-muted">
          Chandigarh Police · Digital Forensics Unit
        </p>
      </div>
    </div>
  );
}

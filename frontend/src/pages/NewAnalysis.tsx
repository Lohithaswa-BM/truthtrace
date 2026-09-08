import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Panel } from "@/components/ui/Panel";
import { api } from "@/lib/api";

export function NewAnalysis() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [officer, setOfficer] = useState("Inspector Arjun Singh");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = useCallback((f: File | null) => {
    if (!f) return;
    setFile(f);
    setError(null);
    setStatus("idle");
  }, []);

  async function submit() {
    if (!file) return;
    setStatus("uploading");
    setError(null);
    try {
      const result = await api.analyze(file, officer);
      navigate(`/cases/${result.id}`);
    } catch (err) {
      // Backend unreachable, bad file, or server-side failure — surface it
      // without crashing; the existing demo case remains available via
      // Dashboard's own fallback.
      setStatus("error");
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Header title="New Analysis" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <Panel title="Upload Evidence">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pick(e.dataTransfer.files?.[0] ?? null);
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragOver ? "border-accent-blue bg-accent-blue/5" : "border-border-subtle hover:border-accent-blue/40"
              }`}
            >
              <UploadCloud size={32} className="text-accent-blue" />
              <div className="text-sm text-text-secondary">
                {file ? (
                  <span className="font-medium text-text-primary">{file.name}</span>
                ) : (
                  <>Drop an image or video here, or click to browse</>
                )}
              </div>
              <div className="text-[11px] text-text-muted">
                Supported: JPG, PNG, WEBP, MP4, MOV, WEBM · up to 200MB
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-[11px] text-text-muted">Investigating Officer</label>
              <input
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-bg-cardalt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue/50"
              />
            </div>

            {status === "error" && error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-status-red/40 bg-status-red/10 px-3 py-2 text-[12px] text-status-red">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={submit}
              disabled={!file || status === "uploading"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-bluedim to-accent-blue py-2.5 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "uploading" ? (
                <><Loader2 size={15} className="animate-spin" /> Analyzing…</>
              ) : (
                "Run Forensic Analysis"
              )}
            </button>
          </Panel>

          <p className="text-[11px] text-text-muted">
            AI-detection and manipulation-type results are demo/simulated outputs
            behind a pluggable detector. Hashing, metadata, and fingerprint matching
            are genuinely computed from the uploaded file.
          </p>
        </div>
      </div>
    </div>
  );
}

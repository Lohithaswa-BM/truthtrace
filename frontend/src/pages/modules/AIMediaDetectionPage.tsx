import { ScanEye, Cpu, AlertCircle, ShieldCheck } from "lucide-react";
import { ModulePageShell } from "@/components/dashboard/ModulePageShell";
import { Panel, DataSourceBadge, ProgressBar } from "@/components/ui/Panel";

const SEVERITY_COLOR: Record<string, string> = {
  high: "text-status-red", medium: "text-status-orange", low: "text-status-green",
};
const SEVERITY_BAR: Record<string, string> = {
  high: "bg-status-red", medium: "bg-status-orange", low: "bg-status-green",
};
const CLASSIFICATION_COLOR: Record<string, string> = {
  LIKELY_AI_GENERATED: "text-status-red",
  LIKELY_AUTHENTIC: "text-status-green",
  INCONCLUSIVE: "text-status-orange",
};

function formatTimestamp(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).replace(",", "");
}

export function AIMediaDetectionPage() {
  return (
    <ModulePageShell title="AI Media Detection">
      {(data) => {
        const ai = data.ai_detection;
        const hasResult = ai && typeof ai.score === "number";
        const isMlBased = ai.is_ml_based ?? false;
        const classificationColor = ai.classification ? CLASSIFICATION_COLOR[ai.classification] : undefined;

        return (
          <>
            <Panel
              title="AI / Synthetic Media Detection"
              right={hasResult ? <DataSourceBadge source={ai.data_source} /> : undefined}
            >
              {!hasResult ? (
                <div className="flex items-center gap-2 py-6 text-[13px] text-text-muted">
                  <ScanEye size={16} /> No AI-detection result available for this evidence.
                </div>
              ) : (
                <>
                  {/* ML status banner — honestly distinguishes a real model result
                      from a graceful fallback, per forensic-integrity requirements */}
                  <div
                    className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[11px] ${
                      isMlBased
                        ? "border-accent-blue/25 bg-accent-blue/10 text-accent-blue"
                        : "border-status-orange/30 bg-status-orange/10 text-status-orange"
                    }`}
                  >
                    {isMlBased ? <Cpu size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
                    <span>
                      {isMlBased
                        ? "This result comes from a real model-inference pipeline (ONNX Runtime), run on this evidence."
                        : "No AI-detection model result available for this evidence — this is an honest fallback, not a prediction."}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className={`text-[22px] font-semibold ${classificationColor ?? SEVERITY_COLOR[ai.severity] ?? "text-text-primary"}`}>
                      {ai.label}
                    </span>
                    <span className={`text-[30px] font-bold ${classificationColor ?? SEVERITY_COLOR[ai.severity] ?? "text-text-primary"}`}>
                      {Math.round(ai.score)}%
                    </span>
                  </div>
                  <ProgressBar value={ai.score} color={SEVERITY_BAR[ai.severity] ?? "bg-accent-blue"} className="mt-3" />

                  {ai.explanation && (
                    <p className="mt-3 text-[12px] text-text-secondary">{ai.explanation}</p>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                    <div className="rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                      <div className="text-text-muted">Classification</div>
                      <div className={`mt-1 font-medium ${classificationColor ?? "text-text-primary"}`}>
                        {ai.classification ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                      <div className="text-text-muted">Model</div>
                      <div className="mt-1 truncate font-medium text-text-secondary">
                        {ai.model_name && ai.model_name !== "none" ? `${ai.model_name} (${ai.model_version})` : "None (fallback)"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                      <div className="text-text-muted">Analyzed At</div>
                      <div className="mt-1 font-medium text-text-secondary">{formatTimestamp(ai.analyzed_at)}</div>
                    </div>
                    <div className="rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                      <div className="text-text-muted">Evidence / Media</div>
                      <div className="mt-1 truncate font-medium text-text-secondary">{data.evidence.filename}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-border-subtle bg-bg-cardalt px-3 py-2.5 text-[11px] text-text-muted">
                    <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                    <span>
                      This is a probabilistic model estimate, never definitive proof. It is reported
                      separately from deterministic forensic checks (SHA-256, metadata, perceptual
                      fingerprinting) shown in the Digital Fingerprinting module.
                    </span>
                  </div>
                </>
              )}
            </Panel>

            {data.manipulation.signals.length > 0 && (
              <Panel title="Related Manipulation Signals">
                <p className="mb-2 text-[11px] text-text-muted">
                  These heuristic signals feed the separate Manipulation Analysis module, not the
                  AI-detection model above.
                </p>
                <ul className="space-y-1.5">
                  {data.manipulation.signals.map((s) => (
                    <li key={s.name} className="flex items-center justify-between text-[12px]">
                      <span className="text-text-secondary">{s.name}</span>
                      <span className="font-mono text-text-primary">{s.score.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </>
        );
      }}
    </ModulePageShell>
  );
}

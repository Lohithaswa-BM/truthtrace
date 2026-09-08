import { SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { ModulePageShell } from "@/components/dashboard/ModulePageShell";
import { Panel, DataSourceBadge, ProgressBar } from "@/components/ui/Panel";
import { TemporalChart } from "@/components/dashboard/TemporalChart";

const TAXONOMY = [
  "AI Generated", "Face Swap", "Traditionally Edited", "Copy-Move Manipulation",
  "Metadata Tampering", "Recompression / Re-encoding",
  "No Significant Manipulation Detected", "Suspicious / Unknown",
];

export function ManipulationPage() {
  return (
    <ModulePageShell title="Manipulation Analysis">
      {(data) => {
        const m = data.manipulation;
        return (
          <>
            <Panel title="Manipulation Classification" right={<DataSourceBadge source={m.data_source} />}>
              <div className="flex items-end justify-between">
                <span className="text-[22px] font-semibold text-status-orange">{m.type}</span>
                <span className="text-[30px] font-bold text-status-orange">{Math.round(m.score)}%</span>
              </div>
              <ProgressBar value={m.score} color="bg-status-orange" className="mt-3" />

              {m.classification && (
                <div className="mt-4 rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted">Classification (taxonomy key)</span>
                    <span className="font-mono text-accent-purple">{m.classification}</span>
                  </div>
                  {typeof m.classification_confidence === "number" && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">Classifier Confidence</span>
                      <span className="font-medium text-text-primary">
                        {m.classification_confidence.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {m.classification_evidence && m.classification_evidence.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-medium text-text-secondary">Evidence / Reasoning</div>
                  <ul className="space-y-1.5">
                    {m.classification_evidence.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-text-secondary">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-status-green" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 border-t border-border-faint pt-3 text-[11px] text-text-muted">
                Method:{" "}
                <span className="font-mono">{m.classification_method ?? "heuristic_demo"}</span> — a
                deterministic rule-based classifier over known signal patterns, not a trained
                machine-learning model.
              </div>
            </Panel>

            <Panel title="Detected Signals">
              <ul className="space-y-2">
                {m.signals.map((s) => (
                  <li key={s.name} className="flex items-center justify-between text-[12px]">
                    <span className="text-text-secondary">{s.name}</span>
                    <span className="font-mono text-text-primary">{s.score.toFixed(2)}</span>
                  </li>
                ))}
                {m.signals.length === 0 && (
                  <li className="text-[12px] text-text-muted">No signal-level data available.</li>
                )}
              </ul>
              {m.temporal.length > 0 && (
                <div className="mt-4 border-t border-border-faint pt-3">
                  <TemporalChart data={m.temporal} anomaly={m.anomaly} />
                </div>
              )}
            </Panel>

            <Panel title="Supported Classification Taxonomy">
              <div className="flex flex-wrap gap-2">
                {TAXONOMY.map((t) => (
                  <span
                    key={t}
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${
                      t === m.type
                        ? "border-accent-purple/50 bg-accent-purple/15 text-accent-purple"
                        : "border-border-subtle text-text-muted"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Panel>
          </>
        );
      }}
    </ModulePageShell>
  );
}

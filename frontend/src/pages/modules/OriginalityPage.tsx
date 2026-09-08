import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ModulePageShell } from "@/components/dashboard/ModulePageShell";
import { Panel, DataSourceBadge, ProgressBar } from "@/components/ui/Panel";

export function OriginalityPage() {
  return (
    <ModulePageShell title="Originality Check">
      {(data) => {
        const o = data.originality;
        const fp = data.fingerprint;
        const isNoMatch = o.label === "No Indexed Match Found" || fp.matches_found === 0;
        return (
          <>
            <Panel title="Originality Assessment" right={<DataSourceBadge source={o.data_source} />}>
              <div className="flex items-end justify-between">
                <span className="text-[22px] font-semibold text-status-yellow">{o.label}</span>
                <span className="text-[30px] font-bold text-status-yellow">{Math.round(o.score)}%</span>
              </div>
              <ProgressBar value={o.score} color="bg-status-yellow" className="mt-3" />

              {typeof o.confidence === "number" && (
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Assessment Confidence</span>
                  <span className="font-medium text-text-primary">{o.confidence.toFixed(1)}%</span>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent-blue/25 bg-accent-blue/10 px-3 py-2 text-[11px] text-accent-blue">
                <AlertCircle size={14} className="shrink-0" />
                {isNoMatch ? (
                  <span>
                    No match was found in the available indexed evidence library. This does
                    NOT prove the file is the absolute original — it only means no matching
                    copy exists in our local index.
                  </span>
                ) : (
                  <span>
                    Assessment is based on similarity to items in the local indexed evidence
                    library, not an exhaustive or live search of all media.
                  </span>
                )}
              </div>

              {o.evidence && o.evidence.length > 0 && (
                <div className="mt-4">
                  <div className="mb-1.5 text-[11px] font-medium text-text-secondary">
                    Supporting Evidence
                  </div>
                  <ul className="space-y-1.5">
                    {o.evidence.map((e, i) => (
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
                <span className="font-mono">{o.assessment_method ?? "heuristic_demo"}</span>
              </div>
            </Panel>

            <Panel title="Indexed Matching Relationship" right={<DataSourceBadge source={fp.data_source} />}>
              <div className="flex gap-8 text-[12px]">
                <div>
                  <div className="text-text-muted">Matches Found</div>
                  <div className="mt-1 text-[18px] font-semibold text-text-primary">{fp.matches_found}</div>
                </div>
                <div>
                  <div className="text-text-muted">Best Similarity</div>
                  <div className="mt-1 text-[18px] font-semibold text-status-green">
                    {Math.round(fp.similarity)}%
                  </div>
                </div>
                <div>
                  <div className="text-text-muted">Fingerprint Method</div>
                  <div className="mt-1 text-[12px] font-medium text-text-secondary">{fp.method ?? "—"}</div>
                </div>
              </div>
              {fp.matches.length > 0 && (
                <div className="mt-3 divide-y divide-border-faint">
                  {fp.matches.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2 text-[12px]">
                      <span className="text-accent-blue">{m.source_handle ?? m.label}</span>
                      <span className="text-text-muted">{m.first_seen_at ?? "—"}</span>
                      <span className="font-mono text-text-primary">{Math.round(m.similarity)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </>
        );
      }}
    </ModulePageShell>
  );
}

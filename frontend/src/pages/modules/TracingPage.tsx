import { AlertCircle, ExternalLink } from "lucide-react";
import { ModulePageShell } from "@/components/dashboard/ModulePageShell";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";
import { MediaSpreadTimeline } from "@/components/dashboard/MediaSpreadTimeline";

export function TracingPage() {
  return (
    <ModulePageShell title="Origin & Path Tracing">
      {(data) => {
        const t = data.tracing;
        const hasData = t.earliest_timestamp || t.nodes.length > 0;
        return (
          <>
            <Panel title="Earliest Known Indexed Occurrence" right={<DataSourceBadge source={t.data_source} />}>
              {!hasData ? (
                <div className="py-4 text-[12px] text-text-muted">
                  No matching evidence found in the indexed library — no tracing data available
                  for this case.
                </div>
              ) : (
                <>
                  <div className="text-[18px] font-semibold text-text-primary">
                    {t.earliest_timestamp}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[12px]">
                    <span className="text-text-muted">Source:</span>
                    <span className="text-accent-blue">
                      {t.earliest_source}
                      {t.earliest_platform ? ` (${t.earliest_platform})` : ""}
                    </span>
                    <span className="rounded bg-status-green/15 px-1.5 py-px text-[10px] font-medium text-status-green">
                      {t.earliest_confidence}
                    </span>
                  </div>
                </>
              )}

              <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent-blue/25 bg-accent-blue/10 px-3 py-2.5 text-[11px] text-accent-blue">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>
                  {t.earliest_is_indexed_only !== false
                    ? "This is the earliest sighting within our local indexed evidence library — it is NOT asserted as the absolute original source. Tracing is based on currently available indexed evidence, not live social-media crawling or internet-wide search."
                    : "Tracing is based on currently available indexed evidence, not live social-media crawling."}
                </span>
              </div>
            </Panel>

            {t.dissemination_path && t.dissemination_path.length > 0 && (
              <Panel title="Chronological Dissemination Path">
                <div className="divide-y divide-border-faint">
                  {t.dissemination_path.map((ev, i) => (
                    <div key={ev.evidence_id} className="flex items-center gap-3 py-2.5 text-[12px]">
                      <span className="w-5 shrink-0 text-center font-mono text-text-muted">{i + 1}</span>
                      <span className="w-28 shrink-0 font-mono text-text-secondary">{ev.timestamp ?? "—"}</span>
                      <span className="flex-1 truncate text-accent-blue">
                        {ev.source_handle ?? ev.evidence_id}
                        {ev.platform ? ` · ${ev.platform}` : ""}
                      </span>
                      <span className="shrink-0 font-mono text-text-primary">
                        {Math.round(ev.similarity)}%
                      </span>
                      {ev.url && (
                        <a href={ev.url} target="_blank" rel="noreferrer" className="shrink-0 text-text-muted hover:text-accent-blue">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {t.timeline.length > 0 && <MediaSpreadTimeline data={t} />}
          </>
        );
      }}
    </ModulePageShell>
  );
}

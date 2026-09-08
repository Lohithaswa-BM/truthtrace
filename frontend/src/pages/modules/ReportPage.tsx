import { ModulePageShell } from "@/components/dashboard/ModulePageShell";
import { Panel } from "@/components/ui/Panel";
import { ForensicReport } from "@/components/dashboard/ForensicReport";
import { api } from "@/lib/api";

export function ReportPage() {
  return (
    <ModulePageShell title="Forensic Report">
      {(data) => (
        <>
          <Panel title="Case Summary">
            <div className="grid grid-cols-2 gap-4 text-[12px] sm:grid-cols-4">
              <div>
                <div className="text-text-muted">Case ID</div>
                <div className="mt-1 font-mono text-text-primary">{data.id}</div>
              </div>
              <div>
                <div className="text-text-muted">Status</div>
                <div className="mt-1 font-medium text-status-green">{data.status}</div>
              </div>
              <div>
                <div className="text-text-muted">Forensic Score</div>
                <div className="mt-1 font-semibold text-text-primary">
                  {data.forensic_score ?? "—"}/100
                </div>
              </div>
              <div>
                <div className="text-text-muted">Confidence</div>
                <div className="mt-1 font-medium text-accent-purple">
                  {data.confidence_label ?? "—"}
                </div>
              </div>
            </div>
            <div className="mt-3 border-t border-border-faint pt-3 text-[12px] text-text-secondary">
              {data.evidence.filename} · {data.ai_detection.label} ({Math.round(data.ai_detection.score)}%) ·{" "}
              {data.manipulation.type} ({Math.round(data.manipulation.score)}%) · {data.originality.label}
            </div>
          </Panel>

          <ForensicReport
            report={data.report}
            onPreview={async () => {
              const blob = await api.fetchReportBlob(data.id);
              window.open(URL.createObjectURL(blob), "_blank");
            }}
            onDownload={async () => {
              const blob = await api.fetchReportBlob(data.id);
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `${data.id}_report.pdf`;
              a.click();
            }}
          />
        </>
      )}
    </ModulePageShell>
  );
}

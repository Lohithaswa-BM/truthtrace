import { CheckCircle2, Download, FileText } from "lucide-react";
import type { ReportInfo } from "@/types/case";
import { Panel } from "@/components/ui/Panel";

export function ForensicReport({
  report,
  onPreview,
  onDownload,
}: {
  report: ReportInfo;
  onPreview?: () => void;
  onDownload?: () => void;
}) {
  return (
    <Panel
      title="Forensic Report"
      right={
        report.status === "Ready" ? (
          <span className="rounded bg-status-green/15 px-2 py-0.5 text-[10px] font-medium text-status-green ring-1 ring-status-green/25">
            Ready
          </span>
        ) : (
          <span className="rounded bg-status-orange/15 px-2 py-0.5 text-[10px] font-medium text-status-orange">
            {report.status}
          </span>
        )
      }
    >
      <div className="text-[11px] text-text-muted">
        Report ID: <span className="font-mono text-text-secondary">{report.id ?? "—"}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onPreview}
          className="flex-1 rounded-lg border border-border-subtle bg-bg-hover/50 py-2 text-[12px] font-medium text-text-secondary transition hover:border-accent-blue/40 hover:text-accent-blue"
        >
          Preview Report
        </button>
        <button
          onClick={onDownload}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-purpledim to-accent-purple py-2 text-[12px] font-semibold text-white shadow-glowpurple transition hover:brightness-110"
        >
          <Download size={14} /> Download PDF
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        {/* preview thumbnail */}
        <div className="flex h-[112px] w-[84px] shrink-0 flex-col gap-1 rounded-md bg-white/95 p-2 ring-1 ring-border-subtle">
          <div className="flex items-center gap-1">
            <FileText size={8} className="text-slate-500" />
            <div className="h-1 w-8 rounded bg-slate-300" />
          </div>
          <div className="mt-1 space-y-[3px]">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-[2px] rounded bg-slate-200" style={{ width: `${90 - (i % 3) * 18}%` }} />
            ))}
          </div>
          <div className="mt-auto h-4 rounded bg-slate-100" />
        </div>

        {/* includes */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 text-[11px] text-text-muted">The report includes:</div>
          <ul className="space-y-1.5">
            {report.includes.map((it) => (
              <li key={it} className="flex items-center gap-2 text-[11px] text-text-secondary">
                <CheckCircle2 size={13} className="shrink-0 text-status-green" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

import { useCase } from "@/hooks/useCase";
import { api } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { EvidenceHeader } from "@/components/dashboard/EvidenceHeader";
import { ForensicScore } from "@/components/dashboard/ForensicScore";
import { AnalysisCards } from "@/components/dashboard/AnalysisCards";
import { ManipulationAnalysis } from "@/components/dashboard/ManipulationAnalysis";
import { FingerprintPanel } from "@/components/dashboard/FingerprintPanel";
import { ProvenanceOverview } from "@/components/dashboard/ProvenanceOverview";
import { OriginPathGraph } from "@/components/dashboard/OriginPathGraph";
import { ExplainableForensics } from "@/components/dashboard/ExplainableForensics";
import { MediaSpreadTimeline } from "@/components/dashboard/MediaSpreadTimeline";
import { ForensicReport } from "@/components/dashboard/ForensicReport";

function formatUploaded(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).replace(",", "");
}

export function Dashboard({ caseId }: { caseId?: string }) {
  const { data, loading, usingFallback, error } = useCase(caseId);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-secondary">
        Loading case…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-status-red">
        {error ?? "Case not found."}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header caseId={data.id} status={data.status} officer={data.officer_name} />

      <div className="flex-1 overflow-y-auto p-4">
        {usingFallback && (
          <div className="mb-4 rounded-lg border border-status-orange/40 bg-status-orange/10 px-3 py-1.5 text-[11px] text-status-orange">
            Backend offline — showing bundled demo case. Start the API to load live data.
          </div>
        )}

        {/* Two-column shell: content (fluid) + right rail (fixed) */}
        <div className="grid grid-cols-[1fr_320px] items-start gap-4">
          {/* LEFT + CENTER */}
          <div className="min-w-0 space-y-4">
            <EvidenceHeader
              evidence={data.evidence}
              uploadedOn={formatUploaded(data.evidence.uploaded_at)}
            />
            <AnalysisCards caseData={data} />

            <div className="grid grid-cols-[1.4fr_1fr] items-start gap-4">
              <div className="min-w-0 space-y-4">
                <ManipulationAnalysis data={data.manipulation} />
                <ExplainableForensics data={data.explainability} />
              </div>
              <div className="min-w-0 space-y-4">
                <FingerprintPanel data={data.fingerprint} />
                <ProvenanceOverview data={data.provenance} />
                <MediaSpreadTimeline data={data.tracing} />
              </div>
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div className="space-y-4">
            <ForensicScore score={data.forensic_score ?? 0} confidenceLabel={data.confidence_label} />
            <OriginPathGraph data={data.tracing} />
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
          </div>
        </div>
      </div>
    </div>
  );
}

import { Fingerprint, Copy } from "lucide-react";
import type { Fingerprint as FP } from "@/types/case";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";

export function FingerprintPanel({
  data,
  onViewMatches,
}: {
  data: FP;
  onViewMatches?: () => void;
}) {
  return (
    <Panel
      title="Originality & Fingerprint"
      right={<DataSourceBadge source={data.data_source} />}
    >
      <div className="flex gap-4">
        {/* fingerprint mark */}
        <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-lg bg-bg-cardalt ring-1 ring-border-subtle">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-blue/10" />
          <Fingerprint size={68} className="relative text-accent-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" strokeWidth={1.2} />
        </div>

        {/* details */}
        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-text-muted">Digital Fingerprint (pHash)</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[14px] font-medium text-accent-blue">
              {data.phash_display ?? data.phash ?? "—"}
            </span>
            <button
              className="text-text-muted hover:text-text-secondary"
              onClick={() => data.phash && navigator.clipboard?.writeText(data.phash)}
              title="Copy hash"
            >
              <Copy size={13} />
            </button>
          </div>

          <div className="mt-3 flex gap-8">
            <div>
              <div className="text-[11px] text-text-muted">Matches Found</div>
              <div className="text-[19px] font-semibold text-text-primary">{data.matches_found}</div>
            </div>
            <div>
              <div className="text-[11px] text-text-muted">Similarity Score</div>
              <div className="text-[19px] font-semibold text-status-green">
                {Math.round(data.similarity)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onViewMatches}
        className="mt-3.5 w-full rounded-lg border border-border-subtle bg-bg-hover/50 py-2 text-[12px] font-medium text-text-secondary transition hover:border-accent-blue/40 hover:text-accent-blue"
      >
        View All Matches
      </button>
    </Panel>
  );
}

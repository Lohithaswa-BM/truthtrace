import { Play, Pencil, Volume2 } from "lucide-react";
import type { EvidenceOut } from "@/types/case";
import { DataSourceBadge } from "@/components/ui/Panel";

function Fact({ label, value }: { label: string; value?: string | null }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-text-muted">{label}:</span>{" "}
      <span className="text-text-secondary">{value ?? "—"}</span>
    </span>
  );
}

export function EvidenceHeader({
  evidence,
  uploadedOn,
}: {
  evidence: EvidenceOut;
  uploadedOn: string;
}) {
  return (
    <section className="tt-card flex gap-4 p-4">
      {/* Thumbnail */}
      <div className="relative h-[104px] w-[168px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#1a2438] to-[#0c1220] ring-1 ring-border-subtle">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/20 backdrop-blur">
            <Play size={16} className="ml-0.5 text-white" fill="white" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/50 px-2 py-1">
          <Play size={10} className="text-white" fill="white" />
          <div className="h-0.5 flex-1 rounded-full bg-white/25">
            <div className="h-full w-0 rounded-full bg-accent-blue" />
          </div>
          <span className="font-mono text-[9px] text-white/80">
            00:00 / {evidence.duration ?? "00:00"}
          </span>
          <Volume2 size={10} className="text-white/70" />
        </div>
      </div>

      {/* Facts */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-[17px] font-semibold text-text-primary">
            {evidence.filename}
          </h2>
          <Pencil size={13} className="shrink-0 text-text-muted hover:text-text-secondary" />
          <DataSourceBadge source={evidence.data_source} />
        </div>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
          <Fact label="Uploaded on" value={uploadedOn} />
          <Fact label="Uploaded by" value={evidence.uploaded_by} />
        </div>
        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
          <Fact label="File Type" value={evidence.file_type} />
          <Fact label="Duration" value={evidence.duration} />
          <Fact label="Resolution" value={evidence.resolution} />
          <Fact label="Size" value={evidence.size_label} />
        </div>
        <div className="mt-2 text-[11px]">
          <span className="text-text-muted">Hash (SHA-256): </span>
          <span className="font-mono tracking-tight text-text-secondary">
            {evidence.sha256_display ?? evidence.sha256 ?? "—"}
          </span>
        </div>
      </div>
    </section>
  );
}

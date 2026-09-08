import type { Provenance } from "@/types/case";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";

// Color a provenance value by how "clean" it is.
function valueClass(v: string) {
  const neg = ["inconsistent"];
  const warn = ["not found", "unavailable"];
  const lv = v.toLowerCase();
  if (neg.some((n) => lv.includes(n))) return "text-status-red";
  if (warn.some((n) => lv.includes(n))) return "text-status-orange";
  return "text-text-secondary";
}

export function ProvenanceOverview({ data }: { data: Provenance }) {
  const rows: [string, string][] = [
    ["Metadata", data.metadata],
    ["C2PA Provenance", data.c2pa],
    ["Recording Device", data.recording_device],
    ["Software Used", data.software],
    ["Creation Time", data.creation_time],
  ];
  return (
    <Panel
      title="Provenance Overview"
      right={<DataSourceBadge source={data.data_source} />}
    >
      <div className="divide-y divide-border-faint">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2 text-[12px]">
            <span className="text-text-muted">{k}</span>
            <span className={`font-medium ${valueClass(v)}`}>{v}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

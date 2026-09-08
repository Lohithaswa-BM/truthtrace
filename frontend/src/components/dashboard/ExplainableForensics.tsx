import { CheckCircle2 } from "lucide-react";
import type { Explainability } from "@/types/case";
import { Panel } from "@/components/ui/Panel";
import { ConfidenceChart } from "./ConfidenceChart";

export function ExplainableForensics({ data }: { data: Explainability }) {
  return (
    <Panel title="Explainable Forensics">
      <div className="flex gap-4">
        {/* reasons */}
        <div className="min-w-0 flex-1">
          <div className="mb-2.5 text-[12px] text-text-secondary">
            Why this media is classified as{" "}
            <span className="font-semibold text-status-red">{data.verdict}</span>
          </div>
          <ul className="space-y-2">
            {data.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-[12px] text-text-secondary">
                <CheckCircle2 size={15} className="mt-px shrink-0 text-status-green" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* radar */}
        <div className="w-[260px] shrink-0">
          <div className="mb-1 text-center text-[11px] font-medium text-text-secondary">
            CONFIDENCE BREAKDOWN
          </div>
          <ConfidenceChart data={data.confidence} />
        </div>
      </div>
    </Panel>
  );
}

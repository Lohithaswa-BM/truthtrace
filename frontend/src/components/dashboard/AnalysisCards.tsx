import type { CaseDetail, DataSource } from "@/types/case";
import { ProgressBar, DataSourceBadge } from "@/components/ui/Panel";

interface Card {
  label: string;
  verdict: string;
  pct: number;
  text: string;   // text color class
  bar: string;    // bar color class
  source: DataSource;
}

function buildCards(c: CaseDetail): Card[] {
  return [
    {
      label: "AI Media Detection", verdict: c.ai_detection.label,
      pct: c.ai_detection.score, text: "text-status-red", bar: "bg-status-red",
      source: c.ai_detection.data_source,
    },
    {
      label: "Manipulation Type", verdict: c.manipulation.type,
      pct: c.manipulation.score, text: "text-status-orange", bar: "bg-status-orange",
      source: c.manipulation.data_source,
    },
    {
      label: "Originality Check", verdict: c.originality.label,
      pct: c.originality.score, text: "text-status-yellow", bar: "bg-status-yellow",
      source: c.originality.data_source,
    },
    {
      label: "Digital Fingerprint",
      verdict: `${c.fingerprint.matches_found} Matches Found`,
      pct: c.fingerprint.similarity, text: "text-status-green", bar: "bg-status-green",
      source: c.fingerprint.data_source,
    },
  ];
}

export function AnalysisCards({ caseData }: { caseData: CaseDetail }) {
  const cards = buildCards(caseData);
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="tt-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-secondary">{card.label}</span>
            <DataSourceBadge source={card.source} />
          </div>
          <div className="mt-2.5 flex items-end justify-between gap-2">
            <span className={`text-[14px] font-semibold leading-tight ${card.text}`}>{card.verdict}</span>
            <span className={`shrink-0 text-[20px] font-bold ${card.text}`}>{Math.round(card.pct)}%</span>
          </div>
          <ProgressBar value={card.pct} color={card.bar} className="mt-2.5" />
        </div>
      ))}
    </div>
  );
}

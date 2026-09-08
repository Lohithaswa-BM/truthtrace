import type { ManipulationAnalysis as MA } from "@/types/case";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";
import { TemporalChart } from "./TemporalChart";

// Stylized forensic heatmap over a generic vector face (NOT a real person's
// photo) — conveys the region-heat + detection-box visual without using or
// implying any real individual.
function FaceHeatmap() {
  return (
    <svg viewBox="0 0 240 210" className="h-full w-full">
      <defs>
        <radialGradient id="hRed" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hOrange" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#22c55e" stopOpacity="0.65" />
          <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <clipPath id="face">
          <ellipse cx="120" cy="108" rx="66" ry="84" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="240" height="210" rx="10" fill="#0c1220" />
      {/* head base */}
      <ellipse cx="120" cy="108" rx="66" ry="84" fill="#1a2334" stroke="#2a3654" strokeWidth="1" />
      {/* hair */}
      <path d="M54 96 Q60 26 120 24 Q180 26 186 96 Q168 60 120 58 Q72 60 54 96 Z" fill="#131a29" />
      {/* features */}
      <ellipse cx="98" cy="104" rx="10" ry="6" fill="#0e1626" stroke="#33415e" />
      <ellipse cx="142" cy="104" rx="10" ry="6" fill="#0e1626" stroke="#33415e" />
      <circle cx="98" cy="104" r="3" fill="#4a5a7a" />
      <circle cx="142" cy="104" r="3" fill="#4a5a7a" />
      <path d="M120 112 L114 134 Q120 138 126 134" fill="none" stroke="#33415e" strokeWidth="1.5" />
      <path d="M104 154 Q120 164 136 154" fill="none" stroke="#33415e" strokeWidth="1.8" />

      {/* heat overlay (clipped to face) */}
      <g clipPath="url(#face)">
        <circle cx="150" cy="150" r="46" fill="url(#hRed)" />
        <circle cx="96" cy="150" r="40" fill="url(#hOrange)" />
        <circle cx="150" cy="104" r="34" fill="url(#hOrange)" />
        <circle cx="96" cy="80" r="34" fill="url(#hGreen)" />
        <circle cx="150" cy="72" r="30" fill="url(#hBlue)" />
        <circle cx="120" cy="176" r="34" fill="url(#hRed)" />
      </g>

      {/* detection boxes */}
      <rect x="80" y="88" width="80" height="34" fill="none" stroke="#cbd5f5" strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />
      <rect x="92" y="140" width="58" height="34" fill="none" stroke="#4f8cff" strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />
    </svg>
  );
}

function dotColor(score: number) {
  if (score >= 0.85) return "bg-status-red";
  if (score >= 0.75) return "bg-status-orange";
  return "bg-status-yellow";
}

export function ManipulationAnalysis({ data }: { data: MA }) {
  return (
    <Panel
      title="Manipulation Analysis"
      right={<DataSourceBadge source={data.data_source} />}
    >
      <div className="flex gap-4">
        {/* heatmap */}
        <div className="h-[210px] w-[240px] shrink-0 overflow-hidden rounded-lg ring-1 ring-border-subtle">
          <FaceHeatmap />
        </div>
        {/* signals */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 text-[12px] font-medium text-text-secondary">
            Detected Manipulations
          </div>
          <ul className="space-y-2">
            {data.signals.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-2 text-text-secondary">
                  <span className={`h-2 w-2 rounded-full ${dotColor(s.score)}`} />
                  {s.name}
                </span>
                <span className="font-mono text-text-primary">{s.score.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 border-t border-border-faint pt-3">
        <TemporalChart data={data.temporal} anomaly={data.anomaly} />
      </div>
    </Panel>
  );
}

import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import type { ConfidenceBreakdown } from "@/types/case";

export function ConfidenceChart({ data }: { data: ConfidenceBreakdown }) {
  const chart = [
    { axis: "AI Detection", value: data.ai_detection },
    { axis: "Manipulation", value: data.manipulation },
    { axis: "Provenance", value: data.provenance },
    { axis: "Similarity", value: data.similarity },
    { axis: "Consistency", value: data.consistency },
  ];
  return (
    <div className="h-[188px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chart} outerRadius="72%" margin={{ top: 6, right: 20, bottom: 6, left: 20 }}>
          <PolarGrid stroke="#26304a" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#9aa4bd", fontSize: 9 }}
          />
          <Radar
            dataKey="value" stroke="#a855f7" strokeWidth={1.6}
            fill="#a855f7" fillOpacity={0.28} dot={{ r: 2, fill: "#a855f7" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

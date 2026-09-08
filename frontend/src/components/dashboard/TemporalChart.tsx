import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  ReferenceArea, ReferenceDot, Tooltip,
} from "recharts";
import type { AnomalyBand, TemporalPoint } from "@/types/case";

export function TemporalChart({
  data,
  anomaly,
}: {
  data: TemporalPoint[];
  anomaly?: AnomalyBand | null;
}) {
  const peak = data.reduce((a, b) => (b.score > a.score ? b : a), data[0]);
  return (
    <div>
      <div className="mb-1 text-[12px] font-medium text-text-secondary">
        Temporal Inconsistency (Frame Analysis)
      </div>
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="#1a2236" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t" type="number" domain={[0, 12]}
              ticks={[0, 2, 4, 6, 8, 10, 12]}
              tickFormatter={(v) => `${v}s`}
              tick={{ fill: "#5f6b85", fontSize: 10 }}
              axisLine={{ stroke: "#1e2740" }} tickLine={false}
            />
            <YAxis
              domain={[0, 1]} ticks={[0, 0.5, 1]}
              tick={{ fill: "#5f6b85", fontSize: 10 }}
              axisLine={{ stroke: "#1e2740" }} tickLine={false} width={34}
              label={{
                value: "Manipulation Score", angle: -90, position: "insideLeft",
                fill: "#5f6b85", fontSize: 9, dy: 60, dx: 12,
              }}
            />
            <Tooltip
              contentStyle={{ background: "#0e1422", border: "1px solid #1e2740", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "#9aa4bd" }} labelFormatter={(v) => `${v}s`}
              formatter={(v: number) => [v.toFixed(2), "Score"]}
            />
            {anomaly && (
              <ReferenceArea
                x1={anomaly.start} x2={anomaly.end} fill="#ef4444" fillOpacity={0.14}
                stroke="#ef4444" strokeOpacity={0.35}
              />
            )}
            <Line
              type="monotone" dataKey="score" stroke="#4f8cff" strokeWidth={2}
              dot={false} activeDot={{ r: 4, fill: "#4f8cff" }}
            />
            {anomaly && (
              <ReferenceDot x={peak.t} y={peak.score} r={4} fill="#ef4444" stroke="#0e1422" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {anomaly && (
        <div className="mt-1 text-right text-[10px] font-medium text-status-red">
          {anomaly.label} {anomaly.start}s – {anomaly.end}s
        </div>
      )}
    </div>
  );
}

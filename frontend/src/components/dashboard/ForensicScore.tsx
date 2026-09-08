import { Info } from "lucide-react";

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}
// Arc over the top from startDeg to endDeg (degrees measured CCW from +x).
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

export function ForensicScore({
  score,
  confidenceLabel,
}: {
  score: number; // 0..100
  confidenceLabel?: string | null;
}) {
  const cx = 100, cy = 96, r = 80;
  const endDeg = 180 - 180 * (score / 100);

  return (
    <section className="tt-card relative flex flex-col p-4">
      <button className="absolute right-3 top-3 text-text-muted hover:text-text-secondary">
        <Info size={15} />
      </button>
      <h3 className="text-[13px] font-medium text-text-secondary">Overall Forensic Score</h3>

      <div className="relative mx-auto mt-1 w-[200px]">
        <svg viewBox="0 0 200 112" className="w-full">
          <defs>
            <linearGradient id="gaugegrad" x1="20" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7c3aed" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* track */}
          <path d={arcPath(cx, cy, r, 180, 0)} fill="none" stroke="#1e2740" strokeWidth="12" strokeLinecap="round" />
          {/* value */}
          <path d={arcPath(cx, cy, r, 180, endDeg)} fill="none" stroke="url(#gaugegrad)" strokeWidth="12" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-x-0 top-[42%] flex items-baseline justify-center">
          <span className="text-[40px] font-bold leading-none text-text-primary">{score}</span>
          <span className="ml-1 text-[15px] text-text-muted">/100</span>
        </div>
      </div>

      {confidenceLabel && (
        <div className="mx-auto -mt-1">
          <span className="rounded-md bg-accent-purple/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-accent-purple ring-1 ring-accent-purple/25">
            {confidenceLabel}
          </span>
        </div>
      )}
    </section>
  );
}

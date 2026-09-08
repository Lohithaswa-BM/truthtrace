import type { ReactNode } from "react";
import type { DataSource } from "@/types/case";

// --- Panel: the standard bordered dark card with an uppercase title row -----
export function Panel({
  title,
  right,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`tt-card flex flex-col ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
          {title && <h3 className="tt-panel-title">{title}</h3>}
          {right}
        </div>
      )}
      <div className={`px-4 pb-4 ${title ? "" : "pt-4"} ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}

// --- Subtle data-source badge (integrity marker) ---------------------------
const DS_STYLE: Record<DataSource, string> = {
  demo: "text-accent-blue/70 border-accent-blue/25",
  indexed: "text-accent-purple/70 border-accent-purple/25",
  live: "text-text-muted border-border-subtle",
};
const DS_LABEL: Record<DataSource, string> = {
  demo: "DEMO", indexed: "INDEXED", live: "LIVE",
};

export function DataSourceBadge({ source }: { source: DataSource }) {
  return (
    <span
      className={`rounded border px-1.5 py-px text-[9px] font-semibold tracking-wider ${DS_STYLE[source]}`}
      title={`Result source: ${DS_LABEL[source]}`}
    >
      {DS_LABEL[source]}
    </span>
  );
}

// --- Progress bar ----------------------------------------------------------
export function ProgressBar({
  value,
  color,
  className = "",
}: {
  value: number; // 0..100
  color: string; // tailwind bg-* class
  className?: string;
}) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06] ${className}`}>
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

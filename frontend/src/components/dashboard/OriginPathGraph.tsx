import type { PropagationNode, Tracing } from "@/types/case";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";

function TreeNode({ node }: { node: PropagationNode }) {
  const variant = node.is_origin ? "origin" : node.is_group ? "group" : "normal";
  const ring =
    variant === "origin"
      ? "ring-accent-blue/50 bg-accent-blue/10"
      : variant === "group"
      ? "ring-accent-purple/50 bg-accent-purple/10"
      : "ring-border-subtle bg-bg-cardalt";
  const handleColor =
    variant === "origin" ? "text-accent-blue" : variant === "group" ? "text-accent-purple" : "text-text-primary";
  return (
    <div className={`rounded-lg px-2.5 py-1.5 text-center ring-1 ${ring}`}>
      <div className={`truncate text-[10.5px] font-semibold ${handleColor}`}>{node.handle}</div>
      <div className="text-[9px] text-text-muted">{node.timestamp}</div>
    </div>
  );
}

function VLine() {
  return <div className="mx-auto h-3 w-px bg-border-subtle" />;
}

export function OriginPathGraph({
  data,
  onViewGraph,
}: {
  data: Tracing;
  onViewGraph?: () => void;
}) {
  const byId = Object.fromEntries(data.nodes.map((n) => [n.id, n]));
  // Fixed compact layout mirroring the prototype: origin → 2 branches → merge → group.
  const [n1, n2, n3, n4, n5] = ["n1", "n2", "n3", "n4", "n5"].map((id) => byId[id]);

  return (
    <Panel
      title="Origin & Path Tracing"
      right={<DataSourceBadge source={data.data_source} />}
    >
      {/* earliest appearance */}
      <div className="text-[11px] text-text-muted">Earliest Known Appearance</div>
      <div className="mt-0.5 text-[16px] font-semibold text-text-primary">
        {data.earliest_timestamp ?? "—"}
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px]">
        <span className="text-text-muted">Source:</span>
        <span className="text-accent-blue">
          {data.earliest_source}
          {data.earliest_platform ? ` (${data.earliest_platform})` : ""}
        </span>
        <span className="rounded bg-status-green/15 px-1.5 py-px text-[9px] font-medium text-status-green ring-1 ring-status-green/25">
          {data.earliest_confidence}
        </span>
      </div>

      {/* dissemination tree */}
      <div className="mt-4 border-t border-border-faint pt-3">
        <div className="mb-2 text-[11px] font-medium text-text-secondary">Dissemination Path</div>
        {n1 && (
          <div className="mx-auto max-w-[240px]">
            <div className="mx-auto w-[62%]"><TreeNode node={n1} /></div>
            <VLine />
            <div className="grid grid-cols-2 gap-2.5">
              {n2 && <TreeNode node={n2} />}
              {n3 && <TreeNode node={n3} />}
            </div>
            <VLine />
            {n4 && <div className="mx-auto w-[62%]"><TreeNode node={n4} /></div>}
            <VLine />
            {n5 && <div className="mx-auto w-[70%]"><TreeNode node={n5} /></div>}
          </div>
        )}
      </div>

      <button
        onClick={onViewGraph}
        className="mt-4 w-full rounded-lg border border-border-subtle bg-bg-hover/50 py-2 text-[12px] font-medium text-text-secondary transition hover:border-accent-blue/40 hover:text-accent-blue"
      >
        View Full Graph
      </button>
    </Panel>
  );
}

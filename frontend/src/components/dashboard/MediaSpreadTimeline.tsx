import type { Tracing } from "@/types/case";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";

export function MediaSpreadTimeline({ data }: { data: Tracing }) {
  const events = data.timeline;
  return (
    <Panel
      title="Media Spread Timeline"
      right={<DataSourceBadge source={data.data_source} />}
    >
      <div className="relative pt-6">
        {/* connecting line */}
        <div className="absolute left-[6%] right-[6%] top-[30px] h-px bg-gradient-to-r from-accent-purple/50 via-accent-blue/40 to-accent-purple/50" />
        <div className="relative flex justify-between">
          {events.map((e, i) => (
            <div key={i} className="flex w-[19%] flex-col items-center text-center">
              <div className="mb-2 whitespace-nowrap font-mono text-[9px] text-text-secondary">{e.timestamp}</div>
              <div className="h-2.5 w-2.5 rounded-full bg-accent-purple ring-4 ring-accent-purple/15" />
              <div className="mt-2 whitespace-nowrap text-[9px] font-medium text-text-primary">{e.action}</div>
              <div className="mt-0.5 w-full truncate text-[9px] text-accent-blue">{e.handle}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

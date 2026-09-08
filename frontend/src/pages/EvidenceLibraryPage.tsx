import { useEffect, useState } from "react";
import { Library, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";
import { api } from "@/lib/api";
import type { IndexedMedia } from "@/types/case";

export function EvidenceLibraryPage() {
  const [items, setItems] = useState<IndexedMedia[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listIndexedMedia().then(setItems).catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Header title="Evidence Library" />
      <div className="flex-1 overflow-y-auto p-4">
        <Panel title="Indexed Evidence Library" right={<DataSourceBadge source="indexed" />}>
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-accent-purple/25 bg-accent-purple/10 px-3 py-2 text-[11px] text-accent-purple">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>
              This is the local indexed corpus used for perceptual fingerprint matching — not a
              live or exhaustive social-media database.
            </span>
          </div>

          {error && (
            <div className="py-6 text-center text-[12px] text-status-red">
              Backend offline — evidence library unavailable: {error}
            </div>
          )}
          {!error && items === null && (
            <div className="py-6 text-center text-[12px] text-text-muted">Loading indexed evidence…</div>
          )}
          {!error && items && items.length === 0 && (
            <div className="py-6 text-center text-[12px] text-text-muted">
              No indexed evidence available yet.
            </div>
          )}
          {!error && items && items.length > 0 && (
            <div className="divide-y divide-border-faint">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 py-3 text-[12px]">
                  <Library size={16} className="shrink-0 text-accent-purple" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-text-primary">{it.label}</div>
                    <div className="text-text-muted">
                      {it.source_handle ?? "Unknown source"}
                      {it.platform ? ` · ${it.platform}` : ""}
                    </div>
                  </div>
                  <div className="w-36 shrink-0 font-mono text-text-secondary">
                    {it.first_seen_at ?? "—"}
                  </div>
                  <div className="w-40 shrink-0 font-mono text-text-muted">
                    {it.has_frame_phashes
                      ? `${it.frame_count ?? "?"} frame hashes`
                      : it.phash
                        ? `pHash ${it.phash.slice(0, 8)}…`
                        : "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

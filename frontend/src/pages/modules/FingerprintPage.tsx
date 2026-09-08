import { Fingerprint as FingerprintIcon, Copy, Info } from "lucide-react";
import { ModulePageShell } from "@/components/dashboard/ModulePageShell";
import { Panel, DataSourceBadge } from "@/components/ui/Panel";

const METHOD_LABEL: Record<string, string> = {
  perceptual_phash: "Perceptual Hash (pHash) — Image",
  perceptual_video_frames: "Perceptual Video Frame Fingerprinting",
  content_hash_fallback: "Content-Identity Hash (fallback — NOT perceptual)",
};
const METHOD_DESC: Record<string, string> = {
  perceptual_phash:
    "A genuine perceptual hash computed from image content. Visually similar images produce similar hashes.",
  perceptual_video_frames:
    "Representative frames were extracted at deterministic positions in the video and each frame was perceptually hashed. Matching compares frame-level similarity.",
  content_hash_fallback:
    "Perceptual fingerprinting tools were unavailable, so a SHA-256-derived identity hash was used instead. This only detects byte-identical re-uploads — it is NOT perceptually similar matching.",
};

export function FingerprintPage() {
  return (
    <ModulePageShell title="Digital Fingerprinting">
      {(data) => {
        const fp = data.fingerprint;
        const ev = data.evidence;
        const method = fp.method ?? "perceptual_phash";
        const isFallback = method === "content_hash_fallback";
        return (
          <>
            <Panel title="Fingerprint & Hashing" right={<DataSourceBadge source={fp.data_source} />}>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                  <div className="text-[11px] text-text-muted">SHA-256 (Content Integrity)</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="break-all font-mono text-[11px] text-text-secondary">
                      {ev.sha256_display ?? ev.sha256 ?? "—"}
                    </span>
                    {ev.sha256 && (
                      <button
                        className="shrink-0 text-text-muted hover:text-text-secondary"
                        onClick={() => navigator.clipboard?.writeText(ev.sha256!)}
                      >
                        <Copy size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-border-subtle bg-bg-cardalt p-3">
                  <div className="text-[11px] text-text-muted">
                    {isFallback ? "Content-Identity Hash" : "Perceptual Fingerprint (pHash)"}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <FingerprintIcon size={14} className={isFallback ? "text-text-muted" : "text-accent-purple"} />
                    <span className="font-mono text-[12px] text-accent-blue">
                      {fp.phash_display ?? fp.phash ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[11px] ${
                  isFallback
                    ? "border-status-orange/30 bg-status-orange/10 text-status-orange"
                    : "border-accent-purple/25 bg-accent-purple/10 text-accent-purple"
                }`}
              >
                <Info size={14} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold">{METHOD_LABEL[method] ?? method}</div>
                  <div className="mt-0.5 text-text-secondary">{METHOD_DESC[method] ?? ""}</div>
                </div>
              </div>

              {method === "perceptual_video_frames" && (
                <div className="mt-3 grid grid-cols-2 gap-4 text-[12px]">
                  <div>
                    <div className="text-text-muted">Representative Frames Sampled</div>
                    <div className="mt-1 text-[16px] font-semibold text-text-primary">
                      {fp.frame_count ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted">Media Type</div>
                    <div className="mt-1 text-[16px] font-semibold text-text-primary capitalize">
                      {ev.media_kind}
                    </div>
                  </div>
                </div>
              )}
            </Panel>

            <Panel title="Matching Information">
              <div className="flex gap-8 text-[12px]">
                <div>
                  <div className="text-text-muted">Matches Found</div>
                  <div className="mt-1 text-[18px] font-semibold text-text-primary">{fp.matches_found}</div>
                </div>
                <div>
                  <div className="text-text-muted">Best Similarity</div>
                  <div className="mt-1 text-[18px] font-semibold text-status-green">
                    {Math.round(fp.similarity)}%
                  </div>
                </div>
              </div>
              {fp.matches.length > 0 ? (
                <div className="mt-3 divide-y divide-border-faint">
                  {fp.matches.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2 text-[12px]">
                      <span className="text-accent-blue">{m.source_handle ?? m.label}</span>
                      <span className="text-text-muted">{m.platform ?? "—"}</span>
                      <span className="font-mono text-text-primary">
                        {Math.round(m.similarity)}%
                        {typeof m.hamming_distance === "number" && (
                          <span className="text-text-muted"> (Δ{m.hamming_distance})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-[12px] text-text-muted">
                  No matches found in the local indexed evidence library.
                </div>
              )}
            </Panel>
          </>
        );
      }}
    </ModulePageShell>
  );
}

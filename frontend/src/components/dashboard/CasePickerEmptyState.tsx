import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderOpen, UploadCloud } from "lucide-react";
import { api } from "@/lib/api";
import type { CaseSummary } from "@/types/case";
import { Panel } from "@/components/ui/Panel";

/** Shown on a module page when there's no case context yet (module routes
 * are reached directly from the sidebar, not via a case). Lets the user
 * jump into the most relevant case rather than seeing a dead placeholder. */
export function CasePickerEmptyState({ moduleName }: { moduleName: string }) {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);

  useEffect(() => {
    api.listCases().then(setCases).catch(() => setCases([]));
  }, []);

  return (
    <Panel title={`${moduleName} — Select a Case`}>
      <p className="text-[13px] text-text-secondary">
        This module shows results for a specific case. Open a case below, or run a
        new analysis.
      </p>

      {cases === null ? (
        <div className="mt-4 text-[12px] text-text-muted">Loading cases…</div>
      ) : cases.length === 0 ? (
        <div className="mt-4 text-[12px] text-text-muted">
          No cases available yet — backend may be offline.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-border-faint">
          {cases.map((c) => (
            <Link
              key={c.id}
              to={`/cases/${c.id}`}
              className="flex items-center justify-between py-2.5 text-[12px] hover:text-accent-blue"
            >
              <span className="flex items-center gap-2">
                <FolderOpen size={14} className="text-text-muted" />
                <span className="font-mono text-text-secondary">{c.id}</span>
                <span className="text-text-muted">· {c.title}</span>
              </span>
              <span className="text-text-muted">{c.status}</span>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/new-analysis"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-bluedim to-accent-blue py-2.5 text-[13px] font-semibold text-white"
      >
        <UploadCloud size={15} /> Run New Analysis
      </Link>
    </Panel>
  );
}

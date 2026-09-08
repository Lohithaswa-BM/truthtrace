import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderOpen, UploadCloud } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Panel } from "@/components/ui/Panel";
import { api } from "@/lib/api";
import { DEMO_CASE } from "@/data/demoCase";
import type { CaseSummary } from "@/types/case";

export function CasesPage() {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    api
      .listCases()
      .then((c) => setCases(c.length > 0 ? c : [demoAsSummary()]))
      .catch(() => {
        setUsingFallback(true);
        setCases([demoAsSummary()]);
      });
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Header title="Cases" />
      <div className="flex-1 overflow-y-auto p-4">
        {usingFallback && (
          <div className="mb-4 rounded-lg border border-status-orange/40 bg-status-orange/10 px-3 py-1.5 text-[11px] text-status-orange">
            Backend offline — showing bundled demo case only.
          </div>
        )}
        <Panel
          title="All Cases"
          right={
            <Link
              to="/new-analysis"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-bluedim to-accent-blue px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              <UploadCloud size={13} /> New Analysis
            </Link>
          }
        >
          {cases === null ? (
            <div className="py-6 text-center text-[12px] text-text-muted">Loading cases…</div>
          ) : (
            <div className="divide-y divide-border-faint">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  to={`/cases/${c.id}`}
                  className="flex items-center justify-between py-3 text-[12px] transition hover:bg-bg-hover/40"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen size={16} className="text-accent-blue" />
                    <div>
                      <div className="font-mono font-medium text-text-primary">{c.id}</div>
                      <div className="text-text-muted">{c.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-text-secondary">{c.officer_name}</span>
                    {typeof c.forensic_score === "number" && (
                      <span className="font-mono text-text-primary">{c.forensic_score}/100</span>
                    )}
                    <span className="rounded-md bg-status-green/15 px-2 py-0.5 text-[10px] font-medium text-status-green">
                      {c.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function demoAsSummary(): CaseSummary {
  return {
    id: DEMO_CASE.id, status: DEMO_CASE.status, officer_name: DEMO_CASE.officer_name,
    title: DEMO_CASE.title, forensic_score: DEMO_CASE.forensic_score,
    confidence_label: DEMO_CASE.confidence_label, filename: DEMO_CASE.evidence.filename,
    created_at: DEMO_CASE.created_at, data_source: DEMO_CASE.data_source,
  };
}

import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useCase } from "@/hooks/useCase";
import { CasePickerEmptyState } from "@/components/dashboard/CasePickerEmptyState";
import type { CaseDetail } from "@/types/case";

/**
 * Shared shell for the 6 sidebar module pages (AI Detection, Manipulation,
 * Originality, Fingerprinting, Tracing, Report). Reuses the same case-data
 * fetching/fallback logic as the Dashboard (useCase) so module pages never
 * duplicate forensic logic — they only render fields from the same
 * CaseDetail the Dashboard already consumes.
 *
 * Case context comes from the route: /cases/:id/modules/... uses that id;
 * bare /modules/... routes (reached directly from the sidebar) fall back to
 * the demo case via useCase()'s own default, UNLESS the user hasn't opened
 * any case yet — in which case we show a case picker instead of silently
 * assuming the demo case is what they want.
 */
export function ModulePageShell({
  title,
  children,
}: {
  title: string;
  children: (data: CaseDetail, usingFallback: boolean) => ReactNode;
}) {
  const { id } = useParams();
  const { data, loading, usingFallback, error } = useCase(id, false);

  return (
    <div className="flex h-screen flex-col">
      <Header
        title={!id ? title : undefined}
        caseId={data?.id}
        status={data?.status}
        officer={data?.officer_name}
      />
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            Loading case…
          </div>
        )}
        {!loading && error && !data && (
          <div className="flex h-full items-center justify-center text-sm text-status-red">
            {error}
          </div>
        )}
        {!loading && !error && !data && (
          <CasePickerEmptyState moduleName={title} />
        )}
        {!loading && data && (
          <div className="space-y-4">
            {usingFallback && (
              <div className="rounded-lg border border-status-orange/40 bg-status-orange/10 px-3 py-1.5 text-[11px] text-status-orange">
                Backend offline — showing bundled demo case.
              </div>
            )}
            {children(data, usingFallback)}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_CASE } from "@/data/demoCase";
import type { CaseDetail } from "@/types/case";

interface State {
  data: CaseDetail | null;
  loading: boolean;
  usingFallback: boolean;
  error: string | null;
}

// Fetches a case; if the backend is unreachable and the id is the demo case,
// falls back to the bundled demo so the dashboard is never blank.
// Pass autoDefault=false to skip defaulting to the demo case when no id is
// given (used by module pages reached directly from the sidebar, so they
// can show a case picker instead of silently assuming the demo case).
export function useCase(caseId?: string, autoDefault: boolean = true): State {
  const id = caseId ?? (autoDefault ? DEMO_CASE.id : undefined);
  const [state, setState] = useState<State>({
    data: null, loading: !!id, usingFallback: false, error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false, usingFallback: false, error: null });
      return;
    }
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .getCase(id)
      .then((data) => alive && setState({ data, loading: false, usingFallback: false, error: null }))
      .catch((err) => {
        if (!alive) return;
        if (id === DEMO_CASE.id) {
          setState({ data: DEMO_CASE, loading: false, usingFallback: true, error: null });
        } else {
          setState({ data: null, loading: false, usingFallback: false, error: String(err) });
        }
      });
    return () => { alive = false; };
  }, [id]);

  return state;
}

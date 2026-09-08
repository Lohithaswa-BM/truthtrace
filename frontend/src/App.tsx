import { createBrowserRouter, useParams, Navigate, Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/pages/Dashboard";
import { NewAnalysis } from "@/pages/NewAnalysis";
import { CasesPage } from "@/pages/CasesPage";
import { EvidenceLibraryPage } from "@/pages/EvidenceLibraryPage";
import { LoginPage } from "@/pages/LoginPage";
import { useAuth } from "@/lib/auth";
import { AIMediaDetectionPage } from "@/pages/modules/AIMediaDetectionPage";
import { ManipulationPage } from "@/pages/modules/ManipulationPage";
import { OriginalityPage } from "@/pages/modules/OriginalityPage";
import { FingerprintPage } from "@/pages/modules/FingerprintPage";
import { TracingPage } from "@/pages/modules/TracingPage";
import { ReportPage } from "@/pages/modules/ReportPage";

// Route guard: unauthenticated users are redirected to /login. Server-side
// enforcement happens independently via require_auth on the API — this is
// purely a UX convenience, not the security boundary.
function RequireAuth() {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-root text-sm text-text-secondary">
        Loading…
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Wrapper so /cases/:id feeds the route param into the dashboard.
function CaseRoute() {
  const { id } = useParams();
  return <Dashboard caseId={id} />;
}

// Simple placeholder page (real screens land in Phase 4).
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-screen flex-col">
      <Header title={title} />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="tt-card max-w-md p-8 text-center">
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Not part of the forensic analysis workflow — no functionality implemented for this
            screen yet.
          </p>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "cases/:id", element: <CaseRoute /> },
          { path: "new-analysis", element: <NewAnalysis /> },
          { path: "cases", element: <CasesPage /> },
          { path: "evidence", element: <EvidenceLibraryPage /> },
          { path: "settings", element: <PlaceholderPage title="Settings" /> },
          { path: "users", element: <PlaceholderPage title="Users" /> },
          { path: "modules/ai-detection", element: <AIMediaDetectionPage /> },
          { path: "modules/manipulation", element: <ManipulationPage /> },
          { path: "modules/originality", element: <OriginalityPage /> },
          { path: "modules/fingerprint", element: <FingerprintPage /> },
          { path: "modules/tracing", element: <TracingPage /> },
          { path: "modules/report", element: <ReportPage /> },
          // Case-scoped module views (opened from a case context).
          { path: "cases/:id/modules/ai-detection", element: <AIMediaDetectionPage /> },
          { path: "cases/:id/modules/manipulation", element: <ManipulationPage /> },
          { path: "cases/:id/modules/originality", element: <OriginalityPage /> },
          { path: "cases/:id/modules/fingerprint", element: <FingerprintPage /> },
          { path: "cases/:id/modules/tracing", element: <TracingPage /> },
          { path: "cases/:id/modules/report", element: <ReportPage /> },
        ],
      },
    ],
  },
]);

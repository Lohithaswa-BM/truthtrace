import { Bell, Sun, Settings2, FolderClosed, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Header({
  caseId,
  status,
  officer,
  title,
}: {
  caseId?: string;
  status?: string;
  officer?: string;
  title?: string;
}) {
  const { officer: authOfficer, logout } = useAuth();
  const displayName = officer ?? authOfficer?.name ?? "Inspector Arjun Singh";
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-panel/95 px-5 backdrop-blur">
      {/* Left: case id + status (or page title) */}
      <div className="flex items-center gap-3">
        {caseId ? (
          <>
            <FolderClosed size={16} className="text-accent-blue" />
            <span className="text-[13px] text-text-secondary">
              CASE ID:{" "}
              <span className="font-mono font-semibold text-accent-purple">{caseId}</span>
            </span>
            {status && (
              <span className="rounded-md bg-status-green/15 px-2 py-0.5 text-[11px] font-medium text-status-green ring-1 ring-status-green/25">
                {status}
              </span>
            )}
          </>
        ) : (
          <span className="text-sm font-semibold text-text-primary">{title}</span>
        )}
      </div>

      {/* Right: global controls + officer */}
      <div className="flex items-center gap-1">
        <IconBtn><Bell size={17} /></IconBtn>
        <IconBtn><Sun size={17} /></IconBtn>
        <IconBtn><Settings2 size={17} /></IconBtn>
        <div className="mx-2 h-6 w-px bg-border-subtle" />
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple text-[12px] font-semibold text-white">
            {initials || "OF"}
          </div>
          <div className="text-left leading-tight">
            <div className="text-[10px] text-text-muted">
              {authOfficer?.designation ?? "Investigating Officer"}
            </div>
            <div className="text-[12px] font-medium text-text-primary">{displayName}</div>
          </div>
          <ChevronDown size={15} className="text-text-muted" />
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-status-red/10 hover:text-status-red"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary">
      {children}
    </button>
  );
}

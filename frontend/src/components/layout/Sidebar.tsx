import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, FilePlus2, ScanEye, SlidersHorizontal, ShieldCheck,
  Fingerprint, Share2, FileText, FolderOpen, Library, Settings, Users,
  type LucideIcon,
} from "lucide-react";

interface Item { to: string; label: string; icon: LucideIcon; end?: boolean }

const TOP: Item[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/new-analysis", label: "New Analysis", icon: FilePlus2 },
];
const MODULES: Item[] = [
  { to: "/modules/ai-detection", label: "AI Media Detection", icon: ScanEye },
  { to: "/modules/manipulation", label: "Manipulation Analysis", icon: SlidersHorizontal },
  { to: "/modules/originality", label: "Originality Check", icon: ShieldCheck },
  { to: "/modules/fingerprint", label: "Digital Fingerprinting", icon: Fingerprint },
  { to: "/modules/tracing", label: "Origin & Path Tracing", icon: Share2 },
  { to: "/modules/report", label: "Forensic Report", icon: FileText },
];
const MANAGE: Item[] = [
  { to: "/cases", label: "Cases", icon: FolderOpen },
  { to: "/evidence", label: "Evidence Library", icon: Library },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/users", label: "Users", icon: Users },
];

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ttlogo" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#4f8cff" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M16 2 L28 9 V23 L16 30 L4 23 V9 Z" stroke="url(#ttlogo)" strokeWidth="1.6" fill="none" />
      <path d="M16 2 L16 30 M4 9 L28 23 M28 9 L4 23" stroke="url(#ttlogo)" strokeWidth="1" opacity="0.55" />
      <circle cx="16" cy="16" r="3.4" fill="url(#ttlogo)" />
    </svg>
  );
}

function NavItem({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
          isActive
            ? "bg-accent-blue/12 text-accent-blue"
            : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className={isActive ? "text-accent-blue" : "text-text-muted group-hover:text-text-secondary"} />
          <span className="font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="px-3 pb-1.5 pt-4 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
      {children}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[248px] shrink-0 flex-col border-r border-border-subtle bg-bg-panel">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <LogoMark />
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-wide text-text-primary">
            TRUTH<span className="text-accent-blue">TRACE</span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.12em] text-text-muted">
            AI Digital Forensic Platform
          </div>
        </div>
      </div>

      {/* Nav (scrolls if needed) */}
      <nav className="flex-1 overflow-y-auto px-2.5 pb-3">
        <div className="flex flex-col gap-0.5 pt-1">
          {TOP.map((i) => <NavItem key={i.to} item={i} />)}
        </div>
        <SectionLabel>Modules</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {MODULES.map((i) => <NavItem key={i.to} item={i} />)}
        </div>
        <SectionLabel>Manage</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {MANAGE.map((i) => <NavItem key={i.to} item={i} />)}
        </div>
      </nav>

      {/* Org footer */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-cardalt px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 ring-1 ring-accent-blue/30">
            <ShieldCheck size={16} className="text-accent-blue" />
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-semibold text-text-primary">Chandigarh Police</div>
            <div className="text-[10px] text-text-muted">Digital Forensics Unit</div>
          </div>
        </div>
      </div>
      <div className="border-t border-border-faint py-2 text-center text-[10px] text-text-muted">
        Powered by TRUTHTRACE v1.0
      </div>
    </aside>
  );
}

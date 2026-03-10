"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaign", label: "New Campaign", icon: Megaphone },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] sticky top-0 z-50" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="mx-auto max-w-[1320px] px-6 flex items-center justify-between h-[56px]">
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          {/* Logo */}
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #d4882f 0%, #b06b1f 100%)",
              boxShadow: "0 1px 3px rgba(196,122,42,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            className="text-[17px] font-bold tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LeadVox
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3.5 py-[7px] rounded-[10px] text-[13px] font-medium no-underline transition-all ${
                  active
                    ? "bg-[var(--color-surface-inset)] text-[var(--color-text)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}

          <div className="ml-3 pl-3 border-l border-[var(--color-border-subtle)] flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-full bg-[var(--color-success)] pulse-live" />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)]">Live</span>
          </div>

          <a
            href="https://github.com/rohansx/leadvox-bolna"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 rounded-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-all"
            title="View on GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}

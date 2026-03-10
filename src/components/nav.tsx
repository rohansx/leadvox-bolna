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
        </div>
      </div>
    </nav>
  );
}

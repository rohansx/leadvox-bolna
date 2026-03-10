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
    <nav className="border-b border-[var(--color-border-subtle)] backdrop-blur-md bg-[#06060a]/80 sticky top-0 z-50">
      <div className="mx-auto max-w-[1400px] px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-amber)] to-[#d4892a] flex items-center justify-center shadow-[0_2px_12px_var(--color-amber-glow)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[var(--color-bg)]">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-lg tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-amber)] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              LeadVox
            </span>
            <span className="text-[9px] font-semibold text-[var(--color-text-muted)] tracking-[0.12em] uppercase">
              beta
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-all ${
                  active
                    ? "bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                }`}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}

          <div className="ml-3 pl-3 border-l border-[var(--color-border-subtle)] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] pulse-live" />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)]">Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

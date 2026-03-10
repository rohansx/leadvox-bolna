"use client";

import { Users, PhoneCall, TrendingUp, Clock } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const statConfig = [
  {
    key: "totalLeads" as const,
    label: "Total Leads",
    icon: Users,
    format: (v: number) => v.toString(),
    accent: "var(--color-text)",
  },
  {
    key: "callsMade" as const,
    label: "Calls Made",
    icon: PhoneCall,
    format: (v: number) => v.toString(),
    accent: "var(--color-amber)",
  },
  {
    key: "qualificationRate" as const,
    label: "Qualified",
    icon: TrendingUp,
    format: (v: number) => `${v}%`,
    accent: "var(--color-success)",
  },
  {
    key: "avgCallDuration" as const,
    label: "Avg Duration",
    icon: Clock,
    format: (v: number) => formatDuration(v),
    accent: "var(--color-cold)",
  },
];

export function StatsBar({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {statConfig.map(({ key, label, icon: Icon, format, accent }, i) => (
        <div
          key={key}
          className="card px-5 py-4 animate-fade-up relative overflow-hidden"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Subtle top accent line */}
          <div
            className="absolute top-0 left-4 right-4 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}30, transparent)` }}
          />
          <div className="flex items-center gap-2 mb-2.5">
            <Icon size={13} style={{ color: accent }} className="opacity-60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              {label}
            </span>
          </div>
          <div
            className="text-[28px] font-normal tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: accent }}
          >
            {format(stats[key])}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Users, PhoneCall, TrendingUp, Clock } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const statConfig = [
  { key: "totalLeads" as const, label: "Total Leads", icon: Users, format: (v: number) => v.toString() },
  { key: "callsMade" as const, label: "Calls Made", icon: PhoneCall, format: (v: number) => v.toString() },
  { key: "qualificationRate" as const, label: "Qualified", icon: TrendingUp, format: (v: number) => `${v}%` },
  { key: "avgCallDuration" as const, label: "Avg Duration", icon: Clock, format: (v: number) => formatDuration(v) },
];

export function StatsBar({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statConfig.map(({ key, label, icon: Icon, format }, i) => (
        <div
          key={key}
          className="card px-5 py-[18px] animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--color-surface-inset)] flex items-center justify-center" style={{ boxShadow: "var(--shadow-inset)" }}>
              <Icon size={13} className="text-[var(--color-text-muted)]" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              {label}
            </span>
          </div>
          <div
            className="text-[26px] font-bold tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {format(stats[key])}
          </div>
        </div>
      ))}
    </div>
  );
}

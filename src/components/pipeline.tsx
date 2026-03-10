"use client";

import { Flame, Sun, Snowflake } from "lucide-react";
import { LeadCard } from "./lead-card";
import type { Lead, LeadScore } from "@/lib/types";

const columns: {
  score: LeadScore;
  label: string;
  icon: typeof Flame;
  colorVar: string;
  surfaceVar: string;
}[] = [
  { score: "hot", label: "Hot", icon: Flame, colorVar: "var(--color-hot)", surfaceVar: "var(--color-hot-surface)" },
  { score: "warm", label: "Warm", icon: Sun, colorVar: "var(--color-warm)", surfaceVar: "var(--color-warm-surface)" },
  { score: "cold", label: "Cold", icon: Snowflake, colorVar: "var(--color-cold)", surfaceVar: "var(--color-cold-surface)" },
];

export function Pipeline({ leads }: { leads: Lead[] }) {
  const grouped = {
    hot: leads.filter((l) => l.score === "hot"),
    warm: leads.filter((l) => l.score === "warm"),
    cold: leads.filter((l) => l.score === "cold"),
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-[22px] font-bold text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lead Pipeline
        </h2>
        <div className="flex items-center gap-4">
          {columns.map(({ score, colorVar }) => (
            <div key={score} className="flex items-center gap-1.5">
              <div className="w-[7px] h-[7px] rounded-full" style={{ background: colorVar }} />
              <span className="text-[11px] text-[var(--color-text-muted)] font-medium capitalize">
                {score} ({grouped[score].length})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {columns.map(({ score, label, icon: Icon, colorVar, surfaceVar }) => (
          <div
            key={score}
            className="rounded-2xl p-4 pt-0 border border-[var(--color-border-subtle)]"
            style={{ background: surfaceVar, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}
          >
            <div className="flex items-center gap-2.5 mb-4 py-3 border-b border-[var(--color-border-subtle)]">
              <div
                className="w-7 h-7 rounded-[8px] flex items-center justify-center border"
                style={{
                  background: `var(--score-bg)`,
                  borderColor: `var(--score-border)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                <Icon size={13} style={{ color: colorVar }} />
              </div>
              <span className="text-[13px] font-bold text-[var(--color-text)]">
                {label}
              </span>
              <span
                className="text-[11px] font-bold ml-auto px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: colorVar,
                  background: "var(--score-bg)",
                  border: "1px solid var(--score-border)",
                }}
              >
                {grouped[score].length}
              </span>
            </div>

            <div className="space-y-3">
              {grouped[score].length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center bg-[var(--color-surface)]/50">
                  <p className="text-[13px] text-[var(--color-text-muted)]">
                    No {score} leads yet
                  </p>
                </div>
              ) : (
                grouped[score].map((lead, i) => (
                  <LeadCard key={lead.id} lead={lead} index={i} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Flame, Sun, Snowflake } from "lucide-react";
import { LeadCard } from "./lead-card";
import type { Lead, LeadScore } from "@/lib/types";

const columns: {
  score: LeadScore;
  label: string;
  icon: typeof Flame;
  colorVar: string;
  glowClass: string;
}[] = [
  { score: "hot", label: "Hot", icon: Flame, colorVar: "var(--color-hot)", glowClass: "pipeline-col-hot" },
  { score: "warm", label: "Warm", icon: Sun, colorVar: "var(--color-warm)", glowClass: "pipeline-col-warm" },
  { score: "cold", label: "Cold", icon: Snowflake, colorVar: "var(--color-cold)", glowClass: "pipeline-col-cold" },
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
          className="text-2xl text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lead Pipeline
        </h2>
        <div className="flex items-center gap-4">
          {columns.map(({ score, colorVar }) => (
            <div key={score} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: colorVar }} />
              <span className="text-[11px] text-[var(--color-text-muted)] font-medium capitalize">
                {score} ({grouped[score].length})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {columns.map(({ score, label, icon: Icon, colorVar, glowClass }) => (
          <div key={score} className={`rounded-xl p-4 pt-0 ${glowClass}`}>
            {/* Column header */}
            <div className="flex items-center gap-2.5 mb-4 py-3 border-b border-[var(--color-border-subtle)] sticky top-14 z-10 backdrop-blur-sm">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: `${colorVar}15` }}
              >
                <Icon size={13} style={{ color: colorVar }} />
              </div>
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {label}
              </span>
              <span
                className="text-[11px] font-mono font-semibold ml-auto px-2 py-0.5 rounded-full"
                style={{
                  color: colorVar,
                  background: `${colorVar}12`,
                  border: `1px solid ${colorVar}20`,
                }}
              >
                {grouped[score].length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {grouped[score].length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--color-border-subtle)] p-8 text-center">
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

"use client";

import Link from "next/link";
import { MapPin, IndianRupee, Clock, CalendarCheck, ChevronRight } from "lucide-react";
import type { Lead } from "@/lib/types";

function formatDuration(seconds: number): string {
  if (seconds === 0) return "No answer";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const scoreBadge: Record<Lead["score"], { label: string; class: string }> = {
  hot: { label: "Hot", class: "score-hot" },
  warm: { label: "Warm", class: "score-warm" },
  cold: { label: "Cold", class: "score-cold" },
};

export function LeadCard({ lead, index = 0 }: { lead: Lead; index?: number }) {
  const badge = scoreBadge[lead.score];

  return (
    <Link
      href={`/lead/${lead.id}`}
      className="block card-raised p-4 group no-underline animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">
            {lead.name}
          </h3>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
            {lead.phone}
          </p>
        </div>
        <span
          className={`${badge.class} text-[9px] font-bold uppercase tracking-[0.08em] px-2.5 py-[5px] rounded-[8px] shrink-0 ml-2`}
          style={{
            color: "var(--score-color)",
            background: "var(--score-bg)",
            border: "1px solid var(--score-border)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          {badge.label}
        </span>
      </div>

      <div className="space-y-1.5">
        {lead.budget && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <IndianRupee size={11} className="text-[var(--color-accent)] opacity-60 shrink-0" />
            <span className="font-medium">{lead.budget}</span>
          </div>
        )}
        {lead.location && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <MapPin size={11} className="text-[var(--color-text-muted)] shrink-0" />
            <span>{lead.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Clock size={11} className="shrink-0" />
          <span>{formatDuration(lead.callDuration)}</span>
        </div>
      </div>

      {lead.siteVisit.booked && (
        <div
          className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-success)] bg-[var(--color-success-light)] rounded-[8px] px-2.5 py-[5px] w-fit border border-[var(--color-success-border)]"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
        >
          <CalendarCheck size={10} />
          Site visit booked
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--color-text-muted)]">
          {lead.bhk || "—"}{lead.timeline ? ` · ${lead.timeline}` : ""}
        </span>
        <ChevronRight
          size={13}
          className="text-[var(--color-border-strong)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  );
}

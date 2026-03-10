"use client";

import { useEffect, useState } from "react";
import { StatsBar } from "@/components/stats-bar";
import { Pipeline } from "@/components/pipeline";
import { Megaphone } from "lucide-react";
import type { Lead, DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    callsMade: 0,
    qualificationRate: 0,
    avgCallDuration: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads);
          setStats(data.stats);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1
          className="text-[42px] leading-tight mb-1.5 text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Campaign Dashboard
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Real-time lead qualification pipeline — auto-refreshes every 5s
        </p>
      </div>

      <StatsBar stats={stats} />

      {loading ? (
        <div className="card p-16 text-center animate-fade-in">
          <div className="inline-block w-7 h-7 border-2 border-[var(--color-border)] border-t-[var(--color-amber)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)] mt-4">
            Loading pipeline...
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="card p-16 text-center animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-raised)] flex items-center justify-center mx-auto mb-4">
            <Megaphone size={20} className="text-[var(--color-text-muted)]" />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
            No leads in the pipeline yet
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-6">
            Launch a campaign to start qualifying leads with AI
          </p>
          <a href="/campaign" className="btn-primary inline-block no-underline">
            Create Campaign
          </a>
        </div>
      ) : (
        <Pipeline leads={leads} />
      )}
    </div>
  );
}

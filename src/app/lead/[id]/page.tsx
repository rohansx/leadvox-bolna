"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, IndianRupee, MapPin, Home, CalendarClock,
  CalendarCheck, UserPlus, Phone, Clock, MessageSquareText,
} from "lucide-react";
import type { Lead } from "@/lib/types";

const scoreConfig = {
  hot: { label: "Hot Lead", class: "score-hot", color: "var(--color-hot)" },
  warm: { label: "Warm Lead", class: "score-warm", color: "var(--color-warm)" },
  cold: { label: "Cold Lead", class: "score-cold", color: "var(--color-cold)" },
};

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await fetch(`/api/leads?id=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setLead(data.lead);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl pt-8">
        <div className="card p-16 text-center">
          <div className="inline-block w-7 h-7 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-3xl pt-8">
        <div className="card p-16 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Lead not found.</p>
          <Link href="/" className="btn-secondary inline-block no-underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const badge = scoreConfig[lead.score];
  const duration = lead.callDuration > 0
    ? `${Math.floor(lead.callDuration / 60)}:${(lead.callDuration % 60).toString().padStart(2, "0")}`
    : "—";

  return (
    <div className="max-w-3xl pt-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline mb-6 transition-colors"
      >
        <ArrowLeft size={13} />
        Back to Pipeline
      </Link>

      {/* Header */}
      <div className="card p-6 mb-4 animate-fade-up">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1
              className="text-[28px] leading-tight font-bold text-[var(--color-text)] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lead.name}
            </h1>
            <div className="flex items-center gap-4 text-[12px] text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                <Phone size={11} className="text-[var(--color-text-muted)]" />
                {lead.phone}
              </span>
              {lead.calledAt && (
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-[var(--color-text-muted)]" />
                  {new Date(lead.calledAt).toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MessageSquareText size={11} className="text-[var(--color-text-muted)]" />
                {duration}
              </span>
            </div>
          </div>
          <span
            className={`${badge.class} text-[10px] font-bold uppercase tracking-[0.08em] px-3 py-[6px] rounded-[10px]`}
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
        <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed italic">
          &ldquo;{lead.scoreReason}&rdquo;
        </p>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <DataCard icon={IndianRupee} label="Budget" value={lead.budget} accent />
        <DataCard icon={MapPin} label="Location" value={lead.location} />
        <DataCard icon={Home} label="Property" value={lead.bhk} />
        <DataCard icon={CalendarClock} label="Timeline" value={lead.timeline} />
      </div>

      {/* Site Visit */}
      <div className="card p-5 mb-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center border"
              style={{
                background: lead.siteVisit.booked ? "var(--color-success-light)" : "var(--color-surface-inset)",
                borderColor: lead.siteVisit.booked ? "var(--color-success-border)" : "var(--color-border-subtle)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <CalendarCheck size={16} className={lead.siteVisit.booked ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {lead.siteVisit.booked ? "Site Visit Confirmed" : "No Site Visit Scheduled"}
              </p>
              {lead.siteVisit.booked && lead.siteVisit.date && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {lead.siteVisit.date} — {lead.siteVisit.time}
                </p>
              )}
            </div>
          </div>
          {lead.assignedAgent ? (
            <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent-light)] px-3 py-1.5 rounded-[8px] border border-[var(--color-warm-border)]">
              Assigned: {lead.assignedAgent}
            </span>
          ) : (
            <button className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
              <UserPlus size={12} />
              Assign to Agent
            </button>
          )}
        </div>
      </div>

      {/* Recording */}
      {lead.recordingUrl && (
        <div className="card p-5 mb-4 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-[10px] bg-[var(--color-accent-light)] border border-[var(--color-warm-border)] flex items-center justify-center"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
            >
              <Phone size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Call Recording</p>
              <p className="text-xs text-[var(--color-text-muted)]">{duration} duration</p>
            </div>
          </div>
          <div className="card-inset p-2 rounded-[10px]">
            <audio controls className="w-full h-10" src={lead.recordingUrl}>
              <a href={lead.recordingUrl} target="_blank" rel="noopener noreferrer">Download</a>
            </audio>
          </div>
        </div>
      )}

      {/* Transcript */}
      {lead.transcript && (
        <div className="card p-6 animate-fade-up" style={{ animationDelay: "140ms" }}>
          <h3
            className="text-[17px] font-bold mb-4 text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Call Transcript
          </h3>
          <div className="card-inset rounded-2xl p-5 max-h-[500px] overflow-y-auto space-y-3">
            {lead.transcript.split("\n").filter(Boolean).map((block, i) => {
              const speakerMatch = block.match(/^(assistant|user|priya|Agent|User):\s*/i);
              const rawSpeaker = speakerMatch?.[1] || "";
              const isAgent = /^(assistant|priya|agent)$/i.test(rawSpeaker);
              const speaker = isAgent ? "Priya" : rawSpeaker ? "Lead" : "";
              const text = speakerMatch ? block.slice(speakerMatch[0].length).trim() : block.trim();
              if (!text) return null;

              return (
                <div key={i} className={`flex gap-3 ${isAgent ? "" : "flex-row-reverse"}`}>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border"
                    style={{
                      background: isAgent ? "var(--color-accent-light)" : "var(--color-surface)",
                      color: isAgent ? "var(--color-accent)" : "var(--color-text-secondary)",
                      borderColor: isAgent ? "var(--color-warm-border)" : "var(--color-border-subtle)",
                    }}
                  >
                    {speaker ? speaker[0].toUpperCase() : "?"}
                  </div>
                  <div
                    className="rounded-2xl px-4 py-2.5 max-w-[80%] border"
                    style={{
                      background: isAgent ? "var(--color-surface)" : "var(--color-accent-light)",
                      borderColor: isAgent ? "var(--color-border-subtle)" : "var(--color-warm-border)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    {speaker && (
                      <span className={`text-[10px] font-bold uppercase tracking-[0.06em] mb-1 block ${isAgent ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}>
                        {speaker}
                      </span>
                    )}
                    <p className="text-[13px] text-[var(--color-text)] leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DataCard({ icon: Icon, label, value, accent }: {
  icon: typeof IndianRupee;
  label: string;
  value: string | null;
  accent?: boolean;
}) {
  const hasValue = value !== null;
  return (
    <div className="card p-4 animate-fade-up" style={{ animationDelay: "60ms" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={12} className={accent ? "text-[var(--color-accent)] opacity-70" : "text-[var(--color-text-muted)]"} />
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{label}</span>
      </div>
      <p className={`text-sm font-medium ${hasValue ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>
        {value || "Not shared"}
      </p>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Upload, Plus, X, Rocket, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";

interface LeadEntry {
  name: string;
  phone: string;
}

export function CampaignForm() {
  const [campaignName, setCampaignName] = useState("");
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [windowStart, setWindowStart] = useState("09:00");
  const [windowEnd, setWindowEnd] = useState("18:00");
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const handleCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const parsed: LeadEntry[] = results.data
          .map((row) => ({
            name: (row.name || row.Name || "").trim(),
            phone: (row.phone || row.Phone || row.mobile || row.Mobile || "").trim(),
          }))
          .filter((r) => r.name && r.phone);
        setLeads((prev) => [...prev, ...parsed]);
      },
    });

    e.target.value = "";
  }, []);

  const addManual = () => {
    if (!manualName.trim() || !manualPhone.trim()) return;
    setLeads((prev) => [...prev, { name: manualName.trim(), phone: manualPhone.trim() }]);
    setManualName("");
    setManualPhone("");
  };

  const removeLead = (idx: number) => {
    setLeads((prev) => prev.filter((_, i) => i !== idx));
  };

  const launch = async () => {
    if (leads.length === 0 || !campaignName.trim()) return;
    setLaunching(true);

    try {
      const res = await fetch("/api/campaign/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: campaignName.trim(),
          agentId: process.env.NEXT_PUBLIC_BOLNA_AGENT_ID || "",
          leads,
          callingWindow: { start: windowStart, end: windowEnd },
        }),
      });

      if (res.ok) setLaunched(true);
    } finally {
      setLaunching(false);
    }
  };

  if (launched) {
    return (
      <div className="p-8 text-center">
        <div
          className="w-14 h-14 rounded-2xl bg-[var(--color-success-light)] border border-[var(--color-success-border)] flex items-center justify-center mx-auto mb-4"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
        >
          <Rocket size={24} className="text-[var(--color-success)]" />
        </div>
        <h2 className="text-[22px] font-bold mb-2 text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
          Campaign Launched
        </h2>
        <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">
          {leads.length} leads are being called. Check the dashboard for real-time updates.
        </p>
        <a href="/" className="btn-primary inline-block no-underline">Go to Dashboard</a>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <label className="label">Campaign Name</label>
        <input
          type="text"
          className="input max-w-md"
          placeholder="e.g. Whitefield March Batch"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Upload Leads (CSV)</label>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          CSV should have <code className="text-[var(--color-accent)] bg-[var(--color-accent-glow)] px-1.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ fontFamily: "var(--font-mono)" }}>name</code> and{" "}
          <code className="text-[var(--color-accent)] bg-[var(--color-accent-glow)] px-1.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ fontFamily: "var(--font-mono)" }}>phone</code> columns
        </p>
        <label
          className="card-inset border-dashed border-[var(--color-border)] p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[var(--color-accent)] transition-colors rounded-2xl"
        >
          <FileSpreadsheet size={28} className="text-[var(--color-text-muted)]" />
          <span className="text-[13px] text-[var(--color-text-secondary)]">Drop a CSV or click to browse</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleCSV} />
        </label>
      </div>

      <div>
        <label className="label">Or Add Manually</label>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <input type="text" className="input" placeholder="Name" value={manualName} onChange={(e) => setManualName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addManual()} />
          </div>
          <div className="flex-1">
            <input type="text" className="input" placeholder="Phone (+91...)" value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addManual()} />
          </div>
          <button onClick={addManual} className="btn-secondary flex items-center gap-1.5">
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {leads.length > 0 && (
        <div>
          <label className="label">Leads ({leads.length})</label>
          <div className="card-raised divide-y divide-[var(--color-border-subtle)] max-h-64 overflow-y-auto rounded-xl">
            {leads.map((lead, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--color-text)]">{lead.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>{lead.phone}</span>
                </div>
                <button onClick={() => removeLead(i)} className="text-[var(--color-text-muted)] hover:text-[var(--color-hot)] transition-colors p-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="label">Calling Window</label>
        <div className="flex items-center gap-3">
          <input type="time" className="input w-36" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} />
          <span className="text-sm text-[var(--color-text-muted)]">to</span>
          <input type="time" className="input w-36" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} />
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--color-border-subtle)]">
        <button
          onClick={launch}
          disabled={leads.length === 0 || !campaignName.trim() || launching}
          className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload size={15} />
          {launching ? "Launching..." : `Launch Campaign (${leads.length} leads)`}
        </button>
      </div>
    </div>
  );
}

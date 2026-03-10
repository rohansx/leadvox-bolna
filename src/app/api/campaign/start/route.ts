import { NextRequest, NextResponse } from "next/server";
import { triggerCall } from "@/lib/bolna";
import { upsertLead, upsertCampaign } from "@/lib/store";
import type { CampaignStartRequest, Lead } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: CampaignStartRequest = await req.json();

  if (!body.leads || body.leads.length === 0) {
    return NextResponse.json(
      { error: "No leads provided" },
      { status: 400 }
    );
  }

  const campaignId = `campaign-${Date.now()}`;
  const results: { phone: string; callId?: string; error?: string }[] = [];

  for (const entry of body.leads) {
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const lead: Lead = {
      id: leadId,
      name: entry.name,
      phone: entry.phone,
      budget: null,
      location: null,
      bhk: null,
      timeline: null,
      score: "cold",
      scoreReason: "Pending call",
      callDuration: 0,
      callStatus: "pending",
      transcript: null,
      recordingUrl: null,
      siteVisit: { booked: false, date: null, time: null },
      assignedAgent: null,
      calledAt: null,
      createdAt: new Date().toISOString(),
    };

    upsertLead(lead);

    try {
      const callResult = await triggerCall(body.agentId, entry.phone, {
        lead_name: entry.name,
        lead_id: leadId,
      });

      results.push({ phone: entry.phone, callId: callResult.id });

      // Update lead with call-in-progress status
      upsertLead({
        ...lead,
        callStatus: "in_progress",
        calledAt: new Date().toISOString(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      results.push({ phone: entry.phone, error: message });

      upsertLead({
        ...lead,
        callStatus: "failed",
        scoreReason: `Call failed: ${message}`,
      });
    }
  }

  upsertCampaign({
    id: campaignId,
    name: body.campaignName,
    agentId: body.agentId,
    leads: [],
    status: "running",
    callingWindow: body.callingWindow,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    campaignId,
    total: body.leads.length,
    results,
  });
}

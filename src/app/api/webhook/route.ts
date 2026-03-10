import { NextRequest, NextResponse } from "next/server";
import { upsertLead, getLead } from "@/lib/store";
import type { LeadScore } from "@/lib/types";

// Bolna sends call completion events here
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Extract lead_id from user_data passed during call trigger
  const leadId = body.user_data?.lead_id;
  if (!leadId) {
    return NextResponse.json({ status: "ignored", reason: "no lead_id" });
  }

  const existing = getLead(leadId);
  if (!existing) {
    return NextResponse.json(
      { error: "Lead not found" },
      { status: 404 }
    );
  }

  // Parse Bolna webhook payload
  const transcript = body.transcript || body.conversation || null;
  const duration = body.call_duration || body.duration || 0;
  const status = body.status === "completed" ? "completed" : "failed";

  // Extract qualification data from Bolna's extracted variables
  const extracted = body.extracted_data || body.variables || {};
  const budget = extracted.budget || null;
  const location = extracted.location || extracted.preferred_location || null;
  const bhk = extracted.bhk || extracted.property_type || null;
  const timeline = extracted.timeline || null;

  // Determine score
  let score: LeadScore = "cold";
  let scoreReason = "No qualification data extracted";

  if (budget && timeline) {
    const urgentTimeline = /\b(1|2|3)\s*month|immediate|asap|urgent/i.test(
      timeline
    );
    if (urgentTimeline && location) {
      score = "hot";
      scoreReason = `Budget: ${budget}, Timeline: ${timeline}, Location: ${location}`;
    } else {
      score = "warm";
      scoreReason = `Budget: ${budget}, Timeline: ${timeline}`;
    }
  } else if (budget) {
    score = "warm";
    scoreReason = `Has budget (${budget}) but unclear timeline`;
  }

  upsertLead({
    ...existing,
    budget,
    location,
    bhk,
    timeline,
    score,
    scoreReason,
    callDuration: duration,
    callStatus: status,
    transcript: typeof transcript === "string" ? transcript : JSON.stringify(transcript),
    siteVisit: body.site_visit_booked
      ? {
          booked: true,
          date: body.site_visit_date || null,
          time: body.site_visit_time || null,
        }
      : existing.siteVisit,
  });

  return NextResponse.json({ status: "ok", leadId, score });
}

import { NextRequest, NextResponse } from "next/server";
import type { BookVisitRequest } from "@/lib/types";

// Called BY Bolna during a live call when the agent triggers book_site_visit
export async function POST(req: NextRequest) {
  const body: BookVisitRequest = await req.json();

  // In production, this would create a calendar event, send SMS confirmation, etc.
  // For the demo, we acknowledge the booking and return a message for the agent to read

  const confirmation = {
    status: "confirmed",
    message: `Site visit booked for ${body.lead_name} on ${body.preferred_date} (${body.preferred_time}). Property interest: ${body.property_interest}. Our sales team will send a confirmation SMS shortly.`,
    booking_id: `BK-${Date.now().toString(36).toUpperCase()}`,
  };

  return NextResponse.json(confirmation);
}

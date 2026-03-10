import { NextRequest, NextResponse } from "next/server";
import { fetchLeadsFromBolna, fetchLeadFromBolna } from "@/lib/bolna";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    // Single lead fetch
    if (id) {
      const lead = await fetchLeadFromBolna(id);
      if (!lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }
      return NextResponse.json({ lead });
    }

    // All leads + stats from Bolna
    const { leads, stats } = await fetchLeadsFromBolna();
    return NextResponse.json({ leads, stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

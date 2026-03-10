import type { Lead, LeadScore, DashboardStats } from "./types";

const BASE_URL = process.env.BOLNA_BASE_URL || "https://api.bolna.ai";
const API_KEY = process.env.BOLNA_API_KEY || "";
const AGENT_ID = process.env.BOLNA_AGENT_ID || "";

async function bolnaFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bolna API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function triggerCall(
  agentId: string,
  phone: string,
  userData?: Record<string, string>
) {
  return bolnaFetch("/call", {
    method: "POST",
    body: JSON.stringify({
      agent_id: agentId,
      recipient_phone_number: phone,
      user_data: userData,
    }),
  });
}

export async function getCallDetails(callId: string) {
  return bolnaFetch(`/call/${callId}`);
}

export async function getAgentExecutions(): Promise<BolnaExecution[]> {
  return bolnaFetch(`/agent/${AGENT_ID}/executions`);
}

// Score a lead based on transcript content
function scoreLead(transcript: string): { score: LeadScore; reason: string } {
  const lower = transcript.toLowerCase();

  const hasBudget = /budget|lakh|lakhs|crore|crores|₹|\bL\b|\bCr\b/i.test(lower) ||
    /fifty|sixty|seventy|eighty|ninety|hundred|thousand/i.test(lower);
  const hasTimeline = /month|months|week|weeks|immediately|soon|urgent|asap|switch|shift/i.test(lower);
  const hasLocation = /whitefield|koramangala|electronic city|sarjapur|hsr|indiranagar|marathahalli|hebbal|yelahanka|jp nagar|jayanagar|bannerghatta/i.test(lower);
  const notInterested = /not interested|just browsing|not looking|no thanks/i.test(lower);
  const urgentTimeline = /\b(1|2|3|one|two|three)\s*(month|months|week|weeks)\b|immediately|urgent|asap/i.test(lower);

  if (notInterested) {
    return { score: "cold", reason: "Not interested or just browsing" };
  }

  if (hasBudget && urgentTimeline && hasLocation) {
    return { score: "hot", reason: "Clear budget, urgent timeline, location preference" };
  }

  if (hasBudget && hasTimeline) {
    return { score: "hot", reason: "Has budget and active timeline" };
  }

  if (hasBudget) {
    return { score: "warm", reason: "Has budget but timeline unclear" };
  }

  return { score: "cold", reason: "No clear buying signals" };
}

// Extract structured data from transcript
function extractData(transcript: string) {
  const lines = transcript.split("\n");

  let budget: string | null = null;
  let location: string | null = null;
  let bhk: string | null = null;
  let timeline: string | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const isUser = line.startsWith("user:");

    if (!isUser) continue;

    // Budget
    if (!budget) {
      const budgetMatch = lower.match(
        /(\d+[\s]*(?:to|-)[\s]*\d+[\s]*(?:lakh|lakhs|crore|crores))|(\d+[\s]*(?:lakh|lakhs|crore|crores))/i
      );
      if (budgetMatch) {
        budget = budgetMatch[0].trim();
      } else if (/fifty.*sixty|sixty.*seventy|fifty.*lakh|sixty.*lakh/i.test(lower)) {
        const nums = lower.match(/(fifty|sixty|seventy|eighty|ninety|hundred)/gi);
        if (nums && nums.length >= 2) {
          budget = `${nums[0]} to ${nums[1]} lakh`;
        } else if (nums) {
          budget = `${nums[0]} lakh`;
        }
      }
    }

    // Location
    if (!location) {
      const locs = [
        "whitefield", "koramangala", "electronic city", "sarjapur",
        "hsr", "indiranagar", "marathahalli", "hebbal", "yelahanka",
        "jp nagar", "jayanagar", "bannerghatta", "btm", "harlur",
      ];
      for (const loc of locs) {
        if (lower.includes(loc)) {
          location = loc.charAt(0).toUpperCase() + loc.slice(1);
          break;
        }
      }
    }

    // BHK
    if (!bhk) {
      const bhkMatch = lower.match(/(\d)\s*bhk|one\s*bhk|two\s*bhk|three\s*bhk|four\s*bhk|villa/i);
      if (bhkMatch) {
        bhk = bhkMatch[0].trim().toUpperCase();
        if (bhk.startsWith("ONE")) bhk = "1 BHK";
        if (bhk.startsWith("TWO")) bhk = "2 BHK";
        if (bhk.startsWith("THREE")) bhk = "3 BHK";
        if (bhk.startsWith("FOUR")) bhk = "4 BHK";
      }
    }

    // Timeline
    if (!timeline) {
      const timeMatch = lower.match(
        /(\d+[\s]*(?:month|months|week|weeks))|immediately|two months|three months|six months/i
      );
      if (timeMatch) {
        timeline = timeMatch[0].trim();
      }
    }
  }

  return { budget, location, bhk, timeline };
}

// Transform Bolna execution into our Lead type
function executionToLead(exec: BolnaExecution): Lead {
  const transcript = exec.transcript || "";
  const { score, reason } = scoreLead(transcript);
  const extracted = extractData(transcript);

  const hasSiteVisit = /schedul|site visit|book.*visit|visit.*book/i.test(transcript);
  const siteVisitBooked = hasSiteVisit && score === "hot";

  return {
    id: exec.id,
    name: exec.context_details?.recipient_data?.name ||
      extractNameFromTranscript(transcript) ||
      formatPhone(exec.user_number),
    phone: exec.user_number || "",
    budget: extracted.budget,
    location: extracted.location,
    bhk: extracted.bhk,
    timeline: extracted.timeline,
    score,
    scoreReason: reason,
    callDuration: Math.round(exec.conversation_duration || 0),
    callStatus: exec.status === "completed" ? "completed" : "failed",
    transcript: transcript || null,
    recordingUrl: exec.telephony_data?.recording_url || null,
    siteVisit: {
      booked: siteVisitBooked,
      date: null,
      time: null,
    },
    assignedAgent: null,
    calledAt: exec.initiated_at || exec.created_at,
    createdAt: exec.created_at,
  };
}

function extractNameFromTranscript(transcript: string): string | null {
  // Try to find name from context in conversation
  const nameMatch = transcript.match(/speaking with\s+(\w+)/i);
  return nameMatch ? nameMatch[1] : null;
}

function formatPhone(phone: string): string {
  if (!phone) return "Unknown";
  // Show last 4 digits
  return `Lead ${phone.slice(-4)}`;
}

// Fetch all leads from Bolna and transform
export async function fetchLeadsFromBolna(): Promise<{
  leads: Lead[];
  stats: DashboardStats;
}> {
  const executions = await getAgentExecutions();

  const leads = executions
    .filter((e) => e.status === "completed" && e.conversation_duration > 5)
    .map(executionToLead)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const qualified = leads.filter((l) => l.score !== "cold");

  const stats: DashboardStats = {
    totalLeads: leads.length,
    callsMade: leads.length,
    qualificationRate: leads.length > 0
      ? Math.round((qualified.length / leads.length) * 100)
      : 0,
    avgCallDuration: leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.callDuration, 0) / leads.length)
      : 0,
  };

  return { leads, stats };
}

export async function fetchLeadFromBolna(id: string): Promise<Lead | null> {
  try {
    const executions = await getAgentExecutions();
    const exec = executions.find((e) => e.id === id);
    if (!exec) return null;
    return executionToLead(exec);
  } catch {
    return null;
  }
}

// Bolna execution type
interface BolnaExecution {
  id: string;
  agent_id: string;
  created_at: string;
  initiated_at: string | null;
  conversation_duration: number;
  transcript: string | null;
  extracted_data: Record<string, string> | null;
  summary: string | null;
  status: string;
  user_number: string;
  telephony_data: {
    recording_url?: string;
    hangup_by?: string;
    duration?: string;
  } | null;
  context_details: {
    recipient_data?: {
      name?: string;
    };
    recipient_phone_number?: string;
  } | null;
}

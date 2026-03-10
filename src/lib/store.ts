import type { Lead, Campaign, DashboardStats } from "./types";

// In-memory store for webhook-driven state
// Persists only for the lifetime of the serverless function (sufficient for demo)

const leads = new Map<string, Lead>();
const campaigns = new Map<string, Campaign>();

export function upsertLead(lead: Lead) {
  leads.set(lead.id, lead);
}

export function getLead(id: string): Lead | undefined {
  return leads.get(id);
}

export function getAllLeads(): Lead[] {
  return Array.from(leads.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLeadsByScore(score: Lead["score"]): Lead[] {
  return getAllLeads().filter((l) => l.score === score);
}

export function upsertCampaign(campaign: Campaign) {
  campaigns.set(campaign.id, campaign);
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.get(id);
}

export function getAllCampaigns(): Campaign[] {
  return Array.from(campaigns.values());
}

export function getStats(): DashboardStats {
  const all = getAllLeads();
  const completed = all.filter((l) => l.callStatus === "completed");
  const qualified = completed.filter((l) => l.score !== "cold");

  return {
    totalLeads: all.length,
    callsMade: completed.length,
    qualificationRate: completed.length > 0
      ? Math.round((qualified.length / completed.length) * 100)
      : 0,
    avgCallDuration: completed.length > 0
      ? Math.round(
          completed.reduce((sum, l) => sum + l.callDuration, 0) /
            completed.length
        )
      : 0,
  };
}

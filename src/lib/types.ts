export type LeadScore = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  budget: string | null;
  location: string | null;
  bhk: string | null;
  timeline: string | null;
  score: LeadScore;
  scoreReason: string;
  callDuration: number; // seconds
  callStatus: "pending" | "in_progress" | "completed" | "failed" | "no_answer";
  transcript: string | null;
  recordingUrl: string | null;
  siteVisit: {
    booked: boolean;
    date: string | null;
    time: string | null;
  };
  assignedAgent: string | null;
  calledAt: string | null;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  agentId: string;
  leads: Lead[];
  status: "draft" | "running" | "completed";
  callingWindow: {
    start: string; // HH:mm
    end: string;
  };
  createdAt: string;
}

export interface CampaignStartRequest {
  campaignName: string;
  agentId: string;
  leads: { name: string; phone: string }[];
  callingWindow: { start: string; end: string };
}

export interface BookVisitRequest {
  lead_name: string;
  preferred_date: string;
  preferred_time: string;
  property_interest: string;
}

export interface BolnaCallRequest {
  agent_id: string;
  recipient_phone_number: string;
  user_data?: Record<string, string>;
}

export interface DashboardStats {
  totalLeads: number;
  callsMade: number;
  qualificationRate: number;
  avgCallDuration: number;
}

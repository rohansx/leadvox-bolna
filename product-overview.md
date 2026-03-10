# Bolna FSE Assignment — Strategy & Product Overview

## Why Use Case Selection Matters

Bolna's assignment isn't testing whether you can plug into their API — anyone can do that. They're testing:

1. **Product sense** — Can you identify a real, painful enterprise problem?
2. **Full-stack speed** — Can you ship a working product in ~7 hours?
3. **Voice AI understanding** — Do you understand how voice pipelines work?
4. **Business alignment** — Do you understand Bolna's market?

---

## What Most Candidates Will Build (Avoid These)

| Use Case | Why Everyone Picks It | Why It's Weak |
|---|---|---|
| Candidate Screening Bot | It's Bolna's flagship case study (Awign) | Zero differentiation; Bolna already has 5+ screening templates |
| Customer Support Agent | Generic, "safe" choice | Bolna has a full template for this; doesn't show product thinking |
| Appointment Scheduler | Common voice AI demo | Overdone across every voice AI platform |

---

## Recommended Use Case: **Real Estate Lead Qualifier**

### The Problem (Real, Massive, Indian)

India's property portals (99acres, MagicBricks, Housing.com) generate **thousands of leads daily** per developer. The painful reality:

- **80% of leads never get a response within the first hour**
- Lead qualification odds **drop 400% if response takes > 5 minutes**
- Sales agents are busy with site visits — can only call ~30 prospects/day
- **40% of inquiries come after business hours** (7 PM–11 PM)
- Tier 2/3 city leads often prefer Hindi/Hinglish — English-only agents can't convert them
- By the time an agent calls back, the prospect has spoken to 3–4 other brokers

A mid-sized Bangalore developer receiving 150 leads/day with 5 agents? Each agent would need 30 calls/day while also doing site visits, closings, and paperwork. It simply doesn't work.

### Why This Use Case Wins

1. **Bolna's market fit** — BFSI and e-commerce are Bolna's core verticals. Real estate sits at the intersection (high-value transactions, phone-first culture, multilingual India)
2. **Not in their template library** — Bolna has screening, support, cart recovery, and onboarding templates. No real estate qualifier. You're showing them a *new vertical*
3. **Uses their best features** — Multilingual (Hindi/Hinglish), function calling (check availability via API), webhook callbacks, bulk campaign calling
4. **Clear outcome metrics** — Qualification rate, response time (< 30 sec vs hours), conversion to site visit, cost per qualified lead
5. **Visually compelling dashboard** — Pipeline/funnel view is inherently satisfying to demo

### Outcome Metric

**Site Visit Conversion Rate** — percentage of raw leads that convert to a scheduled site visit, compared to the manual baseline (~5–8% industry average → target 15–20% with instant AI qualification).

---

## Product: **PropQual** — AI-Powered Real Estate Lead Qualification

### One-Liner

> Voice AI agent that instantly qualifies real estate leads, captures budget/location/timeline preferences in Hindi or English, and surfaces a ranked pipeline to sales teams.

### User Personas

| Persona | Role | Pain Point |
|---|---|---|
| **Sales Manager** | Runs a team of 5–10 agents at a developer firm | Can't respond to leads fast enough; agents waste time on junk leads |
| **Sales Agent** | Makes 20–30 calls/day manually | Spends 60% of time on unqualified leads who are "just browsing" |

### User Flow (End-to-End)

```
[Lead arrives via 99acres/MagicBricks/website form]
                    ↓
[Sales Manager opens PropQual dashboard]
                    ↓
[Uploads CSV of leads OR enters phone numbers]
                    ↓
[Clicks "Start Campaign" → triggers Bolna outbound calls]
                    ↓
[Bolna AI Agent calls each lead]
  → Greets in Hindi/English based on preference
  → Asks: Budget range? Preferred location? BHK type? Timeline?
  → Handles objections ("just browsing" → soft qualify)
  → If qualified → offers to book a site visit (function call)
  → If not ready → schedules a follow-up callback
                    ↓
[Webhook sends call results back to PropQual]
                    ↓
[Dashboard updates in real-time]
  → Lead pipeline: Hot / Warm / Cold
  → Each lead card: name, budget, location, score, transcript
  → Campaign stats: calls made, qualification rate, avg call duration
```

### Agent Prompt (Draft)

```
PERSONALITY:
You are Priya, a friendly and professional real estate advisor calling on behalf
of {company_name}. You speak naturally in Hindi, English, or Hinglish based on
how the prospect responds. You are warm but efficient — respect their time.

CONTEXT:
You are calling {lead_name} who recently expressed interest in properties in
{city}. Your goal is to understand their requirements and determine if they're
a serious buyer.

INSTRUCTIONS:
1. Greet them warmly and introduce yourself
2. Confirm they were looking at properties in {city}
3. Ask about their BUDGET RANGE (essential — don't skip)
4. Ask about preferred LOCATION/AREA within the city
5. Ask about BHK preference (1/2/3 BHK or villa)
6. Ask about TIMELINE — when are they looking to move?
7. If they seem qualified (has budget, timeline < 6 months):
   → Offer to schedule a FREE site visit using @book_site_visit
8. If not ready: "No problem! Can I call you back in a few weeks?"

GUARDRAILS:
- Never discuss competitor projects negatively
- Never promise discounts or price negotiations
- If they ask for exact pricing, say "I can arrange for our sales team
  to share detailed pricing. Would a site visit work for you?"
- Keep the call under 3 minutes
- If they're not interested, thank them politely and end

SCORING (internal — for webhook extraction):
- HOT: Has budget + timeline < 3 months + location preference
- WARM: Has budget but timeline is flexible or "exploring"
- COLD: No budget clarity, just browsing, or not interested
```

### Function Call: `book_site_visit`

```json
{
  "name": "book_site_visit",
  "description": "Book a property site visit for the lead when they show strong buying intent",
  "parameters": {
    "type": "object",
    "properties": {
      "lead_name": {
        "type": "string",
        "description": "Name of the lead"
      },
      "preferred_date": {
        "type": "string",
        "description": "Preferred date for site visit"
      },
      "preferred_time": {
        "type": "string",
        "description": "Preferred time slot (morning/afternoon/evening)"
      },
      "property_interest": {
        "type": "string",
        "description": "Type of property they're interested in"
      }
    }
  },
  "key": "custom_task",
  "value": {
    "method": "POST",
    "param": {
      "lead_name": "%(lead_name)s",
      "preferred_date": "%(preferred_date)s",
      "preferred_time": "%(preferred_time)s",
      "property_interest": "%(property_interest)s"
    },
    "url": "https://your-app.vercel.app/api/book-visit",
    "api_token": "Bearer YOUR_TOKEN"
  }
}
```

### Dashboard Design (Pages)

**Page 1: Campaign Dashboard (Main)**
- Top stats bar: Total Leads | Calls Made | Qualification Rate | Avg Call Duration
- Lead pipeline in 3 columns: 🔥 Hot | 🟡 Warm | 🔵 Cold
- Each lead card shows: Name, Budget, Location pref, Score, Call duration
- Click a card → expands to show transcript + recording link

**Page 2: New Campaign**
- Upload CSV (name, phone) or enter numbers manually
- Select agent (pre-configured Bolna agent)
- Set calling window (time range)
- "Launch Campaign" button

**Page 3: Lead Detail**
- Full call transcript
- Extracted data: Budget, Location, BHK, Timeline
- Lead score with reasoning
- Site visit booking status
- "Assign to Agent" button (for human follow-up)

---

## Technical Architecture

```
┌─────────────────────────────────────────────┐
│                  VERCEL                       │
│                                               │
│  Next.js App                                  │
│  ├── /app/page.tsx          (Dashboard)       │
│  ├── /app/campaign/page.tsx (New Campaign)    │
│  ├── /app/lead/[id]/page.tsx(Lead Detail)     │
│  │                                            │
│  ├── /api/campaign/start    (Triggers calls)  │
│  ├── /api/webhook           (Receives events) │
│  ├── /api/book-visit        (Function call)   │
│  └── /api/leads             (Fetch from Bolna)│
│                                               │
└──────────────┬────────────────────────────────┘
               │
               │  HTTPS
               ▼
┌──────────────────────────┐
│       BOLNA API          │
│                          │
│  POST /v2/agent          │
│  POST /call              │
│  GET  /call/:id          │
│  Webhooks → your /api    │
└──────────────────────────┘
```

**No database needed.** Bolna stores all call data. Your API routes are thin proxies:
- `/api/campaign/start` — loops through phone numbers, calls `POST /call` for each
- `/api/webhook` — receives Bolna events, can store in-memory or just forward to frontend via polling
- `/api/leads` — fetches call logs from Bolna API, transforms for dashboard display
- `/api/book-visit` — receives function call from Bolna agent, returns confirmation

### State Management

For the demo, you have two options:
1. **Poll Bolna API** — Dashboard polls `/api/leads` every 5 seconds, which fetches latest from Bolna
2. **Webhook + in-memory store** — Webhook writes to a simple Map/array in your API route, dashboard reads from it

Option 1 is simpler and totally sufficient for the demo. Option 2 is more "real" and shows you understand event-driven architecture.

---

## Execution Timeline (~7 hrs)

| Phase | Time | Tasks |
|---|---|---|
| **1. Setup** | 30 min | Sign up on platform.bolna.ai, get API key, scaffold Next.js project |
| **2. Agent** | 1.5 hrs | Create agent via dashboard OR API, write prompt, configure Hindi+English, add function call, test with your own phone |
| **3. Web App — Core** | 3 hrs | Build 3 pages (dashboard, campaign creator, lead detail), wire up API routes, style with Tailwind |
| **4. Integration** | 1 hr | Connect campaign → Bolna calls, webhook → dashboard updates, function call → site visit booking |
| **5. Polish + Demo** | 1 hr | Record screen demo showing full flow, write README, deploy to Vercel, push to GitHub |

---

## What Makes This Stand Out

1. **New vertical for Bolna** — You're not copying their templates, you're showing them a market they should enter
2. **Indian market insight** — Real estate is a ₹25 lakh crore+ market; phone-first culture; multilingual requirement maps perfectly to Bolna's strengths
3. **Function calling** — Most candidates will just build prompt → response. You're using Bolna's tool calling to trigger real actions (site visit booking)
4. **Production-quality UI** — Pipeline/Kanban view is visually impressive and immediately understandable
5. **Your voice AI background** — You built voice infrastructure at MyClone with ElevenLabs, LiveKit, and RAG. This demonstrates you can bring real experience to Bolna, not just follow a tutorial

---

## Alternative Use Cases (If You Pivot)

### Option B: EdTech Student Re-engagement
Student signs up for an online course, goes inactive after 3 days. Agent calls to check what's blocking them (content too hard? technical issues? lost motivation?). Dashboard shows re-engagement funnel and common dropout reasons. **Metric:** Reactivation rate.

### Option C: D2C Post-Purchase NPS + Returns
After product delivery, agent calls customer, collects rating, captures complaints, offers return/exchange if unhappy. Dashboard shows NPS trends and auto-categorized issues. **Metric:** NPS score, return initiation rate.

Both are solid but the real estate qualifier has the strongest combination of visual appeal, clear metrics, and market relevance for Bolna.

---

## Next Steps

1. Sign up at https://platform.bolna.ai
2. Generate API key (Developers tab)
3. Create the agent with the prompt above (tweak for your chosen city/developer name)
4. Test it by calling your own phone
5. Scaffold the Next.js project and start building
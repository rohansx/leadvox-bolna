# LeadVox — AI-Powered Real Estate Lead Qualification

Voice AI agent that instantly qualifies real estate leads, captures budget/location/timeline preferences in Hindi or English, and surfaces a ranked pipeline to sales teams.

Built with [Bolna](https://bolna.ai) voice AI platform.

## Problem

India's property portals generate thousands of leads daily. 80% never get a response within the first hour, and qualification odds drop 400% if response takes over 5 minutes. Sales agents can only call ~30 prospects/day while juggling site visits and paperwork.

LeadVox solves this by deploying an AI voice agent (Priya) that instantly calls every lead, qualifies them in Hindi/English, and feeds a real-time pipeline to the sales team.

## How It Works

```
Lead arrives (CSV upload / manual entry)
        ↓
Campaign launched → Bolna AI calls each lead
        ↓
Priya asks: Budget? Location? BHK? Timeline?
        ↓
Call data flows back via Bolna API
        ↓
Dashboard scores leads: Hot / Warm / Cold
        ↓
Sales team sees ranked pipeline + transcripts + recordings
```

## Features

- **AI Voice Agent** — Priya speaks Hindi, English, and Hinglish naturally
- **Lead Scoring** — Automatic Hot/Warm/Cold classification based on budget, timeline, and location
- **Kanban Pipeline** — 3-column view with real-time updates (polls every 5s)
- **Call Transcripts** — Full conversation with chat-bubble UI
- **Call Recordings** — Playable audio directly in the dashboard
- **Campaign Management** — CSV upload or manual entry, configurable calling window
- **Data Extraction** — Budget, location, BHK, timeline parsed from transcripts

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Voice AI:** Bolna API
- **LLM:** GPT-4.1-mini (via Bolna)
- **Voice:** ElevenLabs (Nila)
- **Transcription:** Deepgram Nova-3 (Hindi + English)
- **Deployment:** Vercel

## Architecture

```
┌─────────────────────────────────────────┐
│              VERCEL / LOCAL              │
│                                         │
│  Next.js App                            │
│  ├── /                    Dashboard     │
│  ├── /campaign            New Campaign  │
│  ├── /lead/[id]           Lead Detail   │
│  │                                      │
│  API Routes                             │
│  ├── /api/leads           Fetch + score │
│  ├── /api/campaign/start  Trigger calls │
│  ├── /api/webhook         Receive events│
│  └── /api/book-visit      Function call │
│                                         │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────┐
│       BOLNA API          │
│  Calls, transcripts,     │
│  recordings, webhooks    │
└──────────────────────────┘
```

No database — Bolna stores all call data. The app fetches, scores, and displays it.

## Setup

### 1. Clone and install

```bash
git clone git@github.com:rohansx/leadvox-bolna.git
cd leadvox-bolna
npm install
```

### 2. Configure Bolna

1. Sign up at [platform.bolna.ai](https://platform.bolna.ai)
2. Create an agent from the dashboard with the prompt in `docs/agent-design.md`
3. Copy your API key (Developers tab) and agent ID

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
BOLNA_API_KEY=your_api_key
BOLNA_AGENT_ID=your_agent_id
BOLNA_BASE_URL=https://api.bolna.ai
NEXT_PUBLIC_BOLNA_AGENT_ID=your_agent_id
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Stats bar + Kanban pipeline (Hot/Warm/Cold) |
| New Campaign | `/campaign` | CSV upload, manual entry, launch calls |
| Lead Detail | `/lead/[id]` | Transcript, recording, extracted data, score |

## Lead Scoring

| Score | Criteria |
|---|---|
| **Hot** | Has budget + timeline < 3 months + location preference |
| **Warm** | Has budget but flexible timeline |
| **Cold** | No budget clarity, just browsing, or not interested |

## Outcome Metric

**Site Visit Conversion Rate** — percentage of raw leads that convert to a scheduled site visit.

- Industry average (manual): 5-8%
- Target with AI qualification: 15-20%

## License

MIT

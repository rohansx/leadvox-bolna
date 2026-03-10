# Architecture

## System Overview

LeadVox (PropQual) is a Next.js application deployed on Vercel that orchestrates Bolna voice AI agents for real estate lead qualification. The app acts as a thin orchestration layer — Bolna handles all voice/call infrastructure while LeadVox provides the campaign management UI and data transformation.

## High-Level Diagram

```
┌─────────────────────────────────────────────────┐
│                    VERCEL                        │
│                                                  │
│  Next.js App (App Router)                        │
│  ├── /app/page.tsx              Dashboard        │
│  ├── /app/campaign/page.tsx     New Campaign     │
│  ├── /app/lead/[id]/page.tsx    Lead Detail      │
│  │                                               │
│  API Routes                                      │
│  ├── /api/campaign/start        Trigger calls    │
│  ├── /api/webhook               Receive events   │
│  ├── /api/book-visit            Function call    │
│  └── /api/leads                 Fetch from Bolna │
│                                                  │
└──────────────────┬───────────────────────────────┘
                   │  HTTPS
                   ▼
┌──────────────────────────────┐
│         BOLNA API            │
│                              │
│  POST /v2/agent              │
│  POST /call                  │
│  GET  /call/:id              │
│  Webhooks → /api/webhook     │
└──────────────────────────────┘
```

## Design Decisions

### No Database

Bolna stores all call data (transcripts, metadata, recordings). LeadVox API routes are thin proxies that fetch, transform, and serve data to the frontend. This eliminates database setup/migration overhead entirely.

### State Management Options

| Approach | How It Works | Trade-off |
|---|---|---|
| **Poll Bolna API** | Dashboard polls `/api/leads` every 5 seconds | Simpler; sufficient for demo |
| **Webhook + in-memory store** | `/api/webhook` writes to a Map/array, dashboard reads from it | More production-realistic; shows event-driven thinking |

Recommendation: Start with polling for speed, upgrade to webhook-driven if time allows.

### API Route Responsibilities

| Route | Purpose | Bolna Interaction |
|---|---|---|
| `POST /api/campaign/start` | Loops through phone numbers, triggers outbound calls | `POST /call` per number |
| `POST /api/webhook` | Receives call completion events from Bolna | Inbound webhook |
| `GET /api/leads` | Fetches call logs, transforms for dashboard display | `GET /call/:id` |
| `POST /api/book-visit` | Handles `book_site_visit` function call from Bolna agent | Called BY Bolna during a live call |

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Voice AI:** Bolna API
- **Language:** TypeScript

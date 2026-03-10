# Execution Plan

## Phases

### Phase 1: Setup (30 min)
- Sign up on platform.bolna.ai
- Generate API key (Developers tab)
- Scaffold Next.js project with Tailwind

### Phase 2: Agent (1.5 hrs)
- Create agent via Bolna dashboard or API
- Write prompt (see agent-design.md)
- Configure Hindi + English support
- Add `book_site_visit` function call
- Test with your own phone number

### Phase 3: Web App Core (3 hrs)
- Build 3 pages: Dashboard, Campaign Creator, Lead Detail
- Wire up API routes (`/api/campaign/start`, `/api/webhook`, `/api/leads`, `/api/book-visit`)
- Style with Tailwind — focus on the pipeline/Kanban view

### Phase 4: Integration (1 hr)
- Connect campaign creation → Bolna outbound calls
- Webhook → dashboard updates
- Function call → site visit booking flow

### Phase 5: Polish + Demo (1 hr)
- Record screen demo showing full flow
- Write README
- Deploy to Vercel
- Push to GitHub

## What Makes This Stand Out

1. New vertical — not copying Bolna's existing templates
2. Indian market insight — ₹25L Cr+ market, phone-first culture
3. Function calling — triggering real actions (site visit booking), not just prompt→response
4. Production-quality UI — Kanban pipeline view
5. Voice AI background — prior experience with ElevenLabs, LiveKit, RAG at MyClone

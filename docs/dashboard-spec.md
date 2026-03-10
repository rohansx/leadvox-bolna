# Dashboard Spec

## Pages

### 1. Campaign Dashboard (Main — `/`)

**Top stats bar:**
- Total Leads
- Calls Made
- Qualification Rate
- Avg Call Duration

**Pipeline view** — 3 columns (Kanban-style):

| Hot | Warm | Cold |
|---|---|---|
| Leads with strong intent | Exploring / flexible timeline | Not interested / no budget |

**Lead cards show:**
- Name
- Budget range
- Location preference
- Score (Hot/Warm/Cold)
- Call duration

Click a card → expands to show transcript + recording link.

---

### 2. New Campaign (`/campaign`)

- Upload CSV (columns: name, phone) or enter numbers manually
- Select pre-configured Bolna agent
- Set calling window (time range)
- "Launch Campaign" button → triggers `POST /api/campaign/start`

---

### 3. Lead Detail (`/lead/[id]`)

- Full call transcript
- Extracted data: Budget, Location, BHK, Timeline
- Lead score with reasoning
- Site visit booking status
- "Assign to Agent" button (for human follow-up)

## Design Notes

- Pipeline/Kanban view is the visual centerpiece — make it look polished
- Real-time updates via polling (every 5s) or webhook-driven
- Mobile-responsive is nice-to-have, desktop-first for demo

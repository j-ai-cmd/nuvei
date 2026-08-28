# Legal AI — Contract Intake Assistant

A production-ready Next.js 14 application demonstrating how a Legal Operations Technology & AI specialist could automate contract intake, analysis, risk identification, and matter creation.

## Features

- **PDF / DOCX upload** — drag-and-drop or browse; 25MB limit
- **Text extraction** — server-side, no filesystem; Node.js runtime
- **AI contract analysis** — structured JSON with 23+ metadata fields, risk scoring, executive summary
- **Zod validation** — all AI output validated; malformed JSON recovered with retry
- **Risk analysis** — severity scoring (LOW / MEDIUM / HIGH / CRITICAL), recommended actions
- **Demo mode** — full workflow without uploading a document; works without an API key
- **Matter creation** — simulated CLM integration with generated matter ID
- **Live dashboard** — metrics computed from session history: risk distribution, volume, cycle time
- **Provider-agnostic UI** — no AI provider names visible to end users

## Stack

- Next.js 14 (App Router)
- TypeScript + Zod
- Tailwind CSS (custom design system)
- `pdf-parse` + `mammoth` for document extraction
- Chart.js + react-chartjs-2

---

## Setup

```bash
git clone <repo>
cd nuvei
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
KIMI_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## AI Provider Configuration

### Required environment variable

| Variable | Description |
|---|---|
| `KIMI_API_KEY` | Your API key (server-side only) |

The model is hardcoded server-side. No other configuration is required.

### Demo mode (no API key)

If `KIMI_API_KEY` is not set, the app uses pre-computed demo analysis data. A **DEMO DATA** banner is shown prominently in the UI. Real PDF uploads will return an error rather than silently showing demo data.

---

## Vercel Deployment

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set one environment variable in **Project Settings → Environment Variables**:
   - `KIMI_API_KEY`
4. Deploy

No special build settings required. The app uses the Node.js runtime for API routes (`export const runtime = "nodejs"`).

---

## Architecture

```
/app
  layout.tsx              Root layout (sidebar, topbar, footer)
  page.tsx                Contract Intake upload page
  /analysis/[id]          Analysis results with 5 tabs
  /dashboard              Executive dashboard with live metrics
  /api/analyze            POST: file → extract → AI → Zod → JSON
  /api/matter             POST: simulated CLM matter creation

/components
  /layout                 SideNav, TopBar, Footer
  /intake                 UploadZone, ProcessingModal, WorkflowStepper
  /analysis               RiskScoreCard, RiskCard, KeyTermsGrid, AISummaryPanel, MatterModal
  /dashboard              StatCard, Charts (VolumeChart, RiskDonut)

/lib
  kimi.ts                 AI API client (server-only)
  extract-pdf.ts          PDF text extraction (Node.js runtime)
  extract-docx.ts         DOCX text extraction
  demo-contract.ts        Fictional sample contract text
  demo-analysis.ts        Pre-computed demo analysis

/types
  contract.ts             TypeScript interfaces + Zod schemas
```

---

## Security

- `KIMI_API_KEY` exists only in server-side process environment; it is never imported by any client component, included in API responses, or logged
- All document processing is in-memory — no temp files written to disk
- API errors are sanitized before reaching the frontend; raw provider error bodies are only logged server-side
- The AI provider name and model are never visible in the user-facing UI

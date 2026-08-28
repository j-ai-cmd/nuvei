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
cd legal-ai-intake
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
KIMI_API_KEY=your_key_here
KIMI_MODEL=moonshot-v1-32k
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## AI Provider Configuration

This app uses the [Moonshot (Kimi) API](https://platform.moonshot.cn/).

### Required environment variables

| Variable | Description |
|---|---|
| `KIMI_API_KEY` | Your Moonshot API key |
| `KIMI_MODEL` | Model name — **verify in your Moonshot console before deploying** |

**Available models (verify current availability in your console):**

| Model | Context | Use case |
|---|---|---|
| `moonshot-v1-8k` | 8K tokens | Short contracts, fast |
| `moonshot-v1-32k` | 32K tokens | Most contracts (recommended) |
| `moonshot-v1-128k` | 128K tokens | Very long multi-part agreements |

> **Note:** Model availability changes. Always verify the list at [platform.moonshot.cn](https://platform.moonshot.cn/) before deploying.

### Demo mode (no API key)

If `KIMI_API_KEY` or `KIMI_MODEL` is not set, the app uses pre-computed demo analysis data. A **DEMO DATA** banner is shown prominently in the UI.

---

## Vercel Deployment

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set environment variables in **Project Settings → Environment Variables**:
   - `KIMI_API_KEY`
   - `KIMI_MODEL`
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

- `KIMI_API_KEY` is server-side only — never present in client bundles
- No AI provider names appear in the frontend (provider-agnostic UI)
- Files are processed in memory from buffers — no filesystem writes
- All documents are discarded after the API response unless the user saves to a Matter

---

## Disclaimer

This is a concept prototype demonstrating AI-assisted legal operations. It is not legal advice. All AI analysis should be reviewed by qualified legal counsel before any action is taken.

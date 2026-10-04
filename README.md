# Nuvei Legal: contract intake assistant

A concept prototype showing how Nuvei Legal could use AI for the first pass on incoming contracts. You upload a PDF or DOCX, the app extracts the key terms, scores the risky clauses, and lets you route the contract to a legal team as a matter. A dashboard shows which contracts need attention and which deadlines are coming up.

## What it does

The Overview page (`/`) explains the problem and walks a viewer through a guided demo that tracks their progress. Contract Intake (`/intake`) takes a PDF or DOCX up to 25 MB, or runs a demo contract. Each analysis has an executive summary, risk findings with clause references and recommended actions, 23 extracted terms, and a next step for routing. Create Matter makes a simulated CLM record. The dashboard (`/dashboard`) lists contracts that need review, upcoming notice and renewal dates, and risk scores across all contracts.

Five sample contracts with written analyses are built in, so the app is usable without an API key. A sample PDF with deliberately risky clauses is at `public/samples/Sample_Software_Services_Agreement.pdf` and is linked from the intake page.

## Stack

Next.js 14 (App Router), TypeScript, Zod, Tailwind CSS 4, `pdf-parse` and `mammoth` for text extraction, Chart.js, and smoothui components installed through the shadcn registry.

## Setup

```bash
npm install
echo "KIMI_API_KEY=your_key_here" > .env.local
npm run dev
```

Then open http://localhost:3000.

## Configuration

| Variable | Required | Default |
|---|---|---|
| `KIMI_API_KEY` | Yes, for live analysis | none |
| `KIMI_MODEL` | No | `kimi-k3` |
| `KIMI_TEMPERATURE` | No | `1` (the only value Kimi K3 accepts) |
| `KIMI_BASE_URL` | No | `https://api.moonshot.ai/v1` |

Without `KIMI_API_KEY`, the sample contracts and the demo still work. A real upload returns an error that says AI analysis is not configured; it never falls back to sample data silently.

## Deploying to Vercel

Import the repository in Vercel, set `KIMI_API_KEY` under Project Settings, Environment Variables, and deploy. No special build settings are needed. API routes run on the Node.js runtime.

## Project layout

```
app/
  page.tsx                Overview and guided demo
  intake/                 Upload and demo entry point
  analysis/[id]/          Analysis with five tabs and the next step
  dashboard/              Review queue, deadlines, risk by contract
  contracts/  matters/    Lists, with search and a risk filter
  api/analyze/            POST: file, extract, AI, Zod, JSON
  api/matter/             POST: simulated CLM matter
components/
  ui/                     Wrappers around the smoothui components
  smoothui/               Vendored smoothui components (edits are commented)
  layout/ intake/ analysis/ dashboard/ contracts/
lib/
  kimi.ts                 AI client (server only)
  storage.ts              Session storage for results, history and matters
  portfolio.ts            Review queue and deadlines for the dashboard
  seed.ts                 The five sample contracts
  tour.ts                 Guided demo progress
design-system/nuvei-legal/MASTER.md   Colours, type, spacing and component rules
```

## Icons

Icons come from Material Symbols Outlined, self-hosted as a 5 KB subset that contains only the icons the app uses (`public/fonts/material-symbols-subset.woff2`, with the list in `material-symbols-subset.json`). After adding a new `<Icon name="...">`, run `npm run icons` to rebuild the subset.

## Claude Code skills

`.claude/skills` holds three project skills: `components` (where to source UI components), `ui-ux-pro-max` (design system and UX rules), and `humanizer` (removing AI writing patterns from copy).

## Security

The API key lives only in the server environment. No client component imports it, and it never appears in API responses or logs. Documents are processed in memory and never written to disk. Provider errors are logged on the server and replaced with a plain message before they reach the browser. The interface does not name the AI provider or model.

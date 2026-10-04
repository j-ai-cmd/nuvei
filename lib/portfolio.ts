import { AnalysisResult, HistoryEntry, RiskItem } from "@/types/contract";
import { getHistory, getMatters, getResult } from "@/lib/storage";

const SEVERITY_ORDER: Record<RiskItem["severity"], number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
const DAY = 86400000;

export interface QueueItem {
  entry: HistoryEntry;
  topFinding: RiskItem | null;
  findingCount: number;
}

export interface Deadline {
  contractId: string;
  filename: string;
  label: string;
  date: Date;
  daysAway: number;
}

export interface Portfolio {
  entries: HistoryEntry[];
  queue: QueueItem[];
  deadlines: Deadline[];
  highRisk: number;
  openMatters: number;
}

// "July 15, 2026 (180 days before …)" -> Date; null when no parseable date
function parseDate(text: string | null): Date | null {
  if (!text) return null;
  const head = text.split("(")[0].trim();
  const t = Date.parse(head);
  return Number.isNaN(t) ? null : new Date(t);
}

export function buildPortfolio(now = Date.now()): Portfolio {
  const entries = getHistory();
  const matters = getMatters();
  const withMatter = new Set(matters.map((m) => m.analysisId));
  const results = new Map<string, AnalysisResult>();
  for (const e of entries) {
    const r = getResult(e.id);
    if (r) results.set(e.id, r);
  }

  // Medium+ risk without a matter, highest score first
  const queue: QueueItem[] = entries
    .filter((e) => e.riskLevel !== "LOW" && !withMatter.has(e.id))
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((entry) => {
      const risks = results.get(entry.id)?.analysis.riskAnalysis.risks ?? [];
      const topFinding = [...risks].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])[0] ?? null;
      return { entry, topFinding, findingCount: risks.length };
    });

  const deadlines: Deadline[] = [];
  for (const e of entries) {
    for (const d of results.get(e.id)?.analysis.keyDates ?? []) {
      // Start/effective dates are facts, not deadlines legal has to act on
      if (/start|effective|signed|execution/i.test(d.label)) continue;
      const date = parseDate(d.date);
      if (!date || date.getTime() < now) continue;
      deadlines.push({
        contractId: e.id,
        filename: e.filename,
        label: d.label,
        date,
        daysAway: Math.ceil((date.getTime() - now) / DAY),
      });
    }
  }
  deadlines.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    entries,
    queue,
    deadlines,
    highRisk: entries.filter((e) => e.riskLevel === "HIGH" || e.riskLevel === "CRITICAL").length,
    openMatters: matters.length,
  };
}

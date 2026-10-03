import { AnalysisResult, HistoryEntry, MatterRecord } from "@/types/contract";
import { getSeedHistory, getSeedResult } from "@/lib/seed";

const HISTORY_KEY = "legalai_history";
const MATTERS_KEY = "legalai_matters";
const resultKey = (id: string) => `legalai_result_${id}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable
  }
}

export function getStoredHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(HISTORY_KEY, []);
}

// Live session history merged with seed data, newest first
export function getHistory(): HistoryEntry[] {
  const stored = getStoredHistory();
  const ids = new Set(stored.map((h) => h.id));
  return [...stored, ...getSeedHistory().filter((s) => !ids.has(s.id))].sort(
    (a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
  );
}

export function getResult(id: string): AnalysisResult | null {
  return read<AnalysisResult | null>(resultKey(id), null) ?? getSeedResult(id);
}

export function saveResult(result: AnalysisResult) {
  write(resultKey(result.id), result);
  const entry: HistoryEntry = {
    id: result.id,
    filename: result.filename,
    contractType: result.analysis.metadata.agreementType,
    counterparty: result.analysis.metadata.parties?.[0]?.name ?? null,
    riskLevel: result.analysis.riskAnalysis.riskLevel,
    riskScore: result.analysis.riskAnalysis.overallRiskScore,
    isDemo: result.isDemo,
    analyzedAt: result.analyzedAt,
    processingTimeMs: result.processingTimeMs,
  };
  write(HISTORY_KEY, [entry, ...getStoredHistory()].slice(0, 50));
}

export function getMatters(): MatterRecord[] {
  return read<MatterRecord[]>(MATTERS_KEY, []);
}

export function saveMatter(matter: MatterRecord) {
  write(MATTERS_KEY, [matter, ...getMatters()].slice(0, 50));
}

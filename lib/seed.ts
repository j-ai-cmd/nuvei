import { AnalysisResult, ContractAnalysis, HistoryEntry, RiskLevel } from "@/types/contract";
import { DEMO_ANALYSIS } from "@/lib/demo-analysis";

interface SeedSpec {
  id: string;
  filename: string;
  contractType: string;
  counterparty: string;
  riskLevel: RiskLevel;
  riskScore: number;
  ageMs: number;
  processingTimeMs: number;
  summary: string;
}

const HOUR = 3600000;
const DAY = 24 * HOUR;

const SPECS: SeedSpec[] = [
  { id: "seed-1", filename: "MSA_TechCorp_Final.pdf", contractType: "Master Services Agreement", counterparty: "TechCorp Global", riskLevel: "HIGH", riskScore: 82, ageMs: 2 * HOUR, processingTimeMs: 4200,
    summary: "Master Services Agreement with TechCorp Global. Uncapped IP indemnity and a long auto-renewal notice window drive a high risk rating; negotiation recommended before execution." },
  { id: "seed-2", filename: "Vendor_Agreement_SupplyCo.pdf", contractType: "Vendor Agreement", counterparty: "SupplyCo Ltd", riskLevel: "MEDIUM", riskScore: 54, ageMs: DAY, processingTimeMs: 3800,
    summary: "Vendor Agreement with SupplyCo Ltd. Commercial terms are broadly standard; liability cap and data protection exhibits need confirmation." },
  { id: "seed-3", filename: "NDA_Project_Phoenix.docx", contractType: "Non-Disclosure Agreement", counterparty: "Innovate LLC", riskLevel: "LOW", riskScore: 18, ageMs: 2 * DAY, processingTimeMs: 2900,
    summary: "Mutual Non-Disclosure Agreement with Innovate LLC. Market-standard confidentiality terms with no material concerns identified." },
  { id: "seed-4", filename: "SaaS_LicenseAgreement.pdf", contractType: "SaaS License Agreement", counterparty: "CloudSoft Inc.", riskLevel: "MEDIUM", riskScore: 61, ageMs: 3 * DAY, processingTimeMs: 5100,
    summary: "SaaS License Agreement with CloudSoft Inc. Auto-renewal and limited SLA remedies warrant review; data processing terms are adequate." },
  { id: "seed-5", filename: "Employment_Contract_Senior.pdf", contractType: "Employment Agreement", counterparty: "Internal HR", riskLevel: "LOW", riskScore: 22, ageMs: 5 * DAY, processingTimeMs: 3200,
    summary: "Senior employment agreement. Standard restrictive covenants and notice terms; no material concerns identified." },
];

// Computed per call so relative timestamps stay fresh
export function getSeedHistory(): HistoryEntry[] {
  const now = Date.now();
  return SPECS.map((s) => ({
    id: s.id,
    filename: s.filename,
    contractType: s.contractType,
    counterparty: s.counterparty,
    riskLevel: s.riskLevel,
    riskScore: s.riskScore,
    isDemo: false,
    analyzedAt: new Date(now - s.ageMs).toISOString(),
    processingTimeMs: s.processingTimeMs,
  }));
}

// Builds a full sample analysis for a seed contract so seed rows can be opened
export function getSeedResult(id: string): AnalysisResult | null {
  const s = SPECS.find((x) => x.id === id);
  if (!s) return null;
  const risks = DEMO_ANALYSIS.riskAnalysis.risks.slice(0, s.riskLevel === "LOW" ? 2 : s.riskLevel === "MEDIUM" ? 4 : 7);
  const analysis: ContractAnalysis = {
    ...DEMO_ANALYSIS,
    metadata: {
      ...DEMO_ANALYSIS.metadata,
      contractTitle: `${s.contractType} — ${s.counterparty}`,
      agreementType: s.contractType,
      parties: [
        { name: s.counterparty, role: "Counterparty" },
        { name: "Nuvei", role: "Client" },
      ],
    },
    riskAnalysis: { overallRiskScore: s.riskScore, riskLevel: s.riskLevel, risks },
    executiveSummary: s.summary,
    top3Risks: risks.slice(0, 3),
  };
  return {
    id: s.id,
    filename: s.filename,
    analysis,
    isDemo: true,
    processingTimeMs: s.processingTimeMs,
    analyzedAt: new Date(Date.now() - s.ageMs).toISOString(),
  };
}

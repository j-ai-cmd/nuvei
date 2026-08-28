import { z } from "zod";

export const SeveritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const RiskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const RiskItemSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  severity: SeveritySchema,
  explanation: z.string(),
  clause: z.string().nullable(),
  recommendedAction: z.string(),
});
export type RiskItem = z.infer<typeof RiskItemSchema>;

export const PartySchema = z.object({
  name: z.string().nullable(),
  role: z.string().nullable(),
});
export type Party = z.infer<typeof PartySchema>;

export const ContractMetadataSchema = z.object({
  contractTitle: z.string().nullable(),
  agreementType: z.string().nullable(),
  parties: z.array(PartySchema).nullable(),
  effectiveDate: z.string().nullable(),
  expirationDate: z.string().nullable(),
  renewalTerms: z.string().nullable(),
  noticePeriod: z.string().nullable(),
  governingLaw: z.string().nullable(),
  jurisdiction: z.string().nullable(),
  contractValue: z.string().nullable(),
  currency: z.string().nullable(),
  paymentTerms: z.string().nullable(),
  fees: z.string().nullable(),
  terminationTerms: z.string().nullable(),
  liabilityCap: z.string().nullable(),
  indemnification: z.string().nullable(),
  confidentiality: z.string().nullable(),
  ipOwnership: z.string().nullable(),
  privacyDataProtection: z.string().nullable(),
  securityObligations: z.string().nullable(),
  auditRights: z.string().nullable(),
  assignment: z.string().nullable(),
  disputeResolution: z.string().nullable(),
});
export type ContractMetadata = z.infer<typeof ContractMetadataSchema>;

export const RiskAnalysisSchema = z.object({
  overallRiskScore: z.number().min(0).max(100),
  riskLevel: RiskLevelSchema,
  risks: z.array(RiskItemSchema),
});
export type RiskAnalysis = z.infer<typeof RiskAnalysisSchema>;

export const ContractAnalysisSchema = z.object({
  metadata: ContractMetadataSchema,
  riskAnalysis: RiskAnalysisSchema,
  executiveSummary: z.string().default(""),
  keyObligations: z.array(z.string()).default([]),
  keyDates: z
    .array(z.object({ label: z.string(), date: z.string().nullable() }))
    .default([]),
  top3Risks: z.array(RiskItemSchema).default([]),
  missingInformation: z.array(z.string()).default([]),
  unusualClauses: z.array(z.string()).default([]),
  recommendedLegalRouting: z.string().default(""),
  disclaimer: z.string().default(
    "This is AI-assisted analysis for informational purposes only and does not constitute legal advice."
  ),
});
export type ContractAnalysis = z.infer<typeof ContractAnalysisSchema>;

export interface AnalysisResult {
  id: string;
  filename: string;
  analysis: ContractAnalysis;
  isDemo: boolean;
  processingTimeMs: number;
  analyzedAt: string;
}

export interface MatterRecord {
  matterId: string;
  contractType: string;
  counterparty: string;
  riskLevel: string;
  riskScore?: number;
  assignedTeam: string;
  status: string;
  createdAt: string;
  filename?: string;
  contractTitle?: string;
  analysisId?: string;
}

export interface HistoryEntry {
  id: string;
  filename: string;
  contractType: string | null;
  counterparty: string | null;
  riskLevel: string;
  riskScore: number;
  isDemo: boolean;
  analyzedAt: string;
  processingTimeMs: number;
}

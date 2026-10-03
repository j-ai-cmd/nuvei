import { AnalysisResult, ContractAnalysis, HistoryEntry, RiskItem, RiskLevel } from "@/types/contract";

const HOUR = 3600000;
const DAY = 24 * HOUR;

const DISCLAIMER =
  "This is AI-assisted analysis for informational purposes only and does not constitute legal advice. All findings should be reviewed by qualified legal counsel before any action is taken.";

interface SeedSpec {
  id: string;
  filename: string;
  ageMs: number;
  processingTimeMs: number;
  counterparty: string;
  analysis: Omit<ContractAnalysis, "top3Risks" | "disclaimer"> & { riskAnalysis: { riskLevel: RiskLevel } };
}

const meta = (m: Partial<ContractAnalysis["metadata"]>): ContractAnalysis["metadata"] => ({
  contractTitle: null,
  agreementType: null,
  parties: null,
  effectiveDate: null,
  expirationDate: null,
  renewalTerms: null,
  noticePeriod: null,
  governingLaw: null,
  jurisdiction: null,
  contractValue: null,
  currency: null,
  paymentTerms: null,
  fees: null,
  terminationTerms: null,
  liabilityCap: null,
  indemnification: null,
  confidentiality: null,
  ipOwnership: null,
  privacyDataProtection: null,
  securityObligations: null,
  auditRights: null,
  assignment: null,
  disputeResolution: null,
  ...m,
});

const risk = (severity: RiskItem["severity"], title: string, clause: string, explanation: string, recommendedAction: string): RiskItem => ({
  severity,
  title,
  clause,
  explanation,
  recommendedAction,
});

const SPECS: SeedSpec[] = [
  {
    id: "seed-1",
    filename: "MSA_TechCorp_Final.pdf",
    ageMs: 2 * HOUR,
    processingTimeMs: 4200,
    counterparty: "TechCorp Global",
    analysis: {
      metadata: meta({
        contractTitle: "Master Services Agreement — TechCorp Global Inc. & Nuvei",
        agreementType: "Master Services Agreement",
        parties: [
          { name: "TechCorp Global Inc.", role: "Vendor / Service Provider" },
          { name: "Nuvei", role: "Client" },
        ],
        effectiveDate: "March 1, 2026",
        expirationDate: "February 28, 2029 (end of Initial Term)",
        renewalTerms: "Automatic renewal for successive 2-year periods unless 180 days' written notice is given",
        noticePeriod: "180 days for non-renewal; 30 days to cure material breach",
        governingLaw: "State of New York",
        jurisdiction: "State and federal courts in New York County",
        contractValue: "$1,200,000 per annum",
        currency: "USD",
        paymentTerms: "Net 30; 1.5% monthly late fee",
        fees: "$100,000 monthly retainer; change requests at $275/hour",
        terminationTerms: "For cause on 30 days' uncured breach; for convenience by Vendor only on 90 days' notice",
        liabilityCap: "12 months' fees — carve-out: Client indemnity obligations are UNLIMITED",
        indemnification: "Client indemnifies Vendor for all third-party claims arising from Client data, without cap",
        confidentiality: "3 years post-termination",
        ipOwnership: "Vendor retains ownership of all Deliverables; Client receives a non-exclusive licence",
        privacyDataProtection: "DPA referenced but not attached",
        securityObligations: "Commercially reasonable measures; no named standard",
        auditRights: "None granted to Client",
        assignment: "Vendor may assign freely; Client requires consent",
        disputeResolution: "Litigation in New York courts; jury waiver",
      }),
      riskAnalysis: {
        overallRiskScore: 82,
        riskLevel: "HIGH",
        risks: [
          risk("CRITICAL", "Uncapped Client Indemnity", "Clause 12.2", "Client indemnifies Vendor for all third-party claims relating to Client data with no cap, while Vendor liability is limited to 12 months' fees. Exposure is asymmetric and unbounded.", "Cap Client indemnity at the same 12-month fee level and make it mutual. Escalate to General Counsel."),
          risk("HIGH", "Vendor Owns Deliverables", "Clause 9.1", "All custom work product paid for by Client remains Vendor IP. Client only receives a non-exclusive licence, so the same deliverables may be resold to competitors.", "Require assignment of custom deliverables on payment, with Vendor keeping only pre-existing IP."),
          risk("HIGH", "Termination for Convenience is Vendor-Only", "Clause 15.3", "Vendor can exit on 90 days' notice but Client is locked in for the 3-year term, creating continuity risk for a critical service.", "Make termination for convenience mutual, or add a transition-assistance obligation on Vendor exit."),
          risk("MEDIUM", "No Audit Rights", "Clause 11", "Client has no right to audit Vendor security or billing, which conflicts with Nuvei's third-party risk policy for payment-adjacent vendors.", "Add annual audit rights and delivery of SOC 2 Type II reports."),
          risk("MEDIUM", "180-Day Auto-Renewal Notice", "Clause 3.2", "Renewal notice must be given six months before term end, which is easy to miss.", "Diary the notice deadline and negotiate down to 90 days."),
          risk("LOW", "High Late-Payment Fee", "Clause 6.4", "1.5% per month (18% per year) late fee is above market.", "Negotiate to 1% per month or statutory rate."),
        ],
      },
      executiveSummary:
        "A three-year MSA with TechCorp Global worth $1.2M per year. Commercial terms are standard, but the risk allocation is heavily vendor-favoured: Client carries uncapped indemnity, Vendor keeps ownership of paid-for deliverables, and only Vendor may terminate for convenience. These three points should be negotiated before signature.",
      keyObligations: [
        "Client pays a $100,000 monthly retainer, Net 30",
        "Client gives 180 days' written notice to stop auto-renewal",
        "Vendor delivers services per each executed Statement of Work",
        "Vendor maintains commercially reasonable security measures",
        "Both parties keep Confidential Information secret for 3 years post-termination",
      ],
      keyDates: [
        { label: "Effective Date", date: "March 1, 2026" },
        { label: "Renewal Notice Deadline", date: "September 1, 2028" },
        { label: "Initial Term End", date: "February 28, 2029" },
      ],
      missingInformation: ["Data Processing Agreement — referenced but not attached", "Service levels and service credits", "Named security standard (e.g. SOC 2, ISO 27001)"],
      unusualClauses: [
        "Clause 12.2: uncapped indemnity running only from Client to Vendor",
        "Clause 9.1: Vendor ownership of custom deliverables paid for by Client",
      ],
      recommendedLegalRouting: "Legal — Commercial (indemnity, IP) → Information Security (audit rights, DPA) → General Counsel sign-off",
    },
  },
  {
    id: "seed-2",
    filename: "Vendor_Agreement_SupplyCo.pdf",
    ageMs: DAY,
    processingTimeMs: 3800,
    counterparty: "SupplyCo Ltd",
    analysis: {
      metadata: meta({
        contractTitle: "Vendor Supply Agreement — SupplyCo Ltd",
        agreementType: "Vendor Agreement",
        parties: [
          { name: "SupplyCo Ltd", role: "Vendor" },
          { name: "Nuvei", role: "Customer" },
        ],
        effectiveDate: "January 15, 2026",
        expirationDate: "January 14, 2028",
        renewalTerms: "Renews annually unless either party gives 60 days' notice",
        noticePeriod: "60 days",
        governingLaw: "England and Wales",
        jurisdiction: "Courts of England and Wales",
        contractValue: "£380,000 over the term",
        currency: "GBP",
        paymentTerms: "Net 45 from invoice",
        fees: "Per unit pricing per Schedule 2",
        terminationTerms: "Either party on 60 days' notice; immediately for insolvency",
        liabilityCap: "100% of fees paid in the prior 12 months",
        indemnification: "Mutual, for breach and negligence",
        confidentiality: "5 years post-termination",
        ipOwnership: "No IP transfer",
        privacyDataProtection: "Limited personal data; UK GDPR clauses present",
        securityObligations: "ISO 27001 certification maintained",
        auditRights: "Once per year on 30 days' notice",
        assignment: "Mutual consent required",
        disputeResolution: "Escalation then courts of England and Wales",
      }),
      riskAnalysis: {
        overallRiskScore: 54,
        riskLevel: "MEDIUM",
        risks: [
          risk("HIGH", "Price Increase Without Cap", "Clause 5.3", "Vendor may raise unit prices annually with 30 days' notice and no ceiling.", "Cap annual increases at CPI or 5%, whichever is lower."),
          risk("MEDIUM", "Liability Cap May Be Too Low", "Clause 14.1", "Cap of 12 months' fees (~£190k) may not cover losses from supply interruption.", "Raise to 2x annual fees or carve out supply-failure losses."),
          risk("MEDIUM", "No Service Credits", "Schedule 3", "Delivery SLAs are defined but there is no remedy for missing them.", "Add service credits for late or short deliveries."),
          risk("LOW", "Long Payment Terms Favour Customer", "Clause 6.1", "Net 45 is favourable to Nuvei; no action needed.", "Accept as drafted."),
        ],
      },
      executiveSummary:
        "A two-year supply agreement with SupplyCo worth about £380,000. Terms are broadly balanced, with mutual indemnities and ISO 27001 coverage. The main concerns are uncapped annual price increases and the lack of remedies for missed delivery SLAs.",
      keyObligations: [
        "Vendor delivers per purchase orders within 10 business days",
        "Customer pays invoices within 45 days",
        "Vendor maintains ISO 27001 certification",
        "Either party gives 60 days' notice to prevent annual renewal",
      ],
      keyDates: [
        { label: "Effective Date", date: "January 15, 2026" },
        { label: "Renewal Notice Deadline", date: "November 15, 2027" },
        { label: "Term End", date: "January 14, 2028" },
      ],
      missingInformation: ["Schedule 2 pricing table is unsigned"],
      unusualClauses: ["Clause 5.3: unilateral uncapped price increases"],
      recommendedLegalRouting: "Procurement (pricing, SLAs) → Legal — Commercial review",
    },
  },
  {
    id: "seed-3",
    filename: "NDA_Project_Phoenix.docx",
    ageMs: 2 * DAY,
    processingTimeMs: 2900,
    counterparty: "Innovate LLC",
    analysis: {
      metadata: meta({
        contractTitle: "Mutual Non-Disclosure Agreement — Project Phoenix",
        agreementType: "Non-Disclosure Agreement",
        parties: [
          { name: "Innovate LLC", role: "Counterparty" },
          { name: "Nuvei", role: "Disclosing / Receiving Party" },
        ],
        effectiveDate: "September 30, 2026",
        expirationDate: "September 29, 2028",
        noticePeriod: "30 days to terminate",
        governingLaw: "State of Delaware",
        jurisdiction: "Delaware courts",
        terminationTerms: "Either party on 30 days' written notice",
        confidentiality: "Mutual; 2-year term with obligations surviving 3 years",
        ipOwnership: "No licence granted; each party keeps its own IP",
        assignment: "Not assignable without consent",
        disputeResolution: "Injunctive relief available; Delaware courts",
      }),
      riskAnalysis: {
        overallRiskScore: 18,
        riskLevel: "LOW",
        risks: [
          risk("LOW", "Residuals Clause", "Clause 7", "Information retained in unaided memory may be used by either party. Common in tech NDAs but weakens protection for know-how.", "Accept, or narrow to exclude source code and pricing."),
          risk("LOW", "Short Survival Period", "Clause 9", "Obligations survive 3 years, which may be short for trade secrets.", "Make trade-secret obligations survive for as long as they remain trade secrets."),
        ],
      },
      executiveSummary:
        "A market-standard mutual NDA with Innovate LLC for Project Phoenix. Definitions, exclusions and remedies are balanced. Only minor points on the residuals clause and survival period; fine to sign as drafted if those are acceptable.",
      keyObligations: [
        "Use Confidential Information only to evaluate Project Phoenix",
        "Limit disclosure to need-to-know employees and advisers",
        "Return or destroy materials within 15 days of request",
      ],
      keyDates: [
        { label: "Effective Date", date: "September 30, 2026" },
        { label: "Term End", date: "September 29, 2028" },
        { label: "Obligations Survive Until", date: "September 29, 2031" },
      ],
      missingInformation: [],
      unusualClauses: [],
      recommendedLegalRouting: "Legal — self-serve approval (standard NDA)",
    },
  },
  {
    id: "seed-4",
    filename: "SaaS_LicenseAgreement.pdf",
    ageMs: 3 * DAY,
    processingTimeMs: 5100,
    counterparty: "CloudSoft Inc.",
    analysis: {
      metadata: meta({
        contractTitle: "SaaS Subscription Agreement — CloudSoft Inc.",
        agreementType: "SaaS License Agreement",
        parties: [
          { name: "CloudSoft Inc.", role: "Provider" },
          { name: "Nuvei", role: "Customer" },
        ],
        effectiveDate: "July 1, 2026",
        expirationDate: "June 30, 2027",
        renewalTerms: "Auto-renews for 12 months; price may rise up to 10%",
        noticePeriod: "90 days for non-renewal",
        governingLaw: "State of California",
        jurisdiction: "San Francisco courts",
        contractValue: "$96,000 per year",
        currency: "USD",
        paymentTerms: "Annually in advance",
        fees: "250 seats at $32/seat/month",
        terminationTerms: "For material breach only",
        liabilityCap: "Fees paid in the prior 12 months",
        indemnification: "Provider indemnifies for IP infringement",
        confidentiality: "Mutual",
        ipOwnership: "Customer owns Customer Data",
        privacyDataProtection: "DPA with SCCs attached",
        securityObligations: "SOC 2 Type II; 99.9% uptime SLA",
        auditRights: "SOC 2 report on request",
        assignment: "Either party on change of control",
        disputeResolution: "Courts of San Francisco",
      }),
      riskAnalysis: {
        overallRiskScore: 61,
        riskLevel: "MEDIUM",
        risks: [
          risk("HIGH", "Weak SLA Remedy", "Schedule B", "The only remedy for missing 99.9% uptime is a 5% credit capped at one month, with no termination right for repeated failures.", "Add a termination right after 3 SLA breaches in any 6 months."),
          risk("MEDIUM", "10% Renewal Uplift", "Clause 4.2", "Price may rise up to 10% at each renewal.", "Cap at 5% or CPI."),
          risk("MEDIUM", "Data Return Window", "Clause 13.4", "Customer Data deleted 15 days after termination.", "Extend to 60 days with export in a standard format."),
          risk("LOW", "Change-of-Control Assignment", "Clause 18", "Provider may assign to an acquirer without consent.", "Add a termination right if assigned to a competitor."),
        ],
      },
      executiveSummary:
        "A one-year, 250-seat SaaS subscription with CloudSoft at $96k per year. Security posture is good (SOC 2 Type II, DPA with SCCs). Commercial protections are thin: weak SLA remedies, a 10% renewal uplift and a short data-return window.",
      keyObligations: [
        "Customer pays $96,000 annually in advance",
        "Provider maintains SOC 2 Type II and 99.9% uptime",
        "Customer gives 90 days' notice to stop auto-renewal",
      ],
      keyDates: [
        { label: "Effective Date", date: "July 1, 2026" },
        { label: "Renewal Notice Deadline", date: "April 1, 2027" },
        { label: "Term End", date: "June 30, 2027" },
      ],
      missingInformation: ["Sub-processor list"],
      unusualClauses: ["Schedule B: SLA credits capped at one month with no exit right"],
      recommendedLegalRouting: "IT Procurement (SLA, pricing) → Legal — Commercial → Privacy (sub-processors)",
    },
  },
  {
    id: "seed-5",
    filename: "Employment_Contract_Senior.pdf",
    ageMs: 5 * DAY,
    processingTimeMs: 3200,
    counterparty: "Internal HR",
    analysis: {
      metadata: meta({
        contractTitle: "Employment Agreement — Senior Engineer",
        agreementType: "Employment Agreement",
        parties: [
          { name: "Nuvei", role: "Employer" },
          { name: "Employee (redacted)", role: "Employee" },
        ],
        effectiveDate: "October 13, 2026",
        noticePeriod: "3 months either side",
        governingLaw: "England and Wales",
        jurisdiction: "Employment Tribunal / courts of England and Wales",
        contractValue: "£115,000 base salary",
        currency: "GBP",
        paymentTerms: "Monthly in arrears",
        terminationTerms: "3 months' notice; summary dismissal for gross misconduct",
        confidentiality: "Perpetual for trade secrets",
        ipOwnership: "All work IP assigned to Employer",
        privacyDataProtection: "Employee privacy notice incorporated",
      }),
      riskAnalysis: {
        overallRiskScore: 22,
        riskLevel: "LOW",
        risks: [
          risk("MEDIUM", "12-Month Non-Compete", "Clause 19.1", "A 12-month post-termination non-compete may be unenforceable as wider than necessary.", "Reduce to 6 months and limit to named competitors."),
          risk("LOW", "Missing Garden Leave Clause", "Clause 17", "No express right to place the employee on garden leave during notice.", "Add a garden leave clause."),
        ],
      },
      executiveSummary:
        "A standard senior employment agreement on Nuvei's template. IP assignment and confidentiality are robust. The 12-month non-compete is longer than usually enforceable, and there is no garden leave clause.",
      keyObligations: [
        "Employee assigns all work-related IP to Nuvei",
        "Either party gives 3 months' notice",
        "Employee observes restrictive covenants after leaving",
      ],
      keyDates: [
        { label: "Start Date", date: "October 13, 2026" },
        { label: "Probation Ends", date: "April 13, 2027" },
      ],
      missingInformation: ["Bonus scheme rules referenced but not attached"],
      unusualClauses: [],
      recommendedLegalRouting: "HR → Employment Counsel (restrictive covenants)",
    },
  },
];

// Computed per call so relative timestamps stay fresh
export function getSeedHistory(): HistoryEntry[] {
  const now = Date.now();
  return SPECS.map((s) => ({
    id: s.id,
    filename: s.filename,
    contractType: s.analysis.metadata.agreementType,
    counterparty: s.counterparty,
    riskLevel: s.analysis.riskAnalysis.riskLevel,
    riskScore: s.analysis.riskAnalysis.overallRiskScore,
    isDemo: false,
    analyzedAt: new Date(now - s.ageMs).toISOString(),
    processingTimeMs: s.processingTimeMs,
  }));
}

// Full sample analysis for a seed contract so seed rows can be opened
export function getSeedResult(id: string): AnalysisResult | null {
  const s = SPECS.find((x) => x.id === id);
  if (!s) return null;
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const top3Risks = [...s.analysis.riskAnalysis.risks].sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 3);
  return {
    id: s.id,
    filename: s.filename,
    analysis: { ...s.analysis, top3Risks, disclaimer: DISCLAIMER },
    isDemo: true,
    processingTimeMs: s.processingTimeMs,
    analyzedAt: new Date(Date.now() - s.ageMs).toISOString(),
  };
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnalysisResult, MatterRecord } from "@/types/contract";
import RiskScoreCard from "@/components/analysis/RiskScoreCard";
import RiskCard from "@/components/analysis/RiskCard";
import KeyTermsGrid from "@/components/analysis/KeyTermsGrid";
import AISummaryPanel from "@/components/analysis/AISummaryPanel";
import MatterModal from "@/components/analysis/MatterModal";
import { getMatters, getResult, saveMatter } from "@/lib/storage";
import { isHighRisk } from "@/lib/format";
import { Accordion, Button, EmptyState, LinkButton, Icon, Panel, Spinner, Tabs, useToast } from "@/components/ui";

type Tab = "overview" | "risk" | "terms" | "ai-review" | "matter";

function DemoBanner() {

  return (
    <div className="mb-6 px-4 py-3 bg-surface-container border border-outline-variant/60 rounded-lg flex items-center gap-3">
      <Icon name="science" className="text-on-surface-variant text-[20px]" />
      <div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sample Data</span>
        <p className="text-xs text-on-surface-variant">
          Sample analysis, pre-computed for demonstration. Upload a contract to run a live AI review.
        </p>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [matter, setMatter] = useState<MatterRecord | null>(null);
  const [creatingMatter, setCreatingMatter] = useState(false);
  const [existingMatter, setExistingMatter] = useState<MatterRecord | null>(null);
  const toast = useToast();

  useEffect(() => {
    const found = getResult(id);
    if (found) setResult(found);
    else setNotFound(true);
    setExistingMatter(getMatters().find((m) => m.analysisId === id) ?? null);
  }, [id]);

  function handleExportReport() {
    if (!result) return;
    const { analysis, filename, isDemo, analyzedAt, processingTimeMs } = result;
    const lines: string[] = [
      "NUVEI LEGAL DASHBOARD — AI CONTRACT ANALYSIS REPORT",
      "=".repeat(60),
      `File: ${filename}`,
      `Analyzed: ${new Date(analyzedAt).toLocaleString()}`,
      `Processing time: ${(processingTimeMs / 1000).toFixed(1)}s`,
      isDemo ? "⚠ DEMO DATA — pre-computed analysis" : "",
      "",
      "CONTRACT METADATA",
      "-".repeat(40),
      `Title: ${analysis.metadata.contractTitle ?? "—"}`,
      `Type: ${analysis.metadata.agreementType ?? "—"}`,
      `Parties: ${analysis.metadata.parties?.map((p) => `${p.name} (${p.role})`).join(", ") ?? "—"}`,
      `Effective Date: ${analysis.metadata.effectiveDate ?? "—"}`,
      `Expiration: ${analysis.metadata.expirationDate ?? "—"}`,
      `Governing Law: ${analysis.metadata.governingLaw ?? "—"}`,
      `Jurisdiction: ${analysis.metadata.jurisdiction ?? "—"}`,
      `Contract Value: ${analysis.metadata.contractValue ?? "—"} ${analysis.metadata.currency ?? ""}`.trim(),
      `Payment Terms: ${analysis.metadata.paymentTerms ?? "—"}`,
      `Termination: ${analysis.metadata.terminationTerms ?? "—"}`,
      `Liability Cap: ${analysis.metadata.liabilityCap ?? "—"}`,
      `Confidentiality: ${analysis.metadata.confidentiality ?? "—"}`,
      `IP Ownership: ${analysis.metadata.ipOwnership ?? "—"}`,
      `Dispute Resolution: ${analysis.metadata.disputeResolution ?? "—"}`,
      "",
      "RISK ANALYSIS",
      "-".repeat(40),
      `Overall Score: ${analysis.riskAnalysis.overallRiskScore}/100`,
      `Risk Level: ${analysis.riskAnalysis.riskLevel}`,
      "",
      `Findings (${analysis.riskAnalysis.risks.length}):`,
      ...analysis.riskAnalysis.risks.map(
        (r, i) => `  ${i + 1}. [${r.severity}] ${r.title}\n     ${r.explanation}\n     Clause: ${r.clause ?? "Not specified"}\n     Action: ${r.recommendedAction}`
      ),
      "",
      "EXECUTIVE SUMMARY",
      "-".repeat(40),
      analysis.executiveSummary,
      "",
      "KEY OBLIGATIONS",
      "-".repeat(40),
      ...analysis.keyObligations.map((o, i) => `  ${i + 1}. ${o}`),
      "",
      "MISSING INFORMATION",
      "-".repeat(40),
      analysis.missingInformation.length > 0 ? analysis.missingInformation.map((m) => `  • ${m}`).join("\n") : "  None identified.",
      "",
      "UNUSUAL CLAUSES",
      "-".repeat(40),
      analysis.unusualClauses.length > 0 ? analysis.unusualClauses.map((c) => `  • ${c}`).join("\n") : "  None identified.",
      "",
      "RECOMMENDED ROUTING",
      "-".repeat(40),
      analysis.recommendedLegalRouting,
      "",
      "=".repeat(60),
      analysis.disclaimer,
    ];
    const text = lines.filter((l) => l !== null && l !== undefined).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, "")}_analysis_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Report downloaded", "success");
  }

  async function handleCreateMatter() {
    if (!result) return;
    setCreatingMatter(true);
    try {
      const res = await fetch("/api/matter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractType: result.analysis.metadata.agreementType,
          counterparty: result.analysis.metadata.parties?.[0]?.name ?? "Unknown",
          riskLevel: result.analysis.riskAnalysis.riskLevel,
        }),
      });
      const data: MatterRecord = await res.json();
      // Augment with client-side context and persist to session Matters
      const enriched: MatterRecord = {
        ...data,
        filename: result.filename,
        contractTitle: result.analysis.metadata.contractTitle ?? undefined,
        riskScore: result.analysis.riskAnalysis.overallRiskScore,
        analysisId: result.id,
      };
      saveMatter(enriched);
      setExistingMatter(enriched);
      setMatter(enriched);
      toast(`Matter ${enriched.matterId} created`, "success");
    } catch {
      toast("Failed to create matter. Please try again.", "error");
    } finally {
      setCreatingMatter(false);
    }
  }

  if (notFound) {
    return (
      <EmptyState
        icon="search_off"
        title="Analysis not found"
        message="This session has expired or the analysis was not stored. Please upload a new contract."
        cta={{ href: "/", label: "New Intake" }}
      />
    );
  }

  if (!result) return <Spinner label="Loading analysis..." />;

  const { analysis, filename, isDemo } = result;
  const { metadata, riskAnalysis, executiveSummary, keyObligations, keyDates } = analysis;

  const counterparty =
    metadata.parties?.find((p) => p.role?.toLowerCase().includes("vendor") || p.role?.toLowerCase().includes("counterparty"))?.name ??
    metadata.parties?.[0]?.name ??
    "Unknown";

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "risk", label: "Risk Analysis" },
    { id: "terms", label: "Key Terms" },
    { id: "ai-review", label: "AI Review" },
    { id: "matter", label: "Matter Record" },
  ];

  return (
    <>
      {matter && <MatterModal matter={matter} onClose={() => setMatter(null)} />}

      {/* Context Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="min-w-0 w-full md:w-auto">
          <Link href="/contracts" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors mb-2 text-sm">
            <Icon name="arrow_back" className="text-[18px] mr-1" />
            Back to Contracts
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight line-clamp-2 max-w-3xl break-words">
            {metadata.contractTitle ?? filename}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
          <Button variant="secondary" icon="download" onClick={handleExportReport} className="flex-1 md:flex-none">
            Export Report
          </Button>
          {existingMatter ? (
            <LinkButton href="/matters" variant="secondary" icon="work" className="flex-1 md:flex-none">
              Matter {existingMatter.matterId}
            </LinkButton>
          ) : (
            <Button variant="danger" icon="add_circle" onClick={handleCreateMatter} disabled={creatingMatter} className="flex-1 md:flex-none">
              {creatingMatter ? "Creating..." : "Create Matter"}
            </Button>
          )}
        </div>
      </div>

      {isDemo && <DemoBanner />}

      {/* Metadata Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 mb-8 flex flex-wrap gap-x-8 gap-y-4 items-center">
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Type</span>
          <p className="text-base font-bold text-primary mt-1">{metadata.agreementType ?? "Unknown"}</p>
        </div>
        <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Counterparty</span>
          <p className="text-base font-bold text-primary mt-1">{counterparty}</p>
        </div>
        <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Effective Date</span>
          <p className="text-base font-bold text-primary mt-1 flex items-center gap-1">
            <Icon name="calendar_today" className="text-[16px] text-on-surface-variant" />
            {metadata.effectiveDate ?? "Not specified"}
          </p>
        </div>
        <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Risk Level</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${isHighRisk(riskAnalysis.riskLevel) ? "bg-secondary" : "bg-primary-container"}`} />
            <span className={`text-base font-bold ${isHighRisk(riskAnalysis.riskLevel) ? "text-secondary" : "text-primary-container"}`}>
              {riskAnalysis.riskLevel}
            </span>
          </div>
        </div>
        <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Processing Time</span>
          <p className="text-base font-bold text-primary mt-1">{(result.processingTimeMs / 1000).toFixed(1)}s</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Disclaimer */}
      <div className="mb-6 p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm text-xs text-on-surface-variant">
        <strong>Disclaimer:</strong> {analysis.disclaimer}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Panel title="Executive Summary">
                <p className="text-sm text-on-surface-variant leading-relaxed">{executiveSummary}</p>
              </Panel>

              {keyObligations.length > 0 && (
                <Panel title="Key Obligations">
                  <ul className="space-y-2">
                    {keyObligations.map((o, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}

              {keyDates.length > 0 && (
                <Panel title="Key Dates">
                  <div className="space-y-3">
                    {keyDates.map((d, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
                        <span className="text-sm font-semibold text-primary">{d.label}</span>
                        <span className="text-sm text-on-surface-variant">{d.date ?? "Not specified"}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
            </div>
          )}

          {activeTab === "risk" && (
            <div className="space-y-6">
              <RiskScoreCard score={riskAnalysis.overallRiskScore} riskLevel={riskAnalysis.riskLevel} />
              <h3 className="text-xl font-bold text-primary">All Findings ({riskAnalysis.risks.length})</h3>
              <Accordion
                defaultExpandedIds={[0]}
                items={riskAnalysis.risks.map((r, i) => ({
                  id: i,
                  title: `${r.severity} · ${r.title}`,
                  content: <RiskCard risk={r} />,
                }))}
              />
            </div>
          )}

          {activeTab === "terms" && (
            <KeyTermsGrid metadata={metadata} />
          )}

          {activeTab === "ai-review" && (
            <div className="space-y-6">
              <Panel title="Full Executive Summary">
                <p className="text-sm text-on-surface-variant leading-relaxed">{executiveSummary}</p>
              </Panel>
              {analysis.missingInformation.length > 0 && (
                <Panel title="Missing Information">
                  <ul className="space-y-2">
                    {analysis.missingInformation.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <Icon name="error_outline" className="text-secondary text-[16px] mt-0.5" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </div>
          )}

          {activeTab === "matter" && (
            <Panel>
              <h3 className="text-xl font-bold text-primary mb-2">Create Matter Record</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                This will create a simulated CLM matter record based on the AI analysis. In a production
                environment, this would integrate with your Contract Lifecycle Management system (e.g. Clio,
                Ironclad, DocuSign CLM).
              </p>
              <div className="space-y-3 mb-8">
                {[
                  ["Contract Type", metadata.agreementType ?? "Unknown"],
                  ["Counterparty", counterparty],
                  ["Risk Level", riskAnalysis.riskLevel],
                  ["Recommended Routing", analysis.recommendedLegalRouting],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-outline-variant/50 pb-3">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
                    <span className="text-sm font-semibold text-primary text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
              {existingMatter ? (
                <LinkButton href="/matters" variant="secondary" icon="work" className="w-full">
                  View Matter {existingMatter.matterId}
                </LinkButton>
              ) : (
                <Button variant="danger" icon="add_circle" onClick={handleCreateMatter} disabled={creatingMatter} className="w-full">
                  {creatingMatter ? "Creating Matter..." : "Create Matter (Simulated)"}
                </Button>
              )}
              <p className="text-xs text-center text-on-surface-variant/60 mt-3">
                DEMONSTRATION · MOCK CLM INTEGRATION · Saved to session Matters
              </p>
            </Panel>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4">
          <AISummaryPanel analysis={analysis} />
        </div>
      </div>
    </>
  );
}

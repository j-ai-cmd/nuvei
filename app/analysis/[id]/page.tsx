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

type Tab = "overview" | "risk" | "terms" | "ai-review" | "matter";

function DemoBanner() {

  return (
    <div className="mb-6 px-4 py-3 bg-surface-container border border-outline-variant/20 rounded-lg flex items-center gap-3">
      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">science</span>
      <div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Demo Data</span>
        <p className="text-xs text-on-surface-variant">
          This analysis uses pre-computed demonstration data. Connect an AI API key to analyze real contracts.
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

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`legalai_result_${id}`);
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [id]);

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
      setMatter(data);
    } catch {
      alert("Failed to create matter. Please try again.");
    } finally {
      setCreatingMatter(false);
    }
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Analysis not found</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          This session has expired or the analysis was not stored. Please upload a new contract.
        </p>
        <Link href="/" className="bg-primary text-white px-6 py-3 rounded text-xs font-bold tracking-wider uppercase hover:bg-primary/90 transition-colors">
          New Intake
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin-slow" />
          <p className="text-sm text-on-surface-variant">Loading analysis...</p>
        </div>
      </div>
    );
  }

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
        <div>
          <Link href="/" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors mb-2 text-sm">
            <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
            Back to Intake
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight truncate max-w-2xl">
            {metadata.contractTitle ?? filename}
          </h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 rounded text-xs font-bold tracking-wider uppercase bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/10">
            Export Report
          </button>
          <button
            onClick={handleCreateMatter}
            disabled={creatingMatter}
            className="flex-1 md:flex-none px-6 py-2.5 rounded text-xs font-bold tracking-wider uppercase bg-secondary text-white hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            {creatingMatter ? "Creating..." : "Create Matter"}
          </button>
        </div>
      </div>

      {isDemo && <DemoBanner />}

      {/* Metadata Bar */}
      <div className="bg-white border border-outline-variant/10 rounded-lg p-4 mb-8 flex flex-wrap gap-x-8 gap-y-4 items-center shadow-sm">
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
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span>
            {metadata.effectiveDate ?? "Not specified"}
          </p>
        </div>
        <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Risk Level</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${
              riskAnalysis.riskLevel === "HIGH" || riskAnalysis.riskLevel === "CRITICAL" ? "bg-secondary" : "bg-primary-container"
            }`} />
            <span className={`text-base font-bold ${
              riskAnalysis.riskLevel === "HIGH" || riskAnalysis.riskLevel === "CRITICAL" ? "text-secondary" : "text-primary-container"
            }`}>
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
      <nav className="flex border-b border-outline-variant/20 overflow-x-auto mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-secondary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Disclaimer */}
      <div className="mb-6 p-3 bg-surface-container-low border border-outline-variant/10 rounded text-xs text-on-surface-variant">
        <strong>Disclaimer:</strong> {analysis.disclaimer}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Executive Summary</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{executiveSummary}</p>
              </div>

              {keyObligations.length > 0 && (
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Key Obligations</h3>
                  <ul className="space-y-2">
                    {keyObligations.map((o, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {keyDates.length > 0 && (
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Key Dates</h3>
                  <div className="space-y-3">
                    {keyDates.map((d, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
                        <span className="text-sm font-semibold text-primary">{d.label}</span>
                        <span className="text-sm text-on-surface-variant">{d.date ?? "Not specified"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "risk" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RiskScoreCard score={riskAnalysis.overallRiskScore} riskLevel={riskAnalysis.riskLevel} />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">All Findings ({riskAnalysis.risks.length})</h3>
                  {riskAnalysis.risks.slice(0, 3).map((r, i) => (
                    <RiskCard key={i} risk={r} />
                  ))}
                </div>
              </div>
              {riskAnalysis.risks.slice(3).map((r, i) => (
                <RiskCard key={i + 3} risk={r} />
              ))}
            </div>
          )}

          {activeTab === "terms" && (
            <KeyTermsGrid metadata={metadata} />
          )}

          {activeTab === "ai-review" && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Full Executive Summary</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{executiveSummary}</p>
              </div>
              {analysis.missingInformation.length > 0 && (
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Missing Information</h3>
                  <ul className="space-y-2">
                    {analysis.missingInformation.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">error_outline</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "matter" && (
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
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
                  <div key={label} className="flex justify-between border-b border-outline-variant/10 pb-3">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
                    <span className="text-sm font-semibold text-primary text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCreateMatter}
                disabled={creatingMatter}
                className="w-full py-3 bg-secondary text-white text-xs font-bold tracking-wider uppercase rounded hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                {creatingMatter ? "Creating Matter..." : "Create Matter (Simulated)"}
              </button>
              <p className="text-xs text-center text-on-surface-variant/60 mt-3">
                DEMONSTRATION · MOCK CLM INTEGRATION · No data is persisted
              </p>
            </div>
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

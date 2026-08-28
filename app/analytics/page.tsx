"use client";

import { useEffect, useState } from "react";
import { HistoryEntry } from "@/types/contract";
import { VolumeChart, RiskDonut } from "@/components/dashboard/Charts";

const SEED: HistoryEntry[] = [
  { id: "seed-1", filename: "MSA_TechCorp_Final.pdf", contractType: "Master Services Agreement", counterparty: "TechCorp Global", riskLevel: "HIGH", riskScore: 82, isDemo: false, analyzedAt: new Date(Date.now() - 2 * 3600000).toISOString(), processingTimeMs: 4200 },
  { id: "seed-2", filename: "Vendor_Agreement_SupplyCo.pdf", contractType: "Vendor Agreement", counterparty: "SupplyCo Ltd", riskLevel: "MEDIUM", riskScore: 54, isDemo: false, analyzedAt: new Date(Date.now() - 86400000).toISOString(), processingTimeMs: 3800 },
  { id: "seed-3", filename: "NDA_Project_Phoenix.docx", contractType: "Non-Disclosure Agreement", counterparty: "Innovate LLC", riskLevel: "LOW", riskScore: 18, isDemo: false, analyzedAt: new Date(Date.now() - 2 * 86400000).toISOString(), processingTimeMs: 2900 },
  { id: "seed-4", filename: "SaaS_LicenseAgreement.pdf", contractType: "SaaS License Agreement", counterparty: "CloudSoft Inc.", riskLevel: "MEDIUM", riskScore: 61, isDemo: false, analyzedAt: new Date(Date.now() - 3 * 86400000).toISOString(), processingTimeMs: 5100 },
  { id: "seed-5", filename: "Employment_Contract_Senior.pdf", contractType: "Employment Agreement", counterparty: "Internal HR", riskLevel: "LOW", riskScore: 22, isDemo: false, analyzedAt: new Date(Date.now() - 5 * 86400000).toISOString(), processingTimeMs: 3200 },
];

function buildVolume(history: HistoryEntry[]) {
  const days: Record<string, number> = {};
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { weekday: "short" });
    labels.push(key);
    days[key] = 0;
  }
  history.forEach((h) => {
    const key = new Date(h.analyzedAt).toLocaleDateString("en-US", { weekday: "short" });
    if (key in days) days[key]++;
  });
  return { labels, data: labels.map((l) => days[l]) };
}

const TYPE_GROUPS = [
  { label: "MSA", match: (t: string) => t.includes("Master") || t.includes("MSA") },
  { label: "NDA", match: (t: string) => t.includes("Non-Disclosure") || t.includes("NDA") },
  { label: "Vendor", match: (t: string) => t.includes("Vendor") },
  { label: "SaaS", match: (t: string) => t.includes("SaaS") || t.includes("License") },
  { label: "Employment", match: (t: string) => t.includes("Employment") },
  { label: "Other", match: () => true },
];

export default function AnalyticsPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored: HistoryEntry[] = JSON.parse(sessionStorage.getItem("legalai_history") ?? "[]");
      const ids = new Set(stored.map((h) => h.id));
      setHistory([...stored, ...SEED.filter((s) => !ids.has(s.id))]);
    } catch {
      setHistory(SEED);
    }
  }, []);

  const total = history.length;
  const highCount = history.filter((h) => h.riskLevel === "HIGH" || h.riskLevel === "CRITICAL").length;
  const medCount = history.filter((h) => h.riskLevel === "MEDIUM").length;
  const lowCount = history.filter((h) => h.riskLevel === "LOW").length;
  const avgScore = total > 0 ? Math.round(history.reduce((s, h) => s + h.riskScore, 0) / total) : 0;
  const avgMs = total > 0 ? history.reduce((s, h) => s + h.processingTimeMs, 0) / total : 0;
  const volume = buildVolume(history);

  const typeBreakdown = TYPE_GROUPS.map(({ label, match }) => {
    const items = history.filter((h) => h.contractType && match(h.contractType));
    return { label, count: items.length, avg: items.length > 0 ? Math.round(items.reduce((s, h) => s + h.riskScore, 0) / items.length) : 0 };
  }).filter((g) => g.count > 0);

  const scoreDistribution = [
    { label: "0–25 (Low)", count: history.filter((h) => h.riskScore <= 25).length },
    { label: "26–50 (Moderate)", count: history.filter((h) => h.riskScore > 25 && h.riskScore <= 50).length },
    { label: "51–75 (Elevated)", count: history.filter((h) => h.riskScore > 50 && h.riskScore <= 75).length },
    { label: "76–100 (High)", count: history.filter((h) => h.riskScore > 75).length },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-container mb-2">Analytics</h1>
        <p className="text-base text-on-surface-variant">AI contract analysis metrics from this session.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Analyzed", value: String(total), icon: "description" },
          { label: "Avg Risk Score", value: `${avgScore}/100`, icon: "bar_chart" },
          { label: "High Risk", value: String(highCount), icon: "warning", highlight: true },
          { label: "Avg Processing", value: avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : "—", icon: "timer" },
        ].map(({ label, value, icon, highlight }) => (
          <div key={label} className={`rounded-xl border p-5 shadow-sm ${highlight ? "bg-secondary/5 border-secondary/20" : "bg-white border-outline-variant/10"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-[20px] ${highlight ? "text-secondary" : "text-on-surface-variant"}`}>{icon}</span>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
            </div>
            <p className={`text-3xl font-bold ${highlight ? "text-secondary" : "text-primary-container"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
          <h2 className="text-xl font-bold text-primary-container mb-6">Contract Volume (Last 7 Days)</h2>
          <VolumeChart labels={volume.labels} data={volume.data} />
        </div>
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
          <h2 className="text-xl font-bold text-primary-container mb-4">Risk Distribution</h2>
          <RiskDonut high={highCount} medium={medCount} low={lowCount} total={total} />
        </div>
      </div>

      {/* Type breakdown + score distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
          <h2 className="text-lg font-bold text-primary-container mb-4">By Contract Type</h2>
          {typeBreakdown.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No data</p>
          ) : (
            <div className="space-y-3">
              {typeBreakdown.map(({ label, count, avg }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-primary-container">{label}</span>
                      <span className="text-on-surface-variant">{count} · avg {avg}/100</span>
                    </div>
                    <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full"
                        style={{ width: `${Math.round((count / total) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
          <h2 className="text-lg font-bold text-primary-container mb-4">Score Distribution</h2>
          <div className="space-y-3">
            {scoreDistribution.map(({ label, count }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-primary-container">{label}</span>
                    <span className="text-on-surface-variant">{count}</span>
                  </div>
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: total > 0 ? `${Math.round((count / total) * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-on-surface-variant/50">
        Metrics are session-based. Upload contracts via Contract Intake to update.
      </p>
    </div>
  );
}

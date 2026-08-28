"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryEntry } from "@/types/contract";
import StatCard from "@/components/dashboard/StatCard";
import { VolumeChart, RiskDonut } from "@/components/dashboard/Charts";

// Static seed data so the dashboard is never empty
const SEED_HISTORY: HistoryEntry[] = [
  {
    id: "seed-1",
    filename: "MSA_TechCorp_Final.pdf",
    contractType: "Master Services Agreement",
    counterparty: "TechCorp Global",
    riskLevel: "HIGH",
    riskScore: 82,
    isDemo: false,
    analyzedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 4200,
  },
  {
    id: "seed-2",
    filename: "Vendor_Agreement_SupplyCo.pdf",
    contractType: "Vendor Agreement",
    counterparty: "SupplyCo Ltd",
    riskLevel: "MEDIUM",
    riskScore: 54,
    isDemo: false,
    analyzedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 3800,
  },
  {
    id: "seed-3",
    filename: "NDA_Project_Phoenix.docx",
    contractType: "Non-Disclosure Agreement",
    counterparty: "Innovate LLC",
    riskLevel: "LOW",
    riskScore: 18,
    isDemo: false,
    analyzedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 2900,
  },
  {
    id: "seed-4",
    filename: "SaaS_LicenseAgreement.pdf",
    contractType: "SaaS License Agreement",
    counterparty: "CloudSoft Inc.",
    riskLevel: "MEDIUM",
    riskScore: 61,
    isDemo: false,
    analyzedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 5100,
  },
  {
    id: "seed-5",
    filename: "Employment_Contract_Senior.pdf",
    contractType: "Employment Agreement",
    counterparty: "Internal HR",
    riskLevel: "LOW",
    riskScore: 22,
    isDemo: false,
    analyzedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 3200,
  },
];

function riskBadgeClass(level: string) {
  if (level === "HIGH" || level === "CRITICAL") return "bg-secondary/10 text-secondary";
  if (level === "MEDIUM") return "bg-primary-container/10 text-primary-container";
  return "bg-surface-variant text-on-surface-variant";
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60 * 60 * 1000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.round(diff / 3600000)}h ago`;
  return `${Math.round(diff / 86400000)}d ago`;
}

// Build 7-day volume chart from history
function buildVolumeData(history: HistoryEntry[]) {
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
    const d = new Date(h.analyzedAt);
    const key = d.toLocaleDateString("en-US", { weekday: "short" });
    if (key in days) days[key]++;
  });
  return { labels, data: labels.map((l) => days[l]) };
}

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored: HistoryEntry[] = JSON.parse(sessionStorage.getItem("legalai_history") ?? "[]");
      // Merge live history on top of seed data (deduplicate by id)
      const ids = new Set(stored.map((h) => h.id));
      const merged = [...stored, ...SEED_HISTORY.filter((s) => !ids.has(s.id))];
      setHistory(merged);
    } catch {
      setHistory(SEED_HISTORY);
    }
  }, []);

  const total = history.length;
  const highCount = history.filter((h) => h.riskLevel === "HIGH" || h.riskLevel === "CRITICAL").length;
  const medCount = history.filter((h) => h.riskLevel === "MEDIUM").length;
  const lowCount = history.filter((h) => h.riskLevel === "LOW").length;
  const avgMs = history.length > 0
    ? history.reduce((s, h) => s + h.processingTimeMs, 0) / history.length
    : 0;
  const avgTime = avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : "—";

  const volume = buildVolumeData(history);
  const recent = [...history].sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()).slice(0, 8);

  return (
    <div>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary-container mb-2">Legal Operations Overview</h1>
          <p className="text-base text-on-surface-variant">AI contract analysis metrics and operational risk summary.</p>
        </div>
        <Link
          href="/"
          className="bg-primary-container text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-primary transition-colors text-xs font-bold tracking-wider uppercase"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Intake
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Contracts Analyzed"
          value={String(total)}
          trend="+12% this month"
          trendUp
          icon="description"
        />
        <StatCard
          label="High-Risk Contracts"
          value={String(highCount)}
          trend="Requires immediate review"
          icon="warning"
          highlight
        />
        <StatCard
          label="Avg. Processing Time"
          value={avgTime}
          trend="AI-powered extraction"
          icon="timer"
        />
        <StatCard
          label="Pending Review"
          value="8"
          trend="Awaiting attorney sign-off"
          icon="pending_actions"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
          <h2 className="text-xl font-bold text-primary-container mb-6">Contract Volume (Last 7 Days)</h2>
          <VolumeChart labels={volume.labels} data={volume.data} />
        </div>
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-primary-container mb-4">Risk Distribution</h2>
          <RiskDonut high={highCount} medium={medCount} low={lowCount} total={total} />
        </div>
      </div>

      {/* Risk breakdown by type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {["MSA", "NDA", "Vendor"].map((type) => {
          const count = history.filter((h) => h.contractType?.includes(type)).length;
          return (
            <div key={type} className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">{type} Agreements</p>
              <p className="text-3xl font-bold text-primary-container">{count}</p>
              <p className="text-xs text-on-surface-variant mt-1">analyzed this session</p>
            </div>
          );
        })}
      </div>

      {/* Recent Contracts Table */}
      <div className="bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-container">Recent Contracts</h2>
          <Link href="/" className="text-primary-container text-xs font-bold hover:underline flex items-center gap-1">
            New Intake <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {["Name", "Type", "Counterparty", "Risk", "Score", "Time", "Analyzed"].map((h) => (
                  <th key={h} className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {recent.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <td className="py-3 font-semibold text-primary-container truncate max-w-[160px]">{item.filename}</td>
                  <td className="py-3 text-on-surface-variant truncate max-w-[120px]">{item.contractType ?? "—"}</td>
                  <td className="py-3 text-on-surface-variant truncate max-w-[120px]">{item.counterparty ?? "—"}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${riskBadgeClass(item.riskLevel)}`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-primary-container">{item.riskScore}/100</td>
                  <td className="py-3 text-on-surface-variant">{(item.processingTimeMs / 1000).toFixed(1)}s</td>
                  <td className="py-3 text-on-surface-variant">{formatTime(item.analyzedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

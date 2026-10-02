"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryEntry } from "@/types/contract";
import { getHistory } from "@/lib/storage";
import { isHighRisk } from "@/lib/format";
import StatCard from "@/components/dashboard/StatCard";
import { VolumeChart, RiskDonut } from "@/components/dashboard/Charts";
import ContractsTable from "@/components/contracts/ContractsTable";
import { Card, Icon, PageHeader } from "@/components/ui";

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
    const key = new Date(h.analyzedAt).toLocaleDateString("en-US", { weekday: "short" });
    if (key in days) days[key]++;
  });
  return { labels, data: labels.map((l) => days[l]) };
}

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const total = history.length;
  const highCount = history.filter((h) => isHighRisk(h.riskLevel)).length;
  const medCount = history.filter((h) => h.riskLevel === "MEDIUM").length;
  const lowCount = history.filter((h) => h.riskLevel === "LOW").length;
  const avgMs = total > 0 ? history.reduce((s, h) => s + h.processingTimeMs, 0) / total : 0;
  const avgTime = avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : "—";

  const volume = buildVolumeData(history);
  const recent = history.slice(0, 8);

  return (
    <div>
      <PageHeader title="Legal Operations Overview" subtitle="AI contract analysis metrics and operational risk summary." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Contracts Analyzed" value={String(total)} trend="+12% this month" trendUp icon="description" />
        <StatCard label="High-Risk Contracts" value={String(highCount)} trend="Requires immediate review" icon="warning" highlight />
        <StatCard label="Avg. Processing Time" value={avgTime} trend="AI-powered extraction" icon="timer" />
        <StatCard label="Pending Review" value="8" trend="Awaiting attorney sign-off" icon="pending_actions" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <Card title="Contract Volume (Last 7 Days)" className="lg:col-span-8">
          <VolumeChart labels={volume.labels} data={volume.data} />
        </Card>
        <Card title="Risk Distribution" className="lg:col-span-4 flex flex-col">
          <RiskDonut high={highCount} medium={medCount} low={lowCount} total={total} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {["MSA", "NDA", "Vendor"].map((type) => {
          const count = history.filter((h) => h.contractType?.includes(type)).length;
          return (
            <Card key={type} className="!p-5">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">{type} Agreements</p>
              <p className="text-3xl font-bold text-primary-container">{count}</p>
              <p className="text-xs text-on-surface-variant mt-1">analyzed this session</p>
            </Card>
          );
        })}
      </div>

      <Card
        title="Recent Contracts"
        action={
          <Link href="/contracts" className="text-primary-container text-xs font-bold hover:underline flex items-center gap-1">
            View All <Icon name="arrow_forward" className="text-sm" />
          </Link>
        }
      >
        <ContractsTable items={recent} showProcessingTime />
      </Card>
    </div>
  );
}

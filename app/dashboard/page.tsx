"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryEntry } from "@/types/contract";
import { getHistory, getMatters } from "@/lib/storage";
import { isHighRisk } from "@/lib/format";
import StatCard from "@/components/dashboard/StatCard";
import { VolumeChart, RiskDonut } from "@/components/dashboard/Charts";
import ContractsTable from "@/components/contracts/ContractsTable";
import { Card, Icon, PageHeader, Skeleton } from "@/components/ui";

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
  const [loaded, setLoaded] = useState(false);
  const [matterIds, setMatterIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setHistory(getHistory());
    setMatterIds(new Set(getMatters().map((m) => m.analysisId ?? "")));
    setLoaded(true);
  }, []);

  const total = history.length;
  const highCount = history.filter((h) => isHighRisk(h.riskLevel)).length;
  const medCount = history.filter((h) => h.riskLevel === "MEDIUM").length;
  const lowCount = history.filter((h) => h.riskLevel === "LOW").length;
  const avgMs = total > 0 ? history.reduce((s, h) => s + h.processingTimeMs, 0) / total : 0;
  const avgTime = avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : "—";

  const volume = buildVolumeData(history);
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = history.filter((h) => new Date(h.analyzedAt).getTime() >= weekAgo).length;
  // Medium+ risk contracts that don't yet have a matter record
  const pending = history.filter((h) => h.riskLevel !== "LOW" && !matterIds.has(h.id)).length;
  const recent = history.slice(0, 8);

  return (
    <div>
      <PageHeader title="Legal Operations Overview" subtitle="AI contract analysis metrics and operational risk summary." />

      <Skeleton loading={!loaded} className="rounded-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Contracts Analyzed" value={String(total)} trend={`${thisWeek} in the last 7 days`} trendUp icon="description" />
          <StatCard label="High-Risk Contracts" value={String(highCount)} trend={highCount ? "Requires immediate review" : "Nothing urgent"} icon="warning" highlight />
          <StatCard label="Avg. Processing Time" value={avgTime} trend="AI-powered extraction" icon="timer" />
          <StatCard label="Pending Review" value={String(pending)} trend="Medium+ risk without a matter" icon="pending_actions" />
        </div>
      </Skeleton>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        <Card title="Contract Volume (Last 7 Days)" className="lg:col-span-8">
          <VolumeChart labels={volume.labels} data={volume.data} />
        </Card>
        <Card title="Risk Distribution" className="lg:col-span-4 flex flex-col">
          <RiskDonut high={highCount} medium={medCount} low={lowCount} total={total} />
        </Card>
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

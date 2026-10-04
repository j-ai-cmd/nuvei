"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildPortfolio, Portfolio } from "@/lib/portfolio";
import { markTour } from "@/lib/tour";
import { formatDate } from "@/lib/format";
import { StatsCards } from "@/components/smoothui/stats-2";
import { RiskScoreBars } from "@/components/dashboard/Charts";
import ContractsTable from "@/components/contracts/ContractsTable";
import { ArrowLink, Card, EmptyState, Icon, PageHeader, RiskBadge, Skeleton } from "@/components/ui";

const REVIEW_THRESHOLD = 70;

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default function DashboardPage() {
  const [p, setP] = useState<Portfolio | null>(null);

  useEffect(() => {
    setP(buildPortfolio());
    markTour("viewedDashboard");
  }, []);

  if (!p) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  const next = p.deadlines[0];
  const shortName = (f: string) => f.replace(/\.(pdf|docx)$/i, "").replace(/_/g, " ");

  return (
    <div>
      <PageHeader
        title="Legal risk overview"
        subtitle="Which contracts need legal attention, and what to do next."
      />

      {/* stats-2 (smoothui): its heading carries the story sentence, its cards the four numbers behind it */}
      <div className="nuvei-stats mb-6">
        <StatsCards
          title={
            p.queue.length
              ? `${plural(p.queue.length, "contract")} need legal review${p.highRisk ? `, ${p.highRisk} of them high risk` : ""}.`
              : "Nothing needs legal attention right now."
          }
          description={
            next
              ? `Next deadline: ${next.label.toLowerCase()} for ${shortName(next.filename)} in ${plural(next.daysAway, "day")}.`
              : "No upcoming contract dates."
          }
          stats={[
            { value: String(p.queue.length), label: "Needs review", description: "Medium or higher risk, no matter yet" },
            { value: String(p.highRisk), label: "High or critical", description: `Out of ${plural(p.entries.length, "contract")} analyzed` },
            { value: next ? `${next.daysAway}d` : "None", label: "Next deadline", description: next ? `${next.label}, ${shortName(next.filename)}` : "No upcoming dates" },
            { value: String(p.openMatters), label: "Open matters", description: "Routed to legal teams" },
          ]}
        />
        {p.queue[0] && (
          <ArrowLink href={`/analysis/${p.queue[0].entry.id}`} className="mt-4">
            Start with {shortName(p.queue[0].entry.filename)}
          </ArrowLink>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Card
          title="Review queue"
          className="lg:col-span-8"
          action={<span className="text-xs text-on-surface-variant">Highest risk first</span>}
        >
          {p.queue.length === 0 ? (
            <EmptyState icon="task_alt" title="Queue is clear" message="Every medium or high risk contract has a matter." />
          ) : (
            <ol className="divide-y divide-outline-variant/40">
              {p.queue.map(({ entry, topFinding, findingCount }, i) => (
                <li key={entry.id}>
                  <Link
                    href={`/analysis/${entry.id}`}
                    className="flex items-start gap-4 py-3 px-2 -mx-2 rounded-md hover:bg-surface-container-low transition-colors"
                  >
                    <span className="w-6 text-sm font-bold text-on-surface-variant tabular-nums pt-0.5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-primary-container truncate">{shortName(entry.filename)}</span>
                        <RiskBadge level={entry.riskLevel} />
                        <span className="text-xs text-on-surface-variant tabular-nums">{entry.riskScore}/100</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                        {entry.contractType ?? "—"} · {entry.counterparty ?? "—"}
                      </p>
                      {topFinding && (
                        <p className="text-sm text-primary-container mt-1.5">
                          <span className="font-semibold">Top issue:</span> {topFinding.title}
                          {findingCount > 1 && <span className="text-on-surface-variant"> · +{findingCount - 1} more</span>}
                        </p>
                      )}
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary shrink-0 pt-1">
                      Review <Icon name="arrow_forward" className="text-[14px]" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Upcoming deadlines" className="lg:col-span-4">
          {p.deadlines.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No upcoming contract dates.</p>
          ) : (
            <ul className="space-y-3">
              {p.deadlines.slice(0, 5).map((d) => (
                <li key={`${d.contractId}-${d.label}`}>
                  <Link href={`/analysis/${d.contractId}`} className="flex items-start gap-3 group">
                    <div className="w-14 shrink-0 rounded-md border border-outline-variant/50 py-1 text-center">
                      <p className="text-sm font-bold text-primary-container tabular-nums">{d.daysAway}</p>
                      <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">days</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary-container group-hover:underline">{d.label}</p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {shortName(d.filename)} · {formatDate(d.date.toISOString())}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        title="Risk score by contract"
        className="mb-6"
        action={
          <span className="text-xs text-on-surface-variant flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-secondary" /> ≥ {REVIEW_THRESHOLD} high risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#8a9199]" /> below</span>
          </span>
        }
      >
        <RiskScoreBars
          threshold={REVIEW_THRESHOLD}
          items={p.entries.map((e) => ({ label: shortName(e.filename), score: e.riskScore, level: e.riskLevel }))}
        />
      </Card>

      <Card
        title="Recently analyzed"
        action={
          <Link href="/contracts" className="tap text-primary-container text-xs font-bold hover:underline flex items-center gap-1">
            View All <Icon name="arrow_forward" className="text-sm" />
          </Link>
        }
      >
        <ContractsTable items={p.entries.slice(0, 5)} showProcessingTime />
      </Card>
    </div>
  );
}

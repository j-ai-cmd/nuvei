"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildPortfolio, Portfolio } from "@/lib/portfolio";
import { markTour } from "@/lib/tour";
import { formatDate } from "@/lib/format";
import StatCard from "@/components/dashboard/StatCard";
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
        title="Legal Risk Overview"
        subtitle="Which contracts need legal attention, and what to do next."
      />

      {/* The headline: one sentence that tells the story */}
      <div className="mb-6 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <Icon name={p.queue.length ? "assignment_late" : "task_alt"} className={`text-[28px] ${p.queue.length ? "text-secondary" : "text-green-700"}`} />
        <p className="text-base text-primary-container flex-1">
          {p.queue.length ? (
            <>
              <strong>{plural(p.queue.length, "contract")}</strong> need legal review
              {p.highRisk > 0 && (
                <>
                  , including <strong className="text-secondary">{p.highRisk} high risk</strong>
                </>
              )}
              .{next && <> Next deadline: <strong>{next.label.toLowerCase()}</strong> in {plural(next.daysAway, "day")}.</>}
            </>
          ) : (
            <>All analyzed contracts are reviewed or low risk. Nothing needs attention right now.</>
          )}
        </p>
        {p.queue[0] && (
          <ArrowLink href={`/analysis/${p.queue[0].entry.id}`} className="shrink-0">
            Start with {shortName(p.queue[0].entry.filename)}
          </ArrowLink>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard label="Needs Review" value={String(p.queue.length)} trend="Medium+ risk, no matter yet" icon="pending_actions" highlight={p.queue.length > 0} />
        <StatCard label="High / Critical" value={String(p.highRisk)} trend={`of ${plural(p.entries.length, "contract")} analyzed`} icon="warning" />
        <StatCard
          label="Next Deadline"
          value={next ? `${next.daysAway}d` : "—"}
          trend={next ? `${next.label} · ${shortName(next.filename)}` : "No upcoming dates"}
          icon="event"
        />
        <StatCard label="Open Matters" value={String(p.openMatters)} trend="Routed to legal teams" icon="work" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Card
          title="Review Queue"
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

        <Card title="Upcoming Deadlines" className="lg:col-span-4">
          {p.deadlines.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No upcoming contract dates.</p>
          ) : (
            <ul className="space-y-3">
              {p.deadlines.slice(0, 5).map((d) => (
                <li key={`${d.contractId}-${d.label}`}>
                  <Link href={`/analysis/${d.contractId}`} className="flex items-start gap-3 group">
                    <div className="w-14 shrink-0 rounded-md border border-outline-variant/50 py-1 text-center">
                      <p className="text-sm font-bold text-primary-container tabular-nums">{d.daysAway}</p>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">days</p>
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
        title="Risk Score by Contract"
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
        title="Recently Analyzed"
        action={
          <Link href="/contracts" className="text-primary-container text-xs font-bold hover:underline flex items-center gap-1">
            View All <Icon name="arrow_forward" className="text-sm" />
          </Link>
        }
      >
        <ContractsTable items={p.entries.slice(0, 5)} showProcessingTime />
      </Card>
    </div>
  );
}

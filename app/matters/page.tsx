"use client";

import { useEffect, useState } from "react";
import { MatterRecord } from "@/types/contract";
import { getMatters } from "@/lib/storage";
import { formatDate } from "@/lib/format";
import { ArrowLink, Card, EmptyState, Icon, LabeledValue, PageHeader, RiskBadge } from "@/components/ui";

function statusColor(status: string) {
  if (status.toLowerCase().includes("open")) return "text-secondary";
  if (status.toLowerCase().includes("complete")) return "text-green-700";
  return "text-on-surface-variant";
}

export default function MattersPage() {
  const [matters, setMatters] = useState<MatterRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMatters(getMatters());
    setLoaded(true);
  }, []);

  return (
    <div>
      <PageHeader title="Matters" subtitle="Simulated CLM matter records created from AI-analyzed contracts." />

      {loaded && matters.length === 0 ? (
        <EmptyState
          icon="work"
          title="No matters yet"
          message="Analyze a contract and click “Create Matter” to generate a simulated CLM record."
          cta={{ href: "/", label: "Upload Contract" }}
        />
      ) : (
        <div className="space-y-4">
          {matters.map((m) => (
            <Card key={m.matterId}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-lg font-bold text-primary-container font-mono">{m.matterId}</span>
                    <RiskBadge level={m.riskLevel} suffix="RISK" />
                    <span className={`text-xs font-semibold ${statusColor(m.status)}`}>{m.status}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <LabeledValue label="Contract Type">{m.contractType}</LabeledValue>
                    <LabeledValue label="Counterparty">{m.counterparty}</LabeledValue>
                    <LabeledValue label="Assigned Team">{m.assignedTeam}</LabeledValue>
                    <LabeledValue label="Created">{formatDate(m.createdAt, true)}</LabeledValue>
                  </div>
                  {m.filename && (
                    <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1">
                      <Icon name="description" className="text-[14px]" />
                      {m.filename}
                    </p>
                  )}
                </div>
                {m.analysisId && (
                  <ArrowLink href={`/analysis/${m.analysisId}`} className="shrink-0">
                    View Analysis
                  </ArrowLink>
                )}
              </div>
            </Card>
          ))}
          <p className="text-xs text-center text-on-surface-variant/50 pt-4">
            DEMONSTRATION · MOCK CLM INTEGRATION · Matter records are session-only
          </p>
        </div>
      )}
    </div>
  );
}

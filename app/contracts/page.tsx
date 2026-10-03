"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HistoryEntry } from "@/types/contract";
import { getHistory } from "@/lib/storage";
import AnimatedTabs from "@/components/smoothui/animated-tabs";
import { EmptyState, PageHeader, Skeleton } from "@/components/ui";
import ContractsTable from "@/components/contracts/ContractsTable";

function ContractsInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const [all, setAll] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [risk, setRisk] = useState("all");

  useEffect(() => {
    setAll(getHistory());
    setLoaded(true);
  }, []);

  const byRisk =
    risk === "all" ? all : all.filter((h) => (risk === "high" ? h.riskLevel === "HIGH" || h.riskLevel === "CRITICAL" : h.riskLevel.toLowerCase() === risk));
  const filtered = q
    ? byRisk.filter(
        (h) =>
          h.filename.toLowerCase().includes(q) ||
          (h.contractType ?? "").toLowerCase().includes(q) ||
          (h.counterparty ?? "").toLowerCase().includes(q) ||
          h.riskLevel.toLowerCase().includes(q)
      )
    : byRisk;

  return (
    <div>
      <PageHeader
        title="Contracts"
        subtitle={
          <>
            All analyzed contracts from this session.
            {q && <span className="ml-2 font-semibold text-primary">Filtering: &ldquo;{q}&rdquo;</span>}
          </>
        }
      />

      <div className="mb-4 overflow-x-auto">
        <AnimatedTabs
          variant="pill"
          activeTab={risk}
          onChange={setRisk}
          className="whitespace-nowrap text-xs font-bold tracking-wider uppercase"
          tabs={[
            { id: "all", label: `All (${all.length})` },
            { id: "high", label: "High" },
            { id: "medium", label: "Medium" },
            { id: "low", label: "Low" },
          ]}
        />
      </div>

      {!loaded ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="description"
          title={q || risk !== "all" ? "No contracts match" : "No contracts yet"}
          message={q || risk !== "all" ? "Try a different search or filter." : "Upload a contract to get started."}
          cta={q ? undefined : { href: "/", label: "Upload Contract" }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-outline-variant/10 shadow-xs overflow-hidden">
          <ContractsTable items={filtered} />
        </div>
      )}
    </div>
  );
}

export default function ContractsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-on-surface-variant">Loading...</div>}>
      <ContractsInner />
    </Suspense>
  );
}

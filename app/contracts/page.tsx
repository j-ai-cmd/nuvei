"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HistoryEntry } from "@/types/contract";
import { getHistory } from "@/lib/storage";
import { EmptyState, PageHeader, Skeleton } from "@/components/ui";
import ContractsTable from "@/components/contracts/ContractsTable";

function ContractsInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const [all, setAll] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAll(getHistory());
    setLoaded(true);
  }, []);

  const filtered = q
    ? all.filter(
        (h) =>
          h.filename.toLowerCase().includes(q) ||
          (h.contractType ?? "").toLowerCase().includes(q) ||
          (h.counterparty ?? "").toLowerCase().includes(q) ||
          h.riskLevel.toLowerCase().includes(q)
      )
    : all;

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

      {!loaded ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="description"
          title={q ? "No contracts match your search" : "No contracts yet"}
          message={q ? "Try a different search term." : "Upload a contract to get started."}
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

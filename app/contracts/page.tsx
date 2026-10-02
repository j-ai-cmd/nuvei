"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HistoryEntry } from "@/types/contract";
import { getHistory } from "@/lib/storage";
import { EmptyState, PageHeader } from "@/components/ui";
import ContractsTable from "@/components/contracts/ContractsTable";

function ContractsInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const [all, setAll] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setAll(getHistory());
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

      {filtered.length === 0 ? (
        <EmptyState
          icon="description"
          title={q ? "No contracts match your search" : "No contracts yet"}
          message={q ? "Try a different search term." : "Upload a contract to get started."}
          cta={q ? undefined : { href: "/", label: "Upload Contract" }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
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

"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HistoryEntry } from "@/types/contract";

const SEED: HistoryEntry[] = [
  { id: "seed-1", filename: "MSA_TechCorp_Final.pdf", contractType: "Master Services Agreement", counterparty: "TechCorp Global", riskLevel: "HIGH", riskScore: 82, isDemo: false, analyzedAt: new Date(Date.now() - 2 * 3600000).toISOString(), processingTimeMs: 4200 },
  { id: "seed-2", filename: "Vendor_Agreement_SupplyCo.pdf", contractType: "Vendor Agreement", counterparty: "SupplyCo Ltd", riskLevel: "MEDIUM", riskScore: 54, isDemo: false, analyzedAt: new Date(Date.now() - 86400000).toISOString(), processingTimeMs: 3800 },
  { id: "seed-3", filename: "NDA_Project_Phoenix.docx", contractType: "Non-Disclosure Agreement", counterparty: "Innovate LLC", riskLevel: "LOW", riskScore: 18, isDemo: false, analyzedAt: new Date(Date.now() - 2 * 86400000).toISOString(), processingTimeMs: 2900 },
  { id: "seed-4", filename: "SaaS_LicenseAgreement.pdf", contractType: "SaaS License Agreement", counterparty: "CloudSoft Inc.", riskLevel: "MEDIUM", riskScore: 61, isDemo: false, analyzedAt: new Date(Date.now() - 3 * 86400000).toISOString(), processingTimeMs: 5100 },
  { id: "seed-5", filename: "Employment_Contract_Senior.pdf", contractType: "Employment Agreement", counterparty: "Internal HR", riskLevel: "LOW", riskScore: 22, isDemo: false, analyzedAt: new Date(Date.now() - 5 * 86400000).toISOString(), processingTimeMs: 3200 },
];

function riskBadge(level: string) {
  if (level === "CRITICAL") return "bg-red-100 text-red-800";
  if (level === "HIGH") return "bg-secondary/10 text-secondary";
  if (level === "MEDIUM") return "bg-amber-100 text-amber-800";
  return "bg-green-100 text-green-800";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function ContractsInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const [all, setAll] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored: HistoryEntry[] = JSON.parse(sessionStorage.getItem("legalai_history") ?? "[]");
      const ids = new Set(stored.map((h) => h.id));
      setAll([...stored, ...SEED.filter((s) => !ids.has(s.id))]);
    } catch {
      setAll(SEED);
    }
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

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
  );

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary-container mb-2">Contracts</h1>
          <p className="text-base text-on-surface-variant">
            All analyzed contracts from this session.
            {q && <span className="ml-2 font-semibold text-primary">Filtering: &ldquo;{q}&rdquo;</span>}
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary-container text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-primary transition-colors text-xs font-bold tracking-wider uppercase"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Intake
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">description</span>
          <h2 className="text-xl font-bold text-primary mb-2">
            {q ? "No contracts match your search" : "No contracts yet"}
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            {q ? "Try a different search term." : "Upload a contract to get started."}
          </p>
          {!q && (
            <Link href="/" className="bg-primary text-white px-6 py-3 rounded text-xs font-bold tracking-wider uppercase hover:bg-primary/90 transition-colors">
              Upload Contract
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  {["File", "Type", "Counterparty", "Risk", "Score", "Analyzed", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/10">
                {sorted.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">description</span>
                        <span className="font-semibold text-primary-container truncate max-w-[180px]">{item.filename}</span>
                        {item.isDemo && (
                          <span className="text-[10px] font-bold bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded">DEMO</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant truncate max-w-[140px]">{item.contractType ?? "—"}</td>
                    <td className="px-4 py-4 text-on-surface-variant truncate max-w-[140px]">{item.counterparty ?? "—"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${riskBadge(item.riskLevel)}`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-primary-container">{item.riskScore}/100</td>
                    <td className="px-4 py-4 text-on-surface-variant whitespace-nowrap">{formatDate(item.analyzedAt)}</td>
                    <td className="px-4 py-4">
                      {!item.id.startsWith("seed-") ? (
                        <Link
                          href={`/analysis/${item.id}`}
                          className="text-xs font-bold text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
                        >
                          View <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-on-surface-variant/40">Seed data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

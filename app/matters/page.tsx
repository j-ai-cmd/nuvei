"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MatterRecord } from "@/types/contract";

function riskBadge(level: string) {
  if (level === "CRITICAL") return "bg-red-100 text-red-800";
  if (level === "HIGH") return "bg-secondary/10 text-secondary";
  if (level === "MEDIUM") return "bg-amber-100 text-amber-800";
  return "bg-green-100 text-green-800";
}

function statusColor(status: string) {
  if (status.toLowerCase().includes("open")) return "text-secondary";
  if (status.toLowerCase().includes("complete")) return "text-green-700";
  return "text-on-surface-variant";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function MattersPage() {
  const [matters, setMatters] = useState<MatterRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored: MatterRecord[] = JSON.parse(sessionStorage.getItem("legalai_matters") ?? "[]");
      setMatters(stored);
    } catch {
      setMatters([]);
    }
    setLoaded(true);
  }, []);

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary-container mb-2">Matters</h1>
          <p className="text-base text-on-surface-variant">
            Simulated CLM matter records created from AI-analyzed contracts.
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

      {loaded && matters.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">work</span>
          <h2 className="text-xl font-bold text-primary mb-2">No matters yet</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Analyze a contract and click &ldquo;Create Matter&rdquo; to generate a simulated CLM record.
          </p>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded text-xs font-bold tracking-wider uppercase hover:bg-primary/90 transition-colors">
            Upload Contract
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matters.map((m) => (
            <div key={m.matterId} className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-lg font-bold text-primary-container font-mono">{m.matterId}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${riskBadge(m.riskLevel)}`}>
                      {m.riskLevel} RISK
                    </span>
                    <span className={`text-xs font-semibold ${statusColor(m.status)}`}>{m.status}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      ["Contract Type", m.contractType],
                      ["Counterparty", m.counterparty],
                      ["Assigned Team", m.assignedTeam],
                      ["Created", formatDate(m.createdAt)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-sm font-semibold text-primary-container">{value}</p>
                      </div>
                    ))}
                  </div>
                  {m.filename && (
                    <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">description</span>
                      {m.filename}
                    </p>
                  )}
                </div>
                {m.analysisId && !m.analysisId.startsWith("seed-") && (
                  <Link
                    href={`/analysis/${m.analysisId}`}
                    className="shrink-0 text-xs font-bold text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
                  >
                    View Analysis <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
          <p className="text-xs text-center text-on-surface-variant/50 pt-4">
            DEMONSTRATION · MOCK CLM INTEGRATION · Matter records are session-only
          </p>
        </div>
      )}
    </div>
  );
}

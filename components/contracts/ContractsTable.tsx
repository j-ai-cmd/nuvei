"use client";

import { useRouter } from "next/navigation";
import { HistoryEntry } from "@/types/contract";
import { formatRelative } from "@/lib/format";
import { ArrowLink, Icon, RiskBadge, Tooltip } from "@/components/ui";

interface ContractsTableProps {
  items: HistoryEntry[];
  showProcessingTime?: boolean;
}

// Every row opens its analysis (seed rows resolve to sample analyses)
export default function ContractsTable({ items, showProcessingTime }: ContractsTableProps) {
  const router = useRouter();
  const headers = ["File", "Type", "Counterparty", "Risk", "Score", ...(showProcessingTime ? ["Time"] : []), "Analyzed", ""];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant/20 bg-surface-container-low">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-outline-variant/10">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => router.push(`/analysis/${item.id}`)}
              className="hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Icon name="description" className="text-on-surface-variant text-[20px]" />
                  <span className="font-semibold text-primary-container truncate max-w-[180px]">{item.filename}</span>
                  {item.isDemo && (
                    <span className="text-[10px] font-bold bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm">DEMO</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-on-surface-variant truncate max-w-[140px]">{item.contractType ?? "—"}</td>
              <td className="px-4 py-4 text-on-surface-variant truncate max-w-[140px]">{item.counterparty ?? "—"}</td>
              <td className="px-4 py-4">
                <Tooltip content={`Risk score ${item.riskScore}/100`}>
                  <RiskBadge level={item.riskLevel} />
                </Tooltip>
              </td>
              <td className="px-4 py-4 font-semibold text-primary-container">{item.riskScore}/100</td>
              {showProcessingTime && (
                <td className="px-4 py-4 text-on-surface-variant">{(item.processingTimeMs / 1000).toFixed(1)}s</td>
              )}
              <td className="px-4 py-4 text-on-surface-variant whitespace-nowrap">{formatRelative(item.analyzedAt)}</td>
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <ArrowLink href={`/analysis/${item.id}`}>View</ArrowLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/intake/UploadZone";
import WorkflowStepper from "@/components/intake/WorkflowStepper";
import { HistoryEntry } from "@/types/contract";
import { getStoredHistory } from "@/lib/storage";
import { formatRelative } from "@/lib/format";
import { Icon, RiskBadge } from "@/components/ui";

export default function IntakePage() {
  const [recent, setRecent] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setRecent(getStoredHistory().slice(0, 5));
  }, []);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left column */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <header>
          <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">
            Analyze a contract in minutes.
          </h2>
          <p className="text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Upload a PDF or DOCX and automatically extract key terms, identify potential risks,
            and prepare structured data for legal review.
          </p>
        </header>

        <UploadZone />
        <WorkflowStepper activeStep={0} />
      </div>

      {/* Right column */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* Recent Intakes — live from sessionStorage */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-primary">Recent Intakes</h3>
            {recent.length > 0 && (
              <Link href="/contracts" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                All <Icon name="arrow_forward" className="text-[14px]" />
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              No contracts analyzed yet. Upload one above to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => (
                <Link
                  key={item.id}
                  href={`/analysis/${item.id}`}
                  className="flex items-start gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                    <Icon name="description" className="text-[20px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-primary truncate">{item.filename}</p>
                    <p className="text-xs text-on-surface-variant">{formatRelative(item.analyzedAt)}</p>
                  </div>
                  <RiskBadge level={item.riskLevel} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Secure Processing */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
            <Icon name="info" className="text-secondary text-[20px]" />
            Secure Processing
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            All documents are processed in memory and never written to disk. Data is not retained
            beyond the analysis session unless saved to a Matter.
          </p>
          <Link href="/security" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View Security Policy
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { MatterRecord } from "@/types/contract";
import { useRouter } from "next/navigation";

interface MatterModalProps {
  matter: MatterRecord;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-4 rounded-lg border border-outline-variant/10">
      <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-semibold text-primary">{value}</p>
    </div>
  );
}

export default function MatterModal({ matter, onClose }: MatterModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-primary-container/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 w-full max-w-lg overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-primary-fixed to-tertiary-fixed" />
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-primary">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-primary">Matter Created</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Simulated CLM matter record generated. In production this would sync to your CLM system.
            </p>
            <span className="mt-3 text-xs bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-semibold border border-outline-variant/20">
              DEMONSTRATION · MOCK CLM INTEGRATION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Field label="Matter ID" value={matter.matterId} />
            <Field label="Contract Type" value={matter.contractType} />
            <Field label="Counterparty" value={matter.counterparty} />
            <Field label="Assigned Team" value={matter.assignedTeam} />
            <div className="bg-surface p-4 rounded-lg border border-outline-variant/10">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Risk Level</p>
              <p className={`text-base font-bold ${
                matter.riskLevel === "HIGH" || matter.riskLevel === "CRITICAL" ? "text-secondary" : "text-primary"
              }`}>
                {matter.riskLevel}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-outline-variant/10">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
              <p className="text-base font-semibold text-primary">{matter.status}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-secondary-container transition-colors"
            >
              View Dashboard
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-surface-container text-primary rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-surface-variant transition-colors"
            >
              Back to Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

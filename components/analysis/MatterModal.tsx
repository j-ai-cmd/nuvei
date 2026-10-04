"use client";

import { MatterRecord } from "@/types/contract";
import { useRouter } from "next/navigation";
import { Button, Icon, Modal } from "@/components/ui";

interface MatterModalProps {
  matter: MatterRecord;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
      <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-semibold text-primary">{value}</p>
    </div>
  );
}

export default function MatterModal({ matter, onClose }: MatterModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen onClose={onClose} size="lg">
        <div className="px-2 pb-2">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
              <Icon name="check_circle" className="text-[32px] text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Matter Created</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Simulated CLM matter record generated. In production this would sync to your CLM system.
            </p>
            <span className="mt-3 text-xs bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-semibold border border-outline-variant/60">
              DEMONSTRATION · MOCK CLM INTEGRATION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Field label="Matter ID" value={matter.matterId} />
            <Field label="Contract Type" value={matter.contractType} />
            <Field label="Counterparty" value={matter.counterparty} />
            <Field label="Assigned Team" value={matter.assignedTeam} />
            <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Risk Level</p>
              <p className={`text-base font-bold ${
                matter.riskLevel === "HIGH" || matter.riskLevel === "CRITICAL" ? "text-secondary" : "text-primary"
              }`}>
                {matter.riskLevel}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
              <p className="text-base font-semibold text-primary">{matter.status}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="danger" icon="dashboard" onClick={() => router.push("/dashboard")} className="flex-1">
              See Dashboard
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Back to Analysis
            </Button>
          </div>
        </div>
    </Modal>
  );
}

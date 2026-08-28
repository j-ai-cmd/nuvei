import { ContractMetadata } from "@/types/contract";

const FIELD_LABELS: { key: keyof ContractMetadata; label: string }[] = [
  { key: "agreementType", label: "Agreement Type" },
  { key: "effectiveDate", label: "Effective Date" },
  { key: "expirationDate", label: "Expiration Date" },
  { key: "renewalTerms", label: "Renewal Terms" },
  { key: "noticePeriod", label: "Notice Period" },
  { key: "governingLaw", label: "Governing Law" },
  { key: "jurisdiction", label: "Jurisdiction" },
  { key: "contractValue", label: "Contract Value" },
  { key: "currency", label: "Currency" },
  { key: "paymentTerms", label: "Payment Terms" },
  { key: "fees", label: "Fees" },
  { key: "terminationTerms", label: "Termination" },
  { key: "liabilityCap", label: "Liability Cap" },
  { key: "indemnification", label: "Indemnification" },
  { key: "confidentiality", label: "Confidentiality" },
  { key: "ipOwnership", label: "IP Ownership" },
  { key: "privacyDataProtection", label: "Privacy / Data Protection" },
  { key: "securityObligations", label: "Security Obligations" },
  { key: "auditRights", label: "Audit Rights" },
  { key: "assignment", label: "Assignment" },
  { key: "disputeResolution", label: "Dispute Resolution" },
];

export default function KeyTermsGrid({ metadata }: { metadata: ContractMetadata }) {
  return (
    <div className="space-y-6">
      {metadata.parties && metadata.parties.length > 0 && (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-5">
          <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Parties</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metadata.parties.map((p, i) => (
              <div key={i} className="bg-surface-container-low p-3 rounded">
                <p className="text-xs text-on-surface-variant font-semibold">{p.role ?? `Party ${i + 1}`}</p>
                <p className="text-sm font-bold text-primary mt-1">{p.name ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-5">
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Key Terms</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELD_LABELS.map(({ key, label }) => {
            const value = metadata[key] as string | null | undefined;
            if (value === null || value === undefined) return (
              <div key={key} className="border-b border-outline-variant/10 pb-3">
                <p className="text-xs text-on-surface-variant/60 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-on-surface-variant/40 mt-1 italic">Not specified</p>
              </div>
            );
            return (
              <div key={key} className="border-b border-outline-variant/10 pb-3">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-sm text-primary mt-1">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

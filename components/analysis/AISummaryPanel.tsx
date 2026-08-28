import { ContractAnalysis } from "@/types/contract";

export default function AISummaryPanel({ analysis }: { analysis: ContractAnalysis }) {
  const { missingInformation, recommendedLegalRouting, top3Risks, unusualClauses } = analysis;

  return (
    <div className="space-y-6">
      {/* AI Review Panel */}
      <div className="bg-primary-container text-white rounded-lg border border-primary/20 p-6 shadow-lg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">psychology</span>
            </div>
            <h3 className="text-xl font-bold text-white">AI Review Summary</h3>
          </div>

          <div className="space-y-6">
            {missingInformation.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error_outline</span>
                  Missing Information
                </h4>
                <ul className="space-y-2">
                  {missingInformation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="w-full h-px bg-white/10" />

            <div>
              <h4 className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">route</span>
                Recommended Routing
              </h4>
              <div className="bg-white/5 rounded p-3 border-l-2 border-primary-fixed">
                <span className="text-sm text-white/80 block mb-1">Based on risk assessment, route to:</span>
                <span className="text-sm font-bold text-white block">{recommendedLegalRouting}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unusual Clauses */}
      {unusualClauses.length > 0 && (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-5">
          <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">gavel</span>
            Unusual Clauses
          </h3>
          <ul className="space-y-3">
            {unusualClauses.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Document structure */}
      {top3Risks.length > 0 && (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-5">
          <h3 className="text-base font-bold text-primary mb-4">Top 3 Risks</h3>
          <div className="space-y-2">
            {top3Risks.map((risk, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded cursor-default group border-l-2 ${
                  risk.severity === "CRITICAL" || risk.severity === "HIGH"
                    ? "bg-error-container/20 border-secondary"
                    : "hover:bg-surface-container-low border-outline-variant/20"
                }`}
              >
                <span className="text-sm text-primary font-medium truncate max-w-[180px]">{risk.title}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    risk.severity === "CRITICAL" ? "text-on-error-container" :
                    risk.severity === "HIGH" ? "text-secondary" :
                    "text-on-surface-variant"
                  }`}
                >
                  {risk.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

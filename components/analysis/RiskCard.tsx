import { RiskItem } from "@/types/contract";
import { Icon } from "@/components/ui";

const SEVERITY_CONFIG = {
  CRITICAL: { bar: "bg-on-error-container", badge: "bg-error-container text-on-error-container", icon: "warning" },
  HIGH: { bar: "bg-secondary", badge: "bg-secondary/10 text-secondary", icon: "warning" },
  MEDIUM: { bar: "bg-surface-tint", badge: "bg-surface-container-high text-on-surface-variant", icon: "info" },
  LOW: { bar: "bg-outline-variant", badge: "bg-surface-variant text-on-surface-variant", icon: "info" },
};

export default function RiskCard({ risk }: { risk: RiskItem }) {
  const cfg = SEVERITY_CONFIG[risk.severity] ?? SEVERITY_CONFIG.MEDIUM;

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${cfg.bar}`} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name={cfg.icon} className="text-on-surface-variant text-[20px]" />
          <h4 className="text-base font-bold text-primary">{risk.title}</h4>
        </div>
        <span className={`${cfg.badge} text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest whitespace-nowrap`}>
          {risk.severity}
        </span>
      </div>

      {risk.clause && (
        <p className="text-xs text-on-surface-variant mb-2 font-semibold">{risk.clause}</p>
      )}

      <p className="text-sm text-on-surface-variant mb-4">{risk.explanation}</p>

      <div className="bg-surface-container-low p-3 rounded-sm border-b border-outline-variant/20 flex items-start gap-3">
        <Icon name="task_alt" className="text-on-surface-variant text-[18px] mt-0.5" />
        <div>
          <span className="text-xs font-bold text-primary block mb-1">Recommended Action</span>
          <span className="text-xs text-on-surface-variant">{risk.recommendedAction}</span>
        </div>
      </div>
    </div>
  );
}

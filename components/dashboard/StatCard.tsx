import { forwardRef } from "react";
import { Icon } from "@/components/ui";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// forwardRef + className/style passthrough so GlowHover can measure and clone it
const StatCard = forwardRef<HTMLDivElement, StatCardProps>(function StatCard(
  { label, value, trend, trendUp, icon, highlight, className = "", style },
  ref
) {
  return (
    <div ref={ref} style={style} className={`${className} p-6 rounded-xl border shadow-xs flex flex-col justify-between ${
      highlight
        ? "bg-secondary/5 border-secondary/20 shadow-[0_4px_20px_rgba(186,0,55,0.04)]"
        : "bg-white border-outline-variant/10"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${highlight ? "text-secondary" : "text-on-surface-variant"}`}>
          {label}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          highlight ? "bg-secondary/20 text-secondary" : "bg-primary-fixed/20 text-primary-container"
        }`}>
          <Icon name={icon} className="text-sm" />
        </div>
      </div>
      <div>
        <div className={`text-4xl font-bold ${highlight ? "text-secondary" : "text-primary-container"}`}>{value}</div>
        {trend && (
          <div className={`text-xs mt-1 flex items-center gap-1 ${
            highlight ? "text-secondary" : trendUp !== undefined ? "text-emerald-600" : "text-on-surface-variant"
          }`}>
            {!highlight && trendUp !== undefined && (
              <Icon name={trendUp ? "trending_up" : "trending_down"} className="text-xs" />
            )}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
});

export default StatCard;

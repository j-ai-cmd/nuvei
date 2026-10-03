const STYLES: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  HIGH: "bg-secondary/10 text-secondary",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-green-100 text-green-800",
};

export default function RiskBadge({ level, suffix }: { level: string; suffix?: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold whitespace-nowrap ${STYLES[level] ?? STYLES.LOW}`}>
      {level}
      {suffix && ` ${suffix}`}
    </span>
  );
}

"use client";

interface RiskScoreCardProps {
  score: number;
  riskLevel: string;
}

const LEVEL_COLORS: Record<string, string> = {
  LOW: "#4caf50",
  MEDIUM: "#ff9800",
  HIGH: "#ba0037",
  CRITICAL: "#93000a",
};

export default function RiskScoreCard({ score, riskLevel }: RiskScoreCardProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = LEVEL_COLORS[riskLevel] ?? "#ba0037";

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden min-h-[300px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim/20 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
      <h3 className="font-bold text-xl text-primary mb-6 w-full text-left self-start">Risk Score</h3>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e3e5" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-on-surface-variant mt-1">/ 100</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-bold" style={{ color }}>{riskLevel} RISK</span>
      </div>
    </div>
  );
}

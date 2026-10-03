"use client";

import { BorderBeam, ProgressBar } from "@/components/ui";

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
  const color = LEVEL_COLORS[riskLevel] ?? "#ba0037";
  const high = riskLevel === "HIGH" || riskLevel === "CRITICAL";

  return (
    <BorderBeam active={high} colorFrom={color} colorTo="#ffb2b7" duration={6} radius={8} className="rounded-lg">
      <div className="bg-surface-container-lowest rounded-lg p-8 flex flex-col justify-center min-h-[300px]">
        <h3 className="font-bold text-xl text-primary mb-6">Risk Score</h3>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-6xl font-bold tabular-nums" style={{ color }}>{score}</span>
          <span className="text-sm text-on-surface-variant">/ 100</span>
        </div>
        <ProgressBar value={score} color={color} label={`${riskLevel} RISK`} labelClassName="text-sm font-bold" />
        <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Critical</span>
        </div>
      </div>
    </BorderBeam>
  );
}

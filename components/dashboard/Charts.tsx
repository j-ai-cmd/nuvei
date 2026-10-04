"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend, Filler);

interface VolumeChartProps {
  labels: string[];
  data: number[];
}

export function VolumeChart({ labels, data }: VolumeChartProps) {
  return (
    <div className="h-64 w-full relative">
      <Line
        role="img"
        aria-label="Contract volume over the last 7 days"
        data={{
          labels,
          datasets: [
            {
              label: "Contracts Processed",
              data,
              borderColor: "#081f2c",
              backgroundColor: "rgba(8, 31, 44, 0.05)",
              borderWidth: 2,
              tension: 0.25,
              fill: true,
              pointBackgroundColor: "#ffffff",
              pointBorderColor: "#081f2c",
              pointBorderWidth: 2,
              pointRadius: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 }, grid: { color: "rgba(195, 199, 204, 0.2)" }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } },
          },
        }}
      />
    </div>
  );
}

interface RiskDonutProps {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export function RiskDonut({ high, medium, low, total }: RiskDonutProps) {
  return (
    <div className="flex-1 relative flex flex-col items-center justify-center">
      <div className="h-48 w-48 relative">
        <Doughnut
          role="img"
          aria-label="Risk distribution by level"
          data={{
            labels: ["High / Critical", "Medium", "Low"],
            datasets: [
              {
                data: [high, medium, low],
                backgroundColor: ["#ba0037", "#081f2c", "#c3c7cc"],
                borderWidth: 0,
                // @ts-expect-error chart.js type
                cutout: "75%",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            layout: { padding: 10 },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-primary-container">{total}</span>
          <span className="text-[11px] text-on-surface-variant">Total</span>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block" /> High
        </div>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary-container inline-block" /> Med
        </div>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
          <span className="w-2 h-2 rounded-full bg-outline-variant inline-block" /> Low
        </div>
      </div>
    </div>
  );
}

const EMPHASIS = "#ba0037"; // brand red: at or above the review threshold
const CONTEXT = "#8a9199"; // de-emphasis gray: below threshold

// Emphasis bar chart: one row per contract, sorted by score, threshold-crossing bars in red
export function RiskScoreBars({ items, threshold = 70 }: { items: { label: string; score: number; level: string }[]; threshold?: number }) {
  const sorted = [...items].sort((a, b) => b.score - a.score);
  return (
    <div className="w-full relative" style={{ height: Math.max(160, sorted.length * 40 + 40) }}>
      <Bar
        role="img"
        aria-label={`Risk score by contract, highest first: ${sorted.map((i) => `${i.label} ${i.score} out of 100`).join(", ")}. Scores of ${threshold} or more are high risk.`}
        data={{
          labels: sorted.map((i) => i.label),
          datasets: [
            {
              data: sorted.map((i) => i.score),
              backgroundColor: sorted.map((i) => (i.score >= threshold ? EMPHASIS : CONTEXT)),
              borderRadius: 4,
              borderSkipped: "start",
              barThickness: 14,
            },
          ],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items) => sorted[items[0].dataIndex].label,
                label: (ctx) => ` ${ctx.parsed.x}/100 · ${sorted[ctx.dataIndex].level} risk`,
              },
            },
          },
          scales: {
            x: {
              min: 0,
              max: 100,
              ticks: { stepSize: 10, maxRotation: 0, autoSkip: false, color: "#43474b", callback: (v) => (Number(v) % 50 === 0 || Number(v) === threshold ? v : "") },
              grid: { color: (c) => (c.tick?.value === threshold ? "#ba0037" : "rgba(195,199,204,0.35)") },
              border: { display: false },
            },
            y: {
              ticks: {
                color: "#181c1e",
                font: { size: 12 },
                // Full names live in the tooltip; keep axis labels short so narrow screens don't clip them
                callback: (_v, i) => {
                  const l = sorted[i]?.label ?? "";
                  return l.length > 18 ? l.slice(0, 17) + "…" : l;
                },
              },
              grid: { display: false },
              border: { display: false },
            },
          },
        }}
      />
    </div>
  );
}

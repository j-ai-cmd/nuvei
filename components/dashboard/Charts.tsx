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
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

interface VolumeChartProps {
  labels: string[];
  data: number[];
}

export function VolumeChart({ labels, data }: VolumeChartProps) {
  return (
    <div className="h-64 w-full relative">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Contracts Processed",
              data,
              borderColor: "#081f2c",
              backgroundColor: "rgba(8, 31, 44, 0.05)",
              borderWidth: 2,
              tension: 0.4,
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
            y: { beginAtZero: true, grid: { color: "rgba(195, 199, 204, 0.2)" }, border: { display: false } },
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
          <span className="text-[10px] text-on-surface-variant">Total</span>
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

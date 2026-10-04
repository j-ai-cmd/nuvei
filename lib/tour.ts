import { getMatters, getStoredHistory } from "@/lib/storage";

// Guided-demo progress, derived from what the viewer has actually done this session
const KEY = "legalai_tour";
type Flag = "viewedAnalysis" | "viewedDashboard";

function readFlags(): Partial<Record<Flag, boolean>> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function markTour(flag: Flag) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...readFlags(), [flag]: true }));
  } catch {
    // sessionStorage unavailable
  }
}

export function getTourProgress() {
  const flags = readFlags();
  return {
    analyzed: getStoredHistory().length > 0,
    viewedAnalysis: !!flags.viewedAnalysis,
    createdMatter: getMatters().length > 0,
    viewedDashboard: !!flags.viewedDashboard,
  };
}

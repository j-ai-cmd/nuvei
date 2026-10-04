import { NextRequest, NextResponse } from "next/server";

const TEAMS: Record<string, string> = {
  HIGH: "Senior Legal Review",
  CRITICAL: "General Counsel",
  MEDIUM: "Commercial Legal",
  LOW: "Legal (standard queue)",
};

function generateMatterId(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 900) + 100;
  return `LEG-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { contractType, counterparty, riskLevel } = body;

  const matterId = generateMatterId();
  const assignedTeam = TEAMS[riskLevel?.toUpperCase() ?? "MEDIUM"] ?? "Commercial Legal";

  return NextResponse.json({
    matterId,
    contractType: contractType ?? "Master Services Agreement",
    counterparty: counterparty ?? "Unknown",
    riskLevel: riskLevel ?? "MEDIUM",
    assignedTeam,
    status: "Open, awaiting attorney review",
    createdAt: new Date().toISOString(),
  });
}

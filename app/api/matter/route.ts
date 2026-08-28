import { NextRequest, NextResponse } from "next/server";

const TEAMS: Record<string, string> = {
  HIGH: "Legal — Senior Review",
  CRITICAL: "General Counsel",
  MEDIUM: "Legal — Commercial",
  LOW: "Legal — Standard",
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
  const assignedTeam = TEAMS[riskLevel?.toUpperCase() ?? "MEDIUM"] ?? "Legal — Commercial";

  return NextResponse.json({
    matterId,
    contractType: contractType ?? "Master Services Agreement",
    counterparty: counterparty ?? "Unknown",
    riskLevel: riskLevel ?? "MEDIUM",
    assignedTeam,
    status: "Open — Pending Attorney Review",
    createdAt: new Date().toISOString(),
  });
}

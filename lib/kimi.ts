import { ContractAnalysis, ContractAnalysisSchema } from "@/types/contract";

const KIMI_BASE_URL = "https://api.moonshot.cn/v1";

const SYSTEM_PROMPT = `You are a senior legal AI analyst specializing in contract review.
Analyze the provided contract text and return a structured JSON response.

CRITICAL RULES:
- NEVER invent or fabricate information. Use null when data is unavailable.
- Clearly distinguish extracted facts from AI observations.
- Return ONLY valid JSON — no markdown fences, no commentary, no explanation.
- All string fields can be null if not found in the contract.

Return this exact JSON structure:
{
  "metadata": {
    "contractTitle": string | null,
    "agreementType": string | null,
    "parties": [{ "name": string | null, "role": string | null }] | null,
    "effectiveDate": string | null,
    "expirationDate": string | null,
    "renewalTerms": string | null,
    "noticePeriod": string | null,
    "governingLaw": string | null,
    "jurisdiction": string | null,
    "contractValue": string | null,
    "currency": string | null,
    "paymentTerms": string | null,
    "fees": string | null,
    "terminationTerms": string | null,
    "liabilityCap": string | null,
    "indemnification": string | null,
    "confidentiality": string | null,
    "ipOwnership": string | null,
    "privacyDataProtection": string | null,
    "securityObligations": string | null,
    "auditRights": string | null,
    "assignment": string | null,
    "disputeResolution": string | null
  },
  "riskAnalysis": {
    "overallRiskScore": number (0-100),
    "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "risks": [
      {
        "title": string,
        "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        "explanation": string,
        "clause": string | null,
        "recommendedAction": string
      }
    ]
  },
  "executiveSummary": string,
  "keyObligations": [string],
  "keyDates": [{ "label": string, "date": string | null }],
  "top3Risks": [same structure as riskAnalysis.risks],
  "missingInformation": [string],
  "unusualClauses": [string],
  "recommendedLegalRouting": string,
  "disclaimer": "This is AI-assisted analysis for informational purposes only and does not constitute legal advice. All findings should be reviewed by qualified legal counsel before any action is taken."
}`;

function stripJsonFences(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function callKimi(text: string, jsonOnly = false): Promise<string> {
  const apiKey = process.env.KIMI_API_KEY;
  const model = process.env.KIMI_MODEL;

  if (!apiKey || !model) {
    throw new Error("KIMI_API_KEY and KIMI_MODEL must be set");
  }

  const userMessage = jsonOnly
    ? `Analyze this contract and return ONLY a valid JSON object (no markdown, no explanation):\n\n${text.slice(0, 60000)}`
    : `Analyze this contract:\n\n${text.slice(0, 60000)}`;

  const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function analyzeContract(
  text: string
): Promise<ContractAnalysis | null> {
  if (!process.env.KIMI_API_KEY || !process.env.KIMI_MODEL) {
    return null;
  }

  let raw: string;
  try {
    raw = await callKimi(text);
  } catch (e) {
    console.error("AI API call failed:", e);
    return null;
  }

  const cleaned = stripJsonFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.warn("JSON parse failed, retrying with json-only prompt");
    try {
      const retry = await callKimi(text, true);
      parsed = JSON.parse(stripJsonFences(retry));
    } catch (e) {
      console.error("Retry JSON parse failed:", e);
      return null;
    }
  }

  const result = ContractAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Zod validation failed:", result.error.issues);
    return null;
  }

  return result.data;
}

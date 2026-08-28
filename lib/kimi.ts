import { ContractAnalysis, ContractAnalysisSchema } from "@/types/contract";

const KIMI_BASE_URL = "https://api.moonshot.ai/v1";

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
    throw new Error("KIMI_API_KEY and KIMI_MODEL environment variables are not set");
  }

  const userMessage = jsonOnly
    ? `Analyze this contract and return ONLY a valid JSON object (no markdown, no explanation):\n\n${text.slice(0, 60000)}`
    : `Analyze this contract:\n\n${text.slice(0, 60000)}`;

  console.log(`[AI] Sending request to ${KIMI_BASE_URL}/chat/completions — model: ${model}`);

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

  console.log(`[AI] HTTP status: ${response.status}`);

  if (!response.ok) {
    const errBody = await response.text();
    console.error(`[AI] API error response: ${errBody}`);
    throw new Error(`AI API returned ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  console.log(`[AI] Response received — content length: ${content.length} chars`);
  return content;
}

/**
 * Returns null ONLY when no API key is configured (caller should use demo mode).
 * Throws an Error for all other failures (caller must NOT silently fall back to demo data).
 */
export async function analyzeContract(
  text: string
): Promise<ContractAnalysis | null> {
  const apiKey = process.env.KIMI_API_KEY;
  const model = process.env.KIMI_MODEL;

  if (!apiKey || !model) {
    console.log("[AI] No API key/model configured — returning null for demo fallback");
    return null;
  }

  // From here: API key exists. Any failure throws — callers must handle it as a real error.

  let raw: string;
  try {
    raw = await callKimi(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`AI API call failed: ${msg}`);
  }

  const cleaned = stripJsonFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
    console.log("[AI] JSON parse succeeded");
  } catch (parseErr) {
    console.warn("[AI] JSON parse failed on first attempt, retrying with json-only prompt");
    let retry: string;
    try {
      retry = await callKimi(text, true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`AI API retry call failed: ${msg}`);
    }
    try {
      parsed = JSON.parse(stripJsonFences(retry));
      console.log("[AI] JSON parse succeeded on retry");
    } catch {
      const originalErr = parseErr instanceof Error ? parseErr.message : String(parseErr);
      throw new Error(`AI response is not valid JSON after retry. Original parse error: ${originalErr}. Raw response (first 500 chars): ${cleaned.slice(0, 500)}`);
    }
  }

  const result = ContractAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
    console.error(`[AI] Zod validation failed: ${issues}`);
    throw new Error(`AI response failed validation: ${issues}`);
  }

  console.log("[AI] Zod validation passed — analysis complete");
  return result.data;
}

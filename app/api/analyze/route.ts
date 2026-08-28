export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/kimi";
import { extractPdfText } from "@/lib/extract-pdf";
import { extractDocxText } from "@/lib/extract-docx";
import { DEMO_CONTRACT_TEXT } from "@/lib/demo-contract";
import { DEMO_ANALYSIS } from "@/lib/demo-analysis";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const id = randomUUID();

  // Top-level catch: guarantee JSON responses even on unexpected crashes
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const isDemo = formData.get("demo") === "true";

    // ─── DEMO PATH ────────────────────────────────────────────────────────────
    // Only triggered when user clicks "Try Demo Contract".
    // Uses demo-analysis.ts as fallback ONLY when no API key is configured.
    if (isDemo) {
      console.log("[analyze] Demo path requested");
      let analysis = null;
      try {
        analysis = await analyzeContract(DEMO_CONTRACT_TEXT);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[analyze] Demo AI call failed:", msg);
        // Demo path: fall back to static demo analysis on failure
      }
      const processingTimeMs = Date.now() - startTime;
      return NextResponse.json({
        id,
        filename: "Demo_MSA_GlobalTech_Meridian.pdf",
        analysis: analysis ?? DEMO_ANALYSIS,
        isDemo: !analysis,
        processingTimeMs,
        analyzedAt: new Date().toISOString(),
      });
    }

    // ─── REAL UPLOAD PATH ─────────────────────────────────────────────────────
    // NEVER falls back to demo-analysis.ts. Returns a proper error if anything fails.

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 25MB limit" },
        { status: 400 }
      );
    }

    const filename = file.name;
    const isPdf =
      filename.toLowerCase().endsWith(".pdf") ||
      file.type === "application/pdf";
    const isDocx =
      filename.toLowerCase().endsWith(".docx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported" },
        { status: 400 }
      );
    }

    // ── Text extraction ───────────────────────────────────────────────────────
    let text: string;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(
        `[analyze] Extracting ${isPdf ? "PDF" : "DOCX"} "${filename}" — ${buffer.length} bytes`
      );
      text = isPdf
        ? await extractPdfText(buffer)
        : await extractDocxText(buffer);
      console.log(
        `[analyze] Extraction complete — ${text.length} characters extracted`
      );
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error("[analyze] Text extraction failed:", errorMsg);
      return NextResponse.json(
        {
          error:
            "Failed to extract text from the document. The file may be corrupted or password-protected.",
          detail: errorMsg,
        },
        { status: 422 }
      );
    }

    if (!text || text.length < 50) {
      console.error(
        `[analyze] Extracted text too short: ${text?.length ?? 0} chars`
      );
      return NextResponse.json(
        {
          error:
            "Could not extract meaningful text from the document. It may be a scanned image or empty.",
        },
        { status: 422 }
      );
    }

    // ── AI analysis ───────────────────────────────────────────────────────────
    // analyzeContract() returns null ONLY when no API key is configured.
    // It throws for all other failures (API errors, parse errors, Zod failures).
    let analysis;
    try {
      console.log("[analyze] Starting AI analysis");
      analysis = await analyzeContract(text);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error("[analyze] AI analysis failed:", errorMsg);
      return NextResponse.json(
        {
          error:
            "AI analysis failed. The document text was extracted successfully but the AI service returned an error.",
          detail: errorMsg,
        },
        { status: 502 }
      );
    }

    // analysis === null means no API key — inform the caller clearly
    if (analysis === null) {
      console.log("[analyze] No API key configured — cannot analyze real upload");
      return NextResponse.json(
        {
          error:
            "AI analysis is not configured. Set KIMI_API_KEY and KIMI_MODEL environment variables to enable real document analysis.",
        },
        { status: 503 }
      );
    }

    const processingTimeMs = Date.now() - startTime;
    console.log(
      `[analyze] Success — "${filename}" analyzed in ${processingTimeMs}ms`
    );

    return NextResponse.json({
      id,
      filename,
      analysis,
      isDemo: false,
      processingTimeMs,
      analyzedAt: new Date().toISOString(),
    });
  } catch (e) {
    // Catch-all: ensures we never serve an HTML Vercel error page
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("[analyze] Unhandled error:", errorMsg);
    return NextResponse.json(
      { error: "Internal server error", detail: errorMsg },
      { status: 500 }
    );
  }
}

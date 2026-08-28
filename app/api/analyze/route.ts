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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const isDemo = formData.get("demo") === "true";
  const id = randomUUID();

  if (isDemo) {
    const analysis = await analyzeContract(DEMO_CONTRACT_TEXT);
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
  const isPdf = filename.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
  const isDocx =
    filename.toLowerCase().endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isPdf && !isDocx) {
    return NextResponse.json(
      { error: "Only PDF and DOCX files are supported" },
      { status: 400 }
    );
  }

  let text: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`Extracting ${isPdf ? "PDF" : "DOCX"} - file size: ${buffer.length} bytes`);
    text = isPdf ? await extractPdfText(buffer) : await extractDocxText(buffer);
    console.log(`Extraction successful - extracted ${text.length} characters`);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("Text extraction failed:", errorMsg);
    console.error("Full error:", e);
    return NextResponse.json(
      {
        error: "Failed to extract text from the document. The file may be corrupted or password-protected.",
        debug: process.env.NODE_ENV === "development" ? errorMsg : undefined
      },
      { status: 422 }
    );
  }

  if (!text || text.length < 50) {
    return NextResponse.json(
      { error: "Could not extract meaningful text from the document. It may be a scanned image or empty." },
      { status: 422 }
    );
  }

  const analysis = await analyzeContract(text);
  const processingTimeMs = Date.now() - startTime;

  return NextResponse.json({
    id,
    filename,
    analysis: analysis ?? DEMO_ANALYSIS,
    isDemo: !analysis,
    processingTimeMs,
    analyzedAt: new Date().toISOString(),
  });
}

"use client";

import { useState } from "react";
import AnimatedFileUpload from "@/components/smoothui/animated-file-upload";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types/contract";
import { saveResult } from "@/lib/storage";
import { DEMO_ANALYSIS } from "@/lib/demo-analysis";
import ProcessingModal from "./ProcessingModal";
import { BorderBeam, Button, Icon } from "@/components/ui";

// Generates a stable UUID-like id
function makeId() {
  return "demo-" + Math.random().toString(36).slice(2, 10);
}

export default function UploadZone() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [filename, setFilename] = useState("");
  const [step, setStep] = useState(0);

  // ── Real upload path ────────────────────────────────────────────────────────
  // Full pipeline: file → extract → Kimi API → validate → analysis page
  async function submitFile(fd: FormData, name: string) {
    setFilename(name);
    setError(null);
    setProcessing(true);
    setStep(0);

    const stepTimer = setInterval(() => {
      setStep((s) => (s < 3 ? s + 1 : s));
    }, 1200);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      clearInterval(stepTimer);
      setStep(4);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Analysis failed");
      }

      const result: AnalysisResult = await res.json();
      saveResult(result);

      await new Promise((r) => setTimeout(r, 600));
      router.push(`/analysis/${result.id}`);
    } catch (e: unknown) {
      clearInterval(stepTimer);
      setProcessing(false);
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    }
  }

  // ── Demo path ───────────────────────────────────────────────────────────────
  // Pure frontend — no API calls. Animates steps 0→4 then navigates.
  async function handleDemo() {
    const id = makeId();
    const demoFilename = "Demo_MSA_GlobalTech_Meridian.pdf";
    setFilename(demoFilename);
    setProcessing(true);
    setStep(0);

    // Advance through steps 1-4 at 500ms each (step 0 shown instantly)
    for (let s = 1; s <= 4; s++) {
      await new Promise((r) => setTimeout(r, 500));
      setStep(s);
    }
    await new Promise((r) => setTimeout(r, 400));

    const result: AnalysisResult = {
      id,
      filename: demoFilename,
      analysis: DEMO_ANALYSIS,
      isDemo: true,
      processingTimeMs: 2800,
      analyzedAt: new Date().toISOString(),
    };
    saveResult(result);
    setProcessing(false);
    router.push(`/analysis/${id}`);
  }

  // wiring: AnimatedFileUpload only checks size, so enforce type here
  function handleFiles(files: File[]) {
    const file = files[files.length - 1];
    if (!file) return;
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError("Only PDF and DOCX files are accepted.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    submitFile(fd, file.name);
  }

  return (
    <>
      {processing && (
        <ProcessingModal filename={filename} currentStep={step} onCancel={() => setProcessing(false)} />
      )}

      <BorderBeam colorFrom="#ba0037" colorTo="#cfe5f7" duration={8} radius={12} className="rounded-xl">
        <div className="bg-surface-container-lowest rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-xl font-bold text-primary mb-1">Drop your contract here</h3>
          <p className="text-sm text-on-surface-variant mb-6">PDF / DOCX · Max 25MB</p>

          <AnimatedFileUpload
            accept=".pdf,.docx"
            maxSize={25 * 1024 * 1024}
            multiple={false}
            disabled={processing}
            onFilesSelected={handleFiles}
            className="w-full max-w-xl"
          />

          {error && (
            <div className="mt-6 px-4 py-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
              <Icon name="error" className="text-[18px]" />
              {error}
            </div>
          )}

          <div className="mt-8">
            <Button variant="danger" icon="science" onClick={handleDemo}>
              Try Demo Contract
            </Button>
          </div>
        </div>
      </BorderBeam>
    </>
  );
}

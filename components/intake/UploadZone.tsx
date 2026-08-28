"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { AnalysisResult, HistoryEntry } from "@/types/contract";
import ProcessingModal from "./ProcessingModal";

function saveToHistory(result: AnalysisResult) {
  try {
    const entry: HistoryEntry = {
      id: result.id,
      filename: result.filename,
      contractType: result.analysis.metadata.agreementType,
      counterparty: result.analysis.metadata.parties?.[0]?.name ?? null,
      riskLevel: result.analysis.riskAnalysis.riskLevel,
      riskScore: result.analysis.riskAnalysis.overallRiskScore,
      isDemo: result.isDemo,
      analyzedAt: result.analyzedAt,
      processingTimeMs: result.processingTimeMs,
    };
    const existing: HistoryEntry[] = JSON.parse(
      sessionStorage.getItem("legalai_history") ?? "[]"
    );
    existing.unshift(entry);
    sessionStorage.setItem("legalai_history", JSON.stringify(existing.slice(0, 50)));
  } catch {
    // sessionStorage unavailable
  }
}

export default function UploadZone() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [filename, setFilename] = useState("");
  const [step, setStep] = useState(0);

  async function submitFormData(fd: FormData, name: string) {
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
      try {
        sessionStorage.setItem(`legalai_result_${result.id}`, JSON.stringify(result));
      } catch {/* ignore */}
      saveToHistory(result);

      await new Promise((r) => setTimeout(r, 600));
      router.push(`/analysis/${result.id}`);
    } catch (e: unknown) {
      clearInterval(stepTimer);
      setProcessing(false);
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    }
  }

  const onDrop = useCallback(async (accepted: File[]) => {
    if (accepted.length === 0) return;
    const file = accepted[0];
    const fd = new FormData();
    fd.append("file", file);
    await submitFormData(fd, file.name);
  // submitFormData is stable — defined once per render via closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 25 * 1024 * 1024,
    noClick: true,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0];
      if (err?.code === "file-too-large") setError("File exceeds 25MB limit.");
      else if (err?.code === "file-invalid-type") setError("Only PDF and DOCX files are accepted.");
      else setError("File rejected. Please try again.");
    },
  });

  async function handleDemo() {
    const fd = new FormData();
    fd.append("demo", "true");
    await submitFormData(fd, "Demo_MSA_GlobalTech_Meridian.pdf");
  }

  return (
    <>
      {processing && (
        <ProcessingModal
          filename={filename}
          currentStep={step}
          onCancel={() => setProcessing(false)}
        />
      )}

      <div
        {...getRootProps()}
        className={`bg-surface-container-lowest border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] cursor-default transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
          <span className={`material-symbols-outlined text-4xl ${isDragActive ? "text-primary" : "text-on-surface-variant"}`}>
            cloud_upload
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">
          {isDragActive ? "Drop your contract here" : "Drop your contract here"}
        </h3>
        <p className="text-sm text-on-surface-variant mb-8">PDF / DOCX · Max 25MB</p>

        {error && (
          <div className="mb-6 px-4 py-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={open}
            className="bg-primary text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded hover:bg-primary/90 transition-colors"
          >
            Browse Files
          </button>
          <button
            onClick={handleDemo}
            className="border border-secondary text-secondary text-xs font-bold tracking-wider uppercase px-6 py-3 rounded hover:bg-secondary/5 transition-colors"
          >
            Try Demo Contract
          </button>
        </div>
      </div>
    </>
  );
}

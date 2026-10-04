"use client";

import AnimatedStepper from "@/components/smoothui/animated-stepper";

const STEPS = [
  { label: "Upload", description: "PDF or DOCX up to 25MB" },
  { label: "Extract", description: "Text read in memory" },
  { label: "AI analysis", description: "Metadata, obligations and dates" },
  { label: "Risk assessment", description: "Clause-level findings scored 0–100" },
  { label: "Matter ready", description: "One click creates a matter" },
];

export default function WorkflowStepper({ activeStep = 0 }: { activeStep?: number }) {
  return (
    <div className="pt-8">
      <h2 className="text-xs font-bold text-on-surface-variant mb-6 uppercase tracking-wider">Analysis workflow</h2>
      <AnimatedStepper steps={STEPS} defaultStep={activeStep} allowClickNavigation />
    </div>
  );
}

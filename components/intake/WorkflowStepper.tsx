"use client";

import AnimatedStepper from "@/components/smoothui/animated-stepper";

const STEPS = [
  { label: "Upload", description: "PDF or DOCX up to 25MB" },
  { label: "Extract", description: "Text and structure parsed in memory" },
  { label: "AI Analysis", description: "Metadata, obligations and dates" },
  { label: "Risk Assessment", description: "Clause-level findings scored 0–100" },
  { label: "Matter Ready", description: "One click to a CLM matter record" },
];

export default function WorkflowStepper({ activeStep = 0 }: { activeStep?: number }) {
  return (
    <div className="pt-8">
      <h4 className="text-xs font-bold text-on-surface-variant mb-6 uppercase tracking-wider">Analysis Workflow</h4>
      <AnimatedStepper steps={STEPS} defaultStep={activeStep} allowClickNavigation />
    </div>
  );
}

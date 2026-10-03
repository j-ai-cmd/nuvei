"use client";

import AILoader from "@/components/smoothui/ai-loader";
import AnimatedStepper from "@/components/smoothui/animated-stepper";
import { Button, Modal } from "@/components/ui";

interface ProcessingModalProps {
  filename: string;
  currentStep: number;
  onCancel?: () => void;
}

const STEPS = [
  { label: "Uploaded", description: "Document received" },
  { label: "Extract", description: "Reading document structure..." },
  { label: "Analyze", description: "Reviewing clauses and terms..." },
  { label: "Risk", description: "Scoring risk indicators..." },
  { label: "Matter", description: "Generating matter summary..." },
];

export default function ProcessingModal({ filename, currentStep, onCancel }: ProcessingModalProps) {
  return (
    <Modal isOpen onClose={() => onCancel?.()} size="full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Processing Contract</h2>
        <p className="text-sm text-on-surface-variant mt-2 truncate max-w-xs mx-auto">{filename}</p>
      </div>

      <div className="flex justify-center mb-6">
        <AILoader label={STEPS[Math.min(currentStep, STEPS.length - 1)].description} showElapsed />
      </div>

      <AnimatedStepper steps={STEPS} currentStep={Math.min(currentStep, STEPS.length - 1)} />

      {onCancel && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={onCancel}>
            Cancel Process
          </Button>
        </div>
      )}
    </Modal>
  );
}

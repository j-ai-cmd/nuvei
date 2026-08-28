"use client";

interface Step {
  label: string;
  sublabel?: string;
  status: "done" | "active" | "pending";
}

interface ProcessingModalProps {
  filename: string;
  currentStep: number;
  onCancel?: () => void;
}

const STEPS = [
  "Document uploaded",
  "Extracting contract text",
  "AI analyzing agreement",
  "Assessing legal risks",
  "Preparing matter record",
];

const SUBLABELS: Record<number, string> = {
  1: "Reading document structure...",
  2: "Reviewing clauses and terms...",
  3: "Scoring risk indicators...",
  4: "Generating matter summary...",
};

export default function ProcessingModal({ filename, currentStep, onCancel }: ProcessingModalProps) {
  const steps: Step[] = STEPS.map((label, i) => ({
    label,
    sublabel: SUBLABELS[i],
    status: i < currentStep ? "done" : i === currentStep ? "active" : "pending",
  }));

  return (
    <div className="fixed inset-0 bg-primary-container/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl w-full max-w-lg p-10 shadow-xl">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-4xl text-primary mb-4 block">neurology</span>
          <h1 className="text-2xl font-bold text-primary">Processing Contract</h1>
          <p className="text-sm text-on-surface-variant mt-2 truncate max-w-xs mx-auto">{filename}</p>
        </div>

        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-4 ${step.status === "pending" ? "opacity-40" : ""}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === "done"
                  ? "bg-surface-container-high text-primary"
                  : step.status === "active"
                  ? "bg-primary text-white pulse-active"
                  : "border border-outline"
              }`}>
                {step.status === "done" ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : step.status === "active" ? (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                ) : null}
              </div>
              <div>
                <p className={`text-sm font-semibold ${step.status === "active" ? "text-primary" : "text-on-background"}`}>
                  {step.label}
                </p>
                {step.status === "active" && step.sublabel && (
                  <p className="text-xs text-on-surface-variant mt-0.5">{step.sublabel}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {onCancel && (
          <div className="mt-8 text-center">
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-primary hover:bg-surface-variant/50 px-4 py-2 rounded transition-colors"
            >
              Cancel Process
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

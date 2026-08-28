const STEPS = ["Upload", "Extract", "AI Analysis", "Risk Assessment", "Matter Ready"];

export default function WorkflowStepper({ activeStep = 0 }: { activeStep?: number }) {
  return (
    <div className="pt-8">
      <h4 className="text-xs font-bold text-on-surface-variant mb-6 uppercase tracking-wider">
        Analysis Workflow
      </h4>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-4 w-full h-[1px] bg-outline-variant/20 z-0" />
        {STEPS.map((label, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-primary text-white"
                    : active
                    ? "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20"
                }`}
              >
                {done ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
              </div>
              <span className={`text-xs font-bold tracking-wider ${active || done ? "text-primary" : "text-on-surface-variant"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

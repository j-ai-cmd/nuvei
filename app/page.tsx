import UploadZone from "@/components/intake/UploadZone";
import WorkflowStepper from "@/components/intake/WorkflowStepper";
import Link from "next/link";

const RECENT_INTAKES = [
  { name: "MSA_TechCorp_Final.pdf", time: "2 hrs ago", status: "COMPLETED" },
  { name: "NDA_VendorXYZ.docx", time: "Yesterday", status: "COMPLETED" },
];

export default function IntakePage() {
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left column */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <header>
          <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">
            Analyze a contract in minutes.
          </h2>
          <p className="text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Upload a PDF or DOCX and automatically extract key terms, identify potential risks,
            and prepare structured data for legal review.
          </p>
        </header>

        <UploadZone />
        <WorkflowStepper activeStep={0} />
      </div>

      {/* Right column */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Recent Intakes</h3>
          <div className="space-y-3">
            {RECENT_INTAKES.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-primary truncate">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">{item.time}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
            Secure Processing
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            All documents are processed in memory and never written to disk. Data is not retained
            beyond the analysis session unless saved to a Matter.
          </p>
          <Link href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View Security Policy
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import AILoader from "@/components/smoothui/ai-loader";

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <AILoader label={label} variant="dots" />
    </div>
  );
}

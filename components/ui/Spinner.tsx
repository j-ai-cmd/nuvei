export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin-slow" />
        {label && <p className="text-sm text-on-surface-variant">{label}</p>}
      </div>
    </div>
  );
}

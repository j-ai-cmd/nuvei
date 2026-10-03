export default function LabeledValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <div className="text-sm font-semibold text-primary-container">{children}</div>
    </div>
  );
}

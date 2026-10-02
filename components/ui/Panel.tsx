// Flat content section used inside analysis views
export default function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-6">
      {title && <h3 className="text-xl font-bold text-primary mb-4">{title}</h3>}
      {children}
    </div>
  );
}

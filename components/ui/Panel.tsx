// Flat content section used inside analysis views
export default function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 p-5">
      {title && <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>}
      {children}
    </div>
  );
}

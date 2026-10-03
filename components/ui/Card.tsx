interface CardProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function Card({ title, action, className = "", children }: CardProps) {
  return (
    <section className={`bg-surface-container-lowest rounded-lg border border-outline-variant/50 p-5 ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4 gap-4">
          {title && <h2 className="text-xl font-bold text-primary-container">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

import { LinkButton } from "./Button";

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  // Renders the standard "New Intake" button unless overridden or set to null
  action?: React.ReactNode | null;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const right =
    action === undefined ? (
      <LinkButton href="/" icon="add">
        New Intake
      </LinkButton>
    ) : (
      action
    );
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-container mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-base text-on-surface-variant">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

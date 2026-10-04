import Icon from "./Icon";
import { LinkButton } from "./Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  cta?: { href: string; label: string };
  /** Use "h1" when the empty state is the whole page (not found, 404) */
  as?: "h1" | "h2";
}

export default function EmptyState({ icon, title, message, cta, as: Heading = "h2" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
      <Icon name={icon} className="text-5xl text-on-surface-variant mb-4" />
      <Heading className="text-xl font-bold text-primary mb-2">{title}</Heading>
      <p className="text-sm text-on-surface-variant mb-6">{message}</p>
      {cta && (
        <LinkButton href={cta.href} variant="dark">
          {cta.label}
        </LinkButton>
      )}
    </div>
  );
}

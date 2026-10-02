import Link from "next/link";
import Icon from "./Icon";

type Variant = "primary" | "dark" | "danger" | "secondary";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary-container text-white hover:bg-primary",
  dark: "bg-primary text-white hover:bg-primary/90",
  danger: "bg-secondary text-white hover:opacity-90 shadow-sm",
  secondary: "bg-surface-container-high text-on-surface hover:bg-surface-variant border border-outline-variant/10",
};

const BASE =
  "px-6 py-3 rounded flex items-center justify-center gap-2 transition-colors text-xs font-bold tracking-wider uppercase disabled:opacity-60";

interface CommonProps {
  variant?: Variant;
  icon?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  ...rest
}: CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} className="text-[18px]" />}
      {children}
    </button>
  );
}

export function LinkButton({ href, variant = "primary", icon, className = "", children }: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {icon && <Icon name={icon} className="text-[18px]" />}
      {children}
    </Link>
  );
}

// Small inline "View →" style link
export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`text-xs font-bold text-primary hover:text-primary/70 flex items-center gap-1 transition-colors ${className}`}
    >
      {children} <Icon name="arrow_forward" className="text-[14px]" />
    </Link>
  );
}

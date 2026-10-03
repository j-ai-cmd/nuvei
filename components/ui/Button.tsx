import Link from "next/link";
import SmoothButton, { smoothButtonVariants, type SmoothButtonProps } from "@/components/smoothui/smooth-button";
import MagneticButton from "@/components/smoothui/magnetic-button";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

type Variant = "primary" | "dark" | "danger" | "secondary";

// Nuvei tones expressed through SmoothButton's own --btn / --btn-hover / --btn-fg axis
const VARIANTS: Record<Variant, Pick<SmoothButtonProps, "variant" | "color"> & { className: string }> = {
  primary: {
    variant: "solid",
    className: "[--btn:var(--color-primary-container)] [--btn-hover:var(--color-primary)] [--btn-fg:#fff]",
  },
  dark: {
    variant: "solid",
    className: "[--btn:var(--color-primary)] [--btn-hover:var(--color-primary-container)] [--btn-fg:#fff]",
  },
  danger: { variant: "candy", color: "accent", className: "" },
  secondary: { variant: "outline", className: "hover:bg-surface-container-high" },
};

const BASE = "h-11 px-6 text-xs font-bold tracking-wider uppercase";

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
}: CommonProps & Omit<SmoothButtonProps, "className" | "children" | "variant" | "color" | "prefix">) {
  const v = VARIANTS[variant];
  return (
    <SmoothButton
      variant={v.variant}
      color={v.color}
      className={cn(BASE, v.className, className)}
      prefix={icon ? <Icon name={icon} className="text-[18px]" /> : undefined}
      {...rest}
    >
      {children}
    </SmoothButton>
  );
}

// Navigation CTA: MagneticButton pull, styled with SmoothButton's variant classes.
// MagneticButton runs its className through twMerge, so these win over its defaults.
export function LinkButton({ href, variant = "primary", icon, className = "", children }: CommonProps & { href: string }) {
  const v = VARIANTS[variant];
  return (
    <MagneticButton
      asChild
      radius={80}
      strength={0.25}
      className={cn(smoothButtonVariants({ variant: v.variant, color: v.color }), BASE, v.className, className)}
    >
      <Link href={href}>
        {icon && <Icon name={icon} className="text-[18px]" />}
        {children}
      </Link>
    </MagneticButton>
  );
}

// Small inline "View →" style link
export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group text-xs font-bold text-primary hover:text-primary/70 inline-flex items-center gap-1 transition-colors",
        className
      )}
    >
      {children} <Icon name="arrow_forward" className="text-[14px] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

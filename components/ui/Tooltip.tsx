import AnimatedTooltip, { type AnimatedTooltipPlacement } from "@/components/smoothui/animated-tooltip";

export default function Tooltip({
  content,
  placement = "top",
  children,
}: {
  content: React.ReactNode;
  placement?: AnimatedTooltipPlacement;
  children: React.ReactNode;
}) {
  return (
    <AnimatedTooltip content={content} placement={placement}>
      {children}
    </AnimatedTooltip>
  );
}

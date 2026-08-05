import type { HTMLAttributes } from "react";
import { SHIMMER_HOVER } from "./shimmerHover";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function GlassCard({
  className = "",
  interactive = true,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`relative
        overflow-hidden
        rounded-[28px]
        border-[1.5px]
        border-glass-border
        bg-glass
        bg-glass-bg
        backdrop-blur-[11px]
        backdrop-saturate-[240%]
        shadow-glass
        ${interactive ? SHIMMER_HOVER : ""} ${className}
        `}
      {...props}
    />
  );
}

import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function GlassCard({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative 
        rounded-[28px] 
        border-[1.5px] 
        border-glass-border 
        bg-glass 
        bg-glass-bg 
        backdrop-blur-[11px] 
        backdrop-saturate-[240%] 
        shadow-glass ${className}
        `}
      {...props}
    />
  );
}

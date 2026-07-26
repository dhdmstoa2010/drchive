import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function GlassCard({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative rounded-[28px] border-[1.5px] border-glass-border bg-glass bg-glass-bg backdrop-blur-[11px] backdrop-saturate-[240%] shadow-glass ${className}`}
      {...props}
    />
  );
}

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function PillButton({
  className = "",
  active = false,
  ...props
}: PillButtonProps) {
  return (
    <button
      className={`[font-family:inherit] text-sm font-semibold px-[18px] py-[9px] rounded-full backdrop-blur-[14px] backdrop-saturate-[180%] cursor-pointer transition-transform duration-150 ease-in-out whitespace-nowrap ${
        active
          ? "border border-white/50 bg-pill-active text-white shadow-pill-active"
          : "border-[1.5px] border-glass-border bg-glass-bg-soft text-ink-soft shadow-pill-idle"
      } ${className}`}
      {...props}
    />
  );
}

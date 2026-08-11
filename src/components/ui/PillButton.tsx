import type { ButtonHTMLAttributes } from "react";

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
      className={`[
        font-family:inherit] 
        text-sm 
        font-semibold
         px-[18px] 
         py-[9px] 
         rounded-full 
         backdrop-blur-[14px] 
         backdrop-saturate-[180%] 
         cursor-pointer 
         transition-transform 
         duration-150 
         ease-in-out
          whitespace-nowrap ${
            active
              ? "border border-white/50 bg-pill-active text-white shadow-pill-active"
              : "border-[1.5px] border-glass-border bg-glass-bg-soft text-ink-soft shadow-pill-idle"
          } ${className}`}
      {...props}
    />
  );
}

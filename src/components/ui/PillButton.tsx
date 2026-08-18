import type { ButtonHTMLAttributes } from "react";
import { Button } from "./style/PillButton.style";

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function PillButton({
  className = "",
  active = false,
  ...props
}: PillButtonProps) {
  return <Button className={className} $active={active} {...props} />;
}

import type { HTMLAttributes } from "react";
import { Card } from "./style/GlassCard.style";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function GlassCard({
  className = "",
  interactive = true,
  ...props
}: GlassCardProps) {
  return <Card className={className} $interactive={interactive} {...props} />;
}

import type { ReactNode } from "react";
import { Background } from "./style/PageBackground.style";

type PageBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return <Background className={className}>{children}</Background>;
}

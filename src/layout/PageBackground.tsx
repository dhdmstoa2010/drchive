import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { resolveThemeId } from "../styles/theme";
import { Background } from "./style/PageBackground.style";

type PageBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  const { currentUser } = useAuth();
  const themeId = resolveThemeId(currentUser?.themeColor);

  return (
    <Background className={className} $themeId={themeId}>
      {children}
    </Background>
  );
}

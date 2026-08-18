import type { ReactNode } from "react";
import { CenteredBackground, FormWrapper } from "./style/AuthLayout.style";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <CenteredBackground>
      <FormWrapper>{children}</FormWrapper>
    </CenteredBackground>
  );
}

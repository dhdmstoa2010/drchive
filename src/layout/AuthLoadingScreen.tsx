import { AuthLayout } from "./AuthLayout";
import { Spinner } from "../components/ui/Spinner";
import { SpinnerWrap } from "./style/AuthLoadingScreen.style";

export function AuthLoadingScreen() {
  return (
    <AuthLayout>
      <SpinnerWrap>
        <Spinner size={32} />
      </SpinnerWrap>
    </AuthLayout>
  );
}

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import {
  AuthCard,
  CardTitle,
  CardSubtitle,
  FormEl,
  StyledInput,
  ErrorText,
  SubmitButton,
  FooterText,
  FooterLink,
} from "./style/Login.style";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(username, password);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    navigate("/");
  }

  return (
    <AuthLayout>
      <AuthCard interactive={false}>
        <CardTitle>로그인</CardTitle>
        <CardSubtitle>아이디로 로그인해주세요.</CardSubtitle>

        <FormEl onSubmit={handleSubmit}>
          <StyledInput
            required
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <StyledInput
            type="password"
            required
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit" active disabled={submitting}>
            {submitting ? <Spinner size={16} /> : "로그인"}
          </SubmitButton>
        </FormEl>

        <FooterText>
          아직 계정이 없으신가요?{" "}
          <FooterLink to="/signup">회원가입</FooterLink>
        </FooterText>
      </AuthCard>
    </AuthLayout>
  );
}

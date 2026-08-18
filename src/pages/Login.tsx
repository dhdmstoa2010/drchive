import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { useAuth } from "../hooks/useAuth";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  }

  return (
    <AuthLayout>
      <AuthCard interactive={false}>
        <CardTitle>로그인</CardTitle>
        <CardSubtitle>학교 이메일로 로그인해주세요.</CardSubtitle>

        <FormEl onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            required
            placeholder="학교 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledInput
            type="password"
            required
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit" active>
            로그인
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

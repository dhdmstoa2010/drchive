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
  StyledSelect,
  SelectRow,
  ErrorText,
  SubmitButton,
  FooterText,
  FooterLink,
} from "./style/Signup.style";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [grade, setGrade] = useState(1);
  const [className, setClassName] = useState(1);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }
    const result = await signup({ name, email, password, grade, className });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  }

  return (
    <AuthLayout>
      <AuthCard interactive={false}>
        <CardTitle>회원가입</CardTitle>
        <CardSubtitle>학교 이메일 형식 확인 후 바로 가입돼요.</CardSubtitle>

        <FormEl onSubmit={handleSubmit}>
          <StyledInput
            required
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SelectRow>
            <StyledSelect
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
            >
              {[1, 2, 3].map((g) => (
                <option key={g} value={g}>
                  {g}학년
                </option>
              ))}
            </StyledSelect>
            <StyledSelect
              value={className}
              onChange={(e) => setClassName(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((c) => (
                <option key={c} value={c}>
                  {c}반
                </option>
              ))}
            </StyledSelect>
          </SelectRow>
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
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledInput
            type="password"
            required
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit" active>
            가입하기
          </SubmitButton>
        </FormEl>

        <FooterText>
          이미 계정이 있으신가요?{" "}
          <FooterLink to="/login">로그인</FooterLink>
        </FooterText>
      </AuthCard>
    </AuthLayout>
  );
}

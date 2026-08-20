import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import { Dropdown } from "../components/ui/Dropdown";
import {
  AuthCard,
  CardTitle,
  CardSubtitle,
  FormEl,
  StyledInput,
  SelectRow,
  ErrorText,
  SubmitButton,
  FooterText,
  FooterLink,
} from "./style/Signup.style";

const GRADE_OPTIONS = [1, 2, 3].map((g) => ({ value: g, label: `${g}학년` }));
const CLASS_OPTIONS = [1, 2, 3, 4, 5, 6].map((c) => ({
  value: c,
  label: `${c}반`,
}));

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
    const result = await signup({
      name,
      username,
      email,
      password,
      grade,
      className,
    });
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
        <CardSubtitle>
          학교 이메일로 재학생 여부만 확인해요. 로그인은 아이디로 해요.
        </CardSubtitle>

        <FormEl onSubmit={handleSubmit}>
          <StyledInput
            required
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SelectRow>
            <Dropdown value={grade} onChange={setGrade} options={GRADE_OPTIONS} />
            <Dropdown
              value={className}
              onChange={setClassName}
              options={CLASS_OPTIONS}
            />
          </SelectRow>
          <StyledInput
            required
            placeholder="아이디 (로그인에 사용, 영문/숫자/밑줄 4~20자)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <StyledInput
            type="email"
            required
            placeholder="학교 이메일 (@dsm.hs.kr)"
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

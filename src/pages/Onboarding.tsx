import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PillButton } from "../components/ui/PillButton";
import { AuthLayout } from "../layout/AuthLayout";
import { saveJSON } from "../backend/lib/storage";
import {
  OnboardingCard,
  ProgressRow,
  ProgressSegment,
  StepTitle,
  StepDescription,
  NavRow,
  BackButton,
  StepButtonRow,
} from "./style/Onboarding.style";

const STEPS = [
  {
    title: "Drchive에 오신 걸 환영해요",
    description:
      "우리 학교의 순간들을 타임라인과 지도로 함께 기록하고 나누는 공간이에요.",
  },
  {
    title: "학교 이메일로 간편하게",
    description:
      "학교 이메일과 비밀번호만 있으면 바로 시작할 수 있어요. 학년/반 정보로 또래 친구들과 추억을 나눠보세요.",
  },
  {
    title: "타임캡슐, 연대기, 익명 태깅까지",
    description:
      "친구에게 타임캡슐을 봉인하고, 학기 요약을 확인하고, 얼굴을 가린 사진에 익명으로 친구를 태그해보세요.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isLast = step === STEPS.length - 1;

  function finish(target: "login" | "signup") {
    saveJSON("onboarded", true);
    navigate(`/${target}`);
  }

  return (
    <AuthLayout>
      <OnboardingCard interactive={false}>
        <ProgressRow>
          {STEPS.map((_, i) => (
            <ProgressSegment key={i} $active={i <= step} />
          ))}
        </ProgressRow>

        <div>
          <StepTitle>{STEPS[step].title}</StepTitle>
          <StepDescription>{STEPS[step].description}</StepDescription>
        </div>

        <NavRow>
          <BackButton
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            이전
          </BackButton>

          {isLast ? (
            <StepButtonRow>
              <PillButton type="button" onClick={() => finish("login")}>
                로그인하기
              </PillButton>
              <PillButton type="button" active onClick={() => finish("signup")}>
                회원가입
              </PillButton>
            </StepButtonRow>
          ) : (
            <PillButton type="button" active onClick={() => setStep((s) => s + 1)}>
              다음
            </PillButton>
          )}
        </NavRow>
      </OnboardingCard>
    </AuthLayout>
  );
}

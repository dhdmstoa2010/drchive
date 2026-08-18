import styled from "@emotion/styled";
import { colors } from "../../styles/theme";
import { GlassCard } from "../../components/ui/GlassCard";

export const OnboardingCard = styled(GlassCard)`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ProgressRow = styled.div`
  display: flex;
  gap: 6px;
`;

export const ProgressSegment = styled.div<{ $active: boolean }>`
  height: 6px;
  flex: 1;
  border-radius: 9999px;
  background: ${({ $active }) => ($active ? colors.lavenderDeep : colors.glassBgSoft)};
`;

export const StepTitle = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const StepDescription = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 12px;
  line-height: 1.625;
`;

export const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const BackButton = styled.button`
  font-family: inherit;
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  cursor: pointer;

  &:disabled {
    opacity: 0;
  }
`;

export const StepButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

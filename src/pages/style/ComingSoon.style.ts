import styled from "@emotion/styled";
import { colors } from "../../styles/theme";
import { GlassCard } from "../../components/ui/GlassCard";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const PageTitle = styled.div`
  font-size: 38px;
  font-weight: 800;
  color: #0d0d0d;
  letter-spacing: -0.6px;
  word-break: keep-all;
`;

export const PageSubtitle = styled.div`
  font-size: 16px;
  color: ${colors.inkSoft};
  font-weight: 400;
  margin-top: 8px;
  word-break: keep-all;
  white-space: normal;
  max-width: 520px;
`;

export const PlaceholderCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${colors.inkSoft};
  font-weight: 600;
`;

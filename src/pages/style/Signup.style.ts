import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { colors } from "../../styles/theme";
import { PillButton } from "../../components/ui/PillButton";
import { GlassCard } from "../../components/ui/GlassCard";

export const AuthCard = styled(GlassCard)`
  padding: 32px;
`;

export const CardTitle = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const CardSubtitle = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 6px;
`;

export const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const fieldStyles = css`
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1.5px solid ${colors.glassBorder};
  background: ${colors.glassBgSoft};
  font-size: 14px;
  color: ${colors.ink};
  outline: none;
  font-family: inherit;
`;

export const StyledInput = styled.input`
  ${fieldStyles}
`;

export const StyledSelect = styled.select`
  ${fieldStyles}
`;

export const SelectRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const ErrorText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
`;

export const SubmitButton = styled(PillButton)`
  width: 100%;
  margin-top: 4px;
  text-align: center;
`;

export const FooterText = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 20px;
  text-align: center;
`;

export const FooterLink = styled(Link)`
  font-weight: 700;
  color: ${colors.lavenderDeep};
`;

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors } from "../../styles/theme";

const fieldStyles = css`
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1.5px solid ${colors.glassBorder};
  background: ${colors.glassBgSoft};
  font-family: inherit;
  font-size: 14px;
  color: ${colors.ink};
  outline: none;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:focus {
    border-color: ${colors.lavender};
    background: #fff;
  }
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const DoneWrap = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DoneText = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

export const Select = styled.select`
  ${fieldStyles}
  cursor: pointer;
`;

export const Textarea = styled.textarea`
  ${fieldStyles}
  resize: none;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

export const CancelButton = styled.button`
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  padding: 0 12px;
  background: none;
  border: none;
  cursor: pointer;
`;

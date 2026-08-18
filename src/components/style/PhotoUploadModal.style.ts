import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors } from "../../styles/theme";

const fieldStyles = css`
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1.5px solid ${colors.glassBorder};
  background: ${colors.glassBgSoft};
  font-size: 14px;
  color: ${colors.ink};
  outline: none;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const Subtitle = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 4px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

export const Select = styled.select`
  ${fieldStyles}
`;

export const TextInput = styled.input`
  ${fieldStyles}
`;

export const FileInput = styled.input`
  font-size: 14px;
  color: ${colors.inkSoft};
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
`;

export const ErrorText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

export const CancelButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  padding: 0 12px;
  cursor: pointer;
`;

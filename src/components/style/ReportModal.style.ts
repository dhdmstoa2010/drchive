import styled from "@emotion/styled";
import { colors } from "../../styles/theme";
import { fieldStyles, selectStyles } from "../../styles/select";

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
  ${selectStyles}
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

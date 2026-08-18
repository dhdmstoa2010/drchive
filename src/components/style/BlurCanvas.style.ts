import styled from "@emotion/styled";
import { colors } from "../../styles/theme";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: ${colors.inkSoft};
`;

export const LoadingText = styled.div`
  font-size: 14px;
  color: ${colors.inkFaint};
  padding: 40px 0;
  text-align: center;
`;

export const StyledCanvas = styled.canvas`
  border-radius: 16px;
  cursor: crosshair;
  margin-left: auto;
  margin-right: auto;
  border: 1.5px solid ${colors.glassBorder};
  display: block;
`;

export const UndoButton = styled.button`
  font-family: inherit;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.inkFaint};
  background: none;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
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

export const ConfirmButton = styled.button`
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: ${colors.lavenderDeep};
  padding: 10px 20px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
`;

import styled from "@emotion/styled";
import { colors } from "../../styles/theme";

export const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const Description = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 8px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  padding: 0 12px;
  cursor: pointer;
`;

export const ConfirmButton = styled.button<{ $danger: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  padding: 10px 20px;
  border-radius: 9999px;
  cursor: pointer;
  background: ${(props) =>
    props.$danger ? colors.coralDeep : colors.lavenderDeep};
`;

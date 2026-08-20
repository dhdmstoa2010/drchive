import styled from "@emotion/styled";
import { colors } from "../../../styles/theme";

export const Row = styled.div`
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1.5px solid rgba(70, 55, 50, 0.16);
  border-radius: 9999px;
  background: #fff;
`;

export const Option = styled.button<{ $active: boolean }>`
  flex: 1;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 10px;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 150ms ease,
    color 150ms ease;
  color: ${({ $active }) => ($active ? "#fff" : colors.inkFaint)};
  background: ${({ $active }) =>
    $active ? colors.lavenderDeep : "transparent"};

  &:hover {
    background: ${({ $active }) => ($active ? colors.lavenderDeep : colors.lavenderBg)};
  }
`;

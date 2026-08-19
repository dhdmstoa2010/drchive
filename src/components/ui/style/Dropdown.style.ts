import styled from "@emotion/styled";
import { colors } from "../../../styles/theme";
import { fieldStyles } from "../../../styles/select";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Trigger = styled.button<{ $open: boolean }>`
  ${fieldStyles}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  text-align: left;

  ${({ $open }) =>
    $open &&
    `
    border-color: ${colors.lavender};
    box-shadow: 0 0 0 3px ${colors.lavenderBg};
    `}
`;

export const TriggerLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Chevron = styled.svg<{ $open: boolean }>`
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  color: #847a75;
  transition: transform 150ms ease;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 240px;
  overflow-y: auto;
  background: #fff;
  border: 1.5px solid rgba(70, 55, 50, 0.16);
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(20, 20, 30, 0.16);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Option = styled.button<{ $selected: boolean }>`
  font-family: inherit;
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  text-align: left;
  padding: 9px 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ $selected }) => ($selected ? colors.lavenderDeep : colors.ink)};
  background: ${({ $selected }) =>
    $selected ? colors.lavenderBg : "transparent"};

  &:hover {
    background: ${colors.lavenderBg};
  }
`;

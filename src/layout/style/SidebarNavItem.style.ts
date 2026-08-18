import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors, shadows } from "../../styles/theme";

export const NavItem = styled.div<{ $expanded: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  border-radius: 14px;
  padding: 11px 0;
  transition: all 180ms ease-in-out;
  ${({ $expanded }) =>
    $expanded
      ? css`
          padding-left: 14px;
          padding-right: 14px;
          justify-content: flex-start;
        `
      : css`
          justify-content: center;
        `}
  ${({ $active }) =>
    $active
      ? css`
          background-color: ${colors.tabActiveBg};
          box-shadow: ${shadows.tabActive};
        `
      : css`
          background-color: transparent;
          box-shadow: none;
        `}
`;

export const IconWrap = styled.div<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.75)")};
`;

export const Label = styled.div<{ $active: boolean }>`
  font-size: 14px;
  white-space: nowrap;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.75)")};
`;

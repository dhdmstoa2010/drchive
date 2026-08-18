import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors, shadows, gradients } from "../../../styles/theme";

export const Button = styled.button<{ $active: boolean }>`
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 9999px;
  backdrop-filter: blur(14px) saturate(180%);
  cursor: pointer;
  transition: transform 150ms ease-in-out;
  white-space: nowrap;
  ${({ $active }) =>
    $active
      ? css`
          border: 1px solid rgba(255, 255, 255, 0.5);
          background-image: ${gradients.pillActive};
          color: #fff;
          box-shadow: ${shadows.pillActive};
        `
      : css`
          border: 1.5px solid ${colors.glassBorder};
          background-color: ${colors.glassBgSoft};
          color: ${colors.inkSoft};
          box-shadow: ${shadows.pillIdle};
        `}
`;

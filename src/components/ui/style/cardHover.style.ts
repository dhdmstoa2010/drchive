import { css } from "@emotion/react";

export const cardHover = css`
  transition:
    background-color 200ms ease,
    box-shadow 200ms ease;

  &:hover {
    background-color: rgba(20, 30, 45, 0.07);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 10px 24px rgba(20, 30, 45, 0.16);
  }
`;

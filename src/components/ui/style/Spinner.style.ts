import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinnerRing = styled.span<{ $size: number }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  opacity: 0.9;
  animation: ${spin} 0.7s linear infinite;
`;

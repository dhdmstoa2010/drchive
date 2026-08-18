import styled from "@emotion/styled";
import { colors, shadows, gradients } from "../../../styles/theme";
import { cardHover } from "./cardHover.style";

export const Card = styled.div<{ $interactive: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  border: 1.5px solid ${colors.glassBorder};
  background-image: ${gradients.glass};
  background-color: ${colors.glassBg};
  backdrop-filter: blur(11px) saturate(240%);
  box-shadow: ${shadows.glass};
  ${({ $interactive }) => ($interactive ? cardHover : "")}
`;

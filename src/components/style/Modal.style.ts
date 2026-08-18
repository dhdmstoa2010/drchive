import styled from "@emotion/styled";
import { colors, shadows } from "../../styles/theme";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
`;

export const Panel = styled.div<{ $maxWidth: string }>`
  position: relative;
  width: 100%;
  max-width: ${(props) => props.$maxWidth};
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 28px;
  border: 1.5px solid ${colors.glassBorder};
  background: #fff;
  box-shadow: ${shadows.glass};
  padding: 28px;
`;

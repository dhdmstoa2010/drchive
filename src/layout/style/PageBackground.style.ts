import styled from "@emotion/styled";
import { backgroundThemes, type BackgroundThemeId } from "../../styles/theme";

export const Background = styled.div<{ $themeId: BackgroundThemeId }>`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  background-image: ${(props) => backgroundThemes[props.$themeId].gradient};
  font-family: -apple-system, system-ui, sans-serif;
  transition: background-image 300ms ease;
`;

import styled from "@emotion/styled";
import { backgroundThemes, gradients, shadows, type BackgroundThemeId } from "../../styles/theme";

export const SidebarContainer = styled.div<{
  $expanded: boolean;
  $themeId: BackgroundThemeId;
}>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 16px;
  box-sizing: border-box;
  transition: width 220ms ease-in-out, background-image 300ms ease;
  background-image: ${({ $themeId }) => backgroundThemes[$themeId].sidebar};
  backdrop-filter: blur(30px) saturate(200%);
  border-right: 1.5px solid rgba(255, 255, 255, 0.4);
  box-shadow: ${shadows.sidebar};
  width: ${({ $expanded }) => ($expanded ? "240px" : "84px")};
`;

export const TopBar = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
  justify-content: ${({ $expanded }) => ($expanded ? "space-between" : "center")};
`;

export const Logo = styled.div`
  font-size: 19px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  font-style: italic;
`;

export const IconControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ToggleButton = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Chevron = styled.svg<{ $expanded: boolean }>`
  transition: transform 220ms ease-in-out;
  transform: ${({ $expanded }) => ($expanded ? "none" : "rotate(180deg)")};
`;

export const ProfileCard = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  justify-content: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
`;

export const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  flex-shrink: 0;
  background-image: ${({ $imageUrl }) =>
    $imageUrl ? `url(${$imageUrl})` : gradients.avatar};
  background-size: cover;
  background-position: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileText = styled.div`
  min-width: 0;
`;

export const ProfileName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
`;

export const ProfileMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 2px;
  white-space: nowrap;
`;

export const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

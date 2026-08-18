import styled from "@emotion/styled";
import { GlassCard } from "../ui/GlassCard";
import { colors, gradients } from "../../styles/theme";

export const StyledCard = styled(GlassCard)`
  overflow: hidden;
  cursor: pointer;
`;

export const ImageWrap = styled.div<{ $placeIndex: number }>`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  height: 200px;
  border-radius: 28px 28px 0 0;
  background-image: ${(props) => gradients.place[props.$placeIndex % 4]};
`;

export const PhotoImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PlaceTag = styled.div`
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: rgba(60, 40, 70, 0.55);
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 10px;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
  white-space: nowrap;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 18px;
`;

export const PlaceName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const PlaceMeta = styled.div`
  font-size: 13px;
  color: ${colors.inkFaint};
  margin-top: 3px;
`;

export const SemesterTag = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.lavenderDeep};
  background: ${colors.lavenderBg};
  padding: 4px 10px;
  border-radius: 9999px;
  white-space: nowrap;
`;

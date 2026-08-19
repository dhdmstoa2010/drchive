import styled from "@emotion/styled";
import { colors, gradients } from "../../styles/theme";
import { GlassCard } from "../../components/ui/GlassCard";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

export const PageTitle = styled.div`
  font-size: 38px;
  font-weight: 800;
  color: #0d0d0d;
  letter-spacing: -0.6px;
  word-break: keep-all;
`;

export const PageSubtitle = styled.div`
  font-size: 16px;
  color: ${colors.inkSoft};
  font-weight: 400;
  margin-top: 8px;
  word-break: keep-all;
  white-space: normal;
  max-width: 520px;
`;

export const SemesterRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const SummaryCard = styled(GlassCard)`
  padding: 28px;
`;

export const SummaryText = styled.div`
  font-size: 14px;
  color: ${colors.ink};
  line-height: 1.625;
`;

export const PlaceTagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const PlaceTag = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.inkSoft};
  background: ${colors.glassBgSoft};
  padding: 6px 12px;
  border-radius: 9999px;
`;

export const StoryCard = styled(GlassCard)`
  overflow: hidden;
  padding: 0;
`;

export const StoryImageWrap = styled.div<{ $placeIndex: number }>`
  position: relative;
  height: 380px;
  background-image: ${({ $placeIndex }) => gradients.place[$placeIndex % 4]};
`;

export const StoryImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StoryOverlay = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  padding: 24px 64px 20px 28px;
  background: linear-gradient(
    0deg,
    rgba(20, 20, 30, 0.75) 0%,
    rgba(20, 20, 30, 0.4) 55%,
    transparent 100%
  );
  color: #fff;
`;

export const StoryCounter = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
`;

export const StoryPlace = styled.div`
  font-size: 22px;
  font-weight: 800;
  margin-top: 4px;
  word-break: keep-all;
`;

export const StoryMeta = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4px;
`;

export const StoryDescription = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 8px;
  line-height: 1.5;
  max-width: 60ch;
`;

export const StoryNavButton = styled.button<{ $side: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === "left" ? "left: 14px;" : "right: 14px;")}
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  color: ${colors.ink};
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition:
    background-color 150ms ease,
    opacity 150ms ease;

  &:hover:not(:disabled) {
    background: #fff;
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

export const StoryFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 16px 24px;
`;

export const StoryDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "20px" : "6px")};
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? colors.lavenderDeep : "rgba(70, 55, 50, 0.18)"};
  transition:
    width 200ms ease,
    background-color 200ms ease;
`;

export const HighlightsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const EmptyStateCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${colors.inkSoft};
  font-weight: 600;
`;

export const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

export const HighlightCard = styled(GlassCard)`
  overflow: hidden;
`;

export const HighlightImageWrapper = styled.div<{ $placeIndex: number }>`
  position: relative;
  height: 160px;
  background: ${({ $placeIndex }) => gradients.place[$placeIndex % 4]};
`;

export const HighlightImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const HighlightInfo = styled.div`
  padding: 12px 16px;
`;

export const HighlightPlace = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const HighlightMeta = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 2px;
`;

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

export const EmptyHighlightsCard = styled(GlassCard)`
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

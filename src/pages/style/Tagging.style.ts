import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { GlassCard } from "../../components/ui/GlassCard";
import { colors } from "../../styles/theme";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const PageHeaderRow = styled.div`
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
  font-weight: 400;
  color: ${colors.inkSoft};
  margin-top: 8px;
  word-break: keep-all;
  white-space: normal;
  max-width: 520px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const EmptyState = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  color: ${colors.inkSoft};
  font-weight: 600;
`;

export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

export const PostCard = styled(GlassCard)`
  overflow: hidden;
  cursor: pointer;
`;

export const PostThumb = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

export const PostCaption = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.ink};
`;

/* shared form field */
export const Input = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 9999px;
  border: 1.5px solid ${colors.glassBorder};
  background: ${colors.glassBgSoft};
  font-size: 14px;
  color: ${colors.ink};
  outline: none;
`;

/* NewPostModal */
export const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const Subtitle = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 4px;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

export const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.inkFaint};
  margin-bottom: 6px;
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const UploadZone = styled.label<{ $hasPreview: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px dashed ${colors.glassBorder};
  background: ${colors.glassBgSoft};
  color: ${colors.inkFaint};
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:hover {
    border-color: ${colors.lavender};
    background: ${colors.lavenderBg};
  }

  ${({ $hasPreview }) =>
    $hasPreview &&
    css`
      border-style: solid;
      border-color: ${colors.glassBorder};
    `}
`;

export const UploadIcon = styled.span`
  font-size: 22px;
  line-height: 1;
`;

export const UploadHint = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

export const PhotoRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PhotoThumbButton = styled.button`
  width: 80px;
  height: 80px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  border: 1.5px solid ${colors.glassBorder};
  transition: opacity 150ms ease;

  &:hover {
    opacity: 0.85;
  }
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BlurWrap = styled.div`
  margin-top: 20px;
`;

/* PostDetailModal */
export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const MetaText = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 4px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
`;

export const BlockButton = styled.button`
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.inkFaint};
  background: none;
  border: none;
  cursor: pointer;
`;

export const ReportButton = styled.button`
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
  background: none;
  border: none;
  cursor: pointer;
`;

export const ImageFrame = styled.div`
  position: relative;
  margin-top: 20px;
  border-radius: 16px;
  overflow: hidden;
  cursor: crosshair;
  user-select: none;
`;

export const PostImage = styled.img`
  width: 100%;
  display: block;
`;

export const TagMarker = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
`;

export const TagLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: oklch(0.26 0.015 55 / 0.8);
  padding: 4px 8px;
  border-radius: 9999px;
  white-space: nowrap;
`;

export const PendingMarker = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
`;

export const PendingDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: ${colors.coral};
  border: 2px solid white;
`;

export const SuggestRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

export const PendingSection = styled.div`
  margin-top: 20px;
`;

export const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.ink};
  margin-bottom: 8px;
`;

export const EmptyNote = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
`;

export const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PendingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${colors.glassBgSoft};
  border-radius: 16px;
  padding: 10px 16px;
`;

export const PendingItemText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.ink};
`;

export const PendingItemActions = styled.div`
  display: flex;
  gap: 6px;
`;

export const ApproveButton = styled.button`
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: ${colors.lavenderDeep};
  padding: 6px 12px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
`;

export const RejectButton = styled.button`
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: ${colors.inkSoft};
  background: #fff;
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1.5px solid ${colors.glassBorder};
  cursor: pointer;
`;

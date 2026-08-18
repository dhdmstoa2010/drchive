import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { GlassCard } from "../../components/ui/GlassCard";
import { PillButton } from "../../components/ui/PillButton";
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

export const TabRow = styled.div`
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

export const CapsuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

export const CapsuleCard = styled(GlassCard)`
  padding: 20px;
  cursor: pointer;
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusIcon = styled.div`
  font-size: 24px;
`;

export const StatusBadge = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.lavenderDeep};
  background: ${colors.lavenderBg};
  padding: 4px 10px;
  border-radius: 9999px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.ink};
  margin-top: 12px;
`;

export const CardMeta = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 4px;
`;

/* shared form field styles, applied to different element tags */
const fieldStyles = css`
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1.5px solid rgba(70, 55, 50, 0.16);
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  color: ${colors.ink};
  outline: none;
  box-shadow: 0 1px 2px rgba(20, 20, 30, 0.05);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
  -webkit-appearance: none;
  appearance: none;

  &:hover {
    border-color: ${colors.lavender};
  }

  &:focus {
    border-color: ${colors.lavender};
    box-shadow: 0 0 0 3px ${colors.lavenderBg};
  }
`;

export const SelectField = styled.select`
  ${fieldStyles}
  cursor: pointer;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23847a75' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 15px;
`;

export const MessageTextArea = styled.textarea`
  ${fieldStyles}
  resize: none;
`;

export const DateField = styled.input`
  ${fieldStyles}
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    border-radius: 4px;
    padding: 3px;
    opacity: 0.85;
    transition:
      opacity 150ms ease,
      background-color 150ms ease;
  }

  &::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
    background-color: ${colors.lavenderBg};
  }
`;

/* shared modal text */
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

export const PhotoRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* SealModal */
export const NoRecipientsNote = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 24px;
`;

export const SealForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

export const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.inkFaint};
  margin-bottom: 6px;
`;

export const PhotoThumbButton = styled.button<{ $selected: boolean }>`
  position: relative;
  width: 64px;
  height: 64px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  box-shadow: 0 1px 2px rgba(20, 20, 30, 0.05);
  border: 2px solid
    ${({ $selected }) =>
      $selected ? colors.lavenderDeep : "rgba(70, 55, 50, 0.16)"};
  transition:
    border-color 150ms ease,
    opacity 150ms ease;

  &:hover {
    opacity: 0.85;
  }
`;

export const PlaceholderThumb = styled.div`
  width: 100%;
  height: 100%;
  background: ${colors.lavenderBg};
`;

export const ErrorText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

export const CancelButton = styled.button`
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  padding: 0 12px;
  background: none;
  border: none;
  cursor: pointer;
`;

/* DetailModal */
export const LockedState = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;
  text-align: center;
`;

export const LockIcon = styled.div`
  font-size: 36px;
`;

export const LockedTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const LockedHint = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
`;

export const ContentSection = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MessageBox = styled.div`
  font-size: 14px;
  color: ${colors.ink};
  white-space: pre-wrap;
  line-height: 1.625;
  background: ${colors.glassBgSoft};
  border-radius: 16px;
  padding: 16px;
`;

export const AttachedPhoto = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.lavenderBg};
`;

export const OpenButton = styled(PillButton)`
  align-self: flex-start;
`;

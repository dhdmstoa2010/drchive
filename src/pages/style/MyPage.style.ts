import styled from "@emotion/styled";
import { colors, gradients } from "../../styles/theme";
import { fieldStyles, selectStyles } from "../../styles/select";
import { GlassCard } from "../../components/ui/GlassCard";
import { PillButton } from "../../components/ui/PillButton";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
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
`;

export const ProfileCard = styled(GlassCard)`
  padding: 28px;
`;

export const ProfileHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

export const ProfileIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  background: ${gradients.avatar};
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ProfileName = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const ProfileMeta = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 4px;
`;

export const EditFieldsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FieldInput = styled.input`
  ${fieldStyles}
  width: auto;
`;

export const FieldSelect = styled.select`
  ${selectStyles}
  width: auto;
`;

export const ProfileActionsRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const CancelButton = styled.button`
  font-family: inherit;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  padding: 0 12px;
  cursor: pointer;
`;

export const AccountActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 24px;
`;

export const WithdrawButton = styled.button`
  font-family: inherit;
  background: none;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
  padding: 10px 16px;
  border-radius: 9999px;
  border: 1.5px solid ${colors.coral};
  cursor: pointer;
`;

export const ThemeCard = styled(GlassCard)`
  padding: 20px 24px;
`;

export const ThemeErrorText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
  margin-top: 10px;
`;

export const ThemeSwatchRow = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

export const ThemeSwatchButton = styled.button<{
  $background: string;
  $active: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &::before {
    content: "";
    display: block;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background-image: ${({ $background }) => $background};
    box-shadow: ${({ $active }) =>
      $active
        ? `0 0 0 3px #fff, 0 0 0 5px ${colors.lavenderDeep}`
        : "0 0 0 2px rgba(255,255,255,0.8)"};
    transition: box-shadow 150ms ease;
  }
`;

export const ThemeSwatchLabel = styled.span<{ $active: boolean }>`
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? colors.lavenderDeep : colors.inkFaint)};
`;

export const Section = styled.div``;

export const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
  margin-bottom: 12px;
`;

export const EmptyCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: ${colors.inkSoft};
  font-size: 14px;
  font-weight: 600;
`;

export const EmptyPhotoCard = styled(EmptyCard)`
  height: 120px;
`;

export const PhotoGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PhotoThumb = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.lavenderBg};
`;

export const PhotoThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CapsuleCard = styled(GlassCard)`
  padding: 20px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

export const CapsuleStatValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const CapsuleStatLabel = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 4px;
`;

export const CapsuleLinkButton = styled(PillButton)`
  margin-left: auto;
`;

export const ListColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItemCard = styled(GlassCard)`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ListItemText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.ink};
`;

const STATUS_COLORS: Record<string, { color: string; background: string }> = {
  approved: { color: colors.lavenderDeep, background: colors.lavenderBg },
  rejected: {
    color: colors.coralDeep,
    background: "rgba(230, 110, 80, 0.12)",
  },
  pending: { color: colors.inkFaint, background: colors.glassBgSoft },
};

export const StatusTag = styled.div<{ $status: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  color: ${({ $status }) => STATUS_COLORS[$status]?.color ?? colors.inkFaint};
  background: ${({ $status }) =>
    STATUS_COLORS[$status]?.background ?? colors.glassBgSoft};
`;

export const UnblockButton = styled.button`
  font-family: inherit;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.lavenderDeep};
  cursor: pointer;
`;

export const ReportCard = styled(GlassCard)`
  padding: 12px 16px;
`;

export const ReportDetail = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 4px;
`;

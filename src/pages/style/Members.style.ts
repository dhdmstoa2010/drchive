import styled from "@emotion/styled";
import { colors, gradients } from "../../styles/theme";
import { fieldStyles } from "../../styles/select";
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
`;

export const SearchInput = styled.input`
  ${fieldStyles}
  width: 220px;
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
  height: 120px;
  color: ${colors.inkSoft};
  font-size: 14px;
  font-weight: 600;
`;

export const GroupColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const GroupBlock = styled.div``;

export const GroupTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.inkFaint};
  margin-bottom: 10px;
`;

export const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
`;

export const MemberCard = styled(GlassCard)`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  background: ${({ $imageUrl }) =>
    $imageUrl ? `center/cover no-repeat url(${$imageUrl})` : gradients.avatar};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const MemberName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.ink};
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const MemberMeta = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  margin-top: 2px;
`;

export const MeBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${colors.lavenderDeep};
  border: 1px solid ${colors.lavender};
  padding: 1px 7px;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
`;

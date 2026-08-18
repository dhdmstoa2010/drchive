import styled from "@emotion/styled";
import { colors, shadows } from "../../styles/theme";

export const Wrapper = styled.div`
  position: relative;
`;

export const BellButton = styled.button`
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 9999px;
  background: ${colors.coral};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
`;

export const Dropdown = styled.div`
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  z-index: 50;
  width: 300px;
  max-height: 380px;
  overflow-y: auto;
  border-radius: 20px;
  border: 1.5px solid ${colors.glassBorder};
  background: #fff;
  box-shadow: ${shadows.glass};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
`;

export const HeaderTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const MarkAllButton = styled.button`
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.lavenderDeep};
  background: none;
  border: none;
  cursor: pointer;
`;

export const EmptyText = styled.div`
  font-size: 12px;
  color: ${colors.inkFaint};
  padding: 16px 4px;
  text-align: center;
`;

export const NotificationItem = styled.button<{ $read: boolean }>`
  font-family: inherit;
  text-align: left;
  border-radius: 16px;
  padding: 10px;
  border: none;
  cursor: pointer;
  background: ${(props) =>
    props.$read ? colors.glassBgSoft : colors.lavenderBg};
`;

export const ItemTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const ItemMessage = styled.div`
  font-size: 11px;
  color: ${colors.inkSoft};
  margin-top: 2px;
`;

import styled from "@emotion/styled";
import { colors, gradients } from "../../styles/theme";

export const DetailImage = styled.img`
  width: 100%;
  max-height: 60vh;
  object-fit: cover;
  border-radius: 16px;
  display: block;
`;

export const DetailImagePlaceholder = styled.div<{ $placeIndex: number }>`
  width: 100%;
  height: 240px;
  border-radius: 16px;
  background-image: ${(props) => gradients.place[props.$placeIndex % 4]};
`;

export const DetailBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
`;

export const DetailPlace = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const DetailMeta = styled.div`
  font-size: 13px;
  color: ${colors.inkFaint};
  margin-top: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export const MineBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.lavenderDeep};
  border: 1px solid ${colors.lavender};
  padding: 2px 8px;
  border-radius: 9999px;
  white-space: nowrap;
`;

export const DetailSemesterTag = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.lavenderDeep};
  background: ${colors.lavenderBg};
  padding: 4px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const DetailDescription = styled.div`
  font-size: 14px;
  color: ${colors.ink};
  line-height: 1.6;
  white-space: pre-wrap;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(70, 55, 50, 0.1);
`;

export const DetailFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(70, 55, 50, 0.1);
`;

export const DeleteButton = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.coralDeep};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const EditButton = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.lavenderDeep};
  background: none;
  border: none;
  padding: 0;
  margin-right: 16px;
  cursor: pointer;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
`;

export const BlockButton = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.inkFaint};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const ReportButton = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.coralDeep};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

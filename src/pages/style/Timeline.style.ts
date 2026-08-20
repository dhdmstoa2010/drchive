import styled from "@emotion/styled";
import { colors } from "../../styles/theme";

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

export const FilterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
`;

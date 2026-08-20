import styled from "@emotion/styled";

export const SkeletonPage = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  font-family: -apple-system, system-ui, sans-serif;
`;

export const SidebarSkeletonContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 16px;
  box-sizing: border-box;
  width: 240px;
  background-color: #fafafb;
  border-right: 1.5px solid #eceef1;
`;

export const SidebarNavColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContentArea = styled.div`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 40px 32px 100px;
  margin-left: 240px;
  width: calc(100% - 240px);
`;

export const ContentInner = styled.div`
  width: 100%;
  max-width: 1240px;
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

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  flex-wrap: wrap;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
`;

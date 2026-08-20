import styled from "@emotion/styled";

export const SkeletonCard = styled.div`
  overflow: hidden;
  border-radius: 28px;
  border: 1.5px solid #eceef1;
  background-color: #fafafb;
`;

export const SkeletonImageWrap = styled.div`
  height: 200px;
  border-radius: 28px 28px 0 0;
  overflow: hidden;
`;

export const SkeletonFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 18px;
`;

export const SkeletonTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

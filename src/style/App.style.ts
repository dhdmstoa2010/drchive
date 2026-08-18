import styled from "@emotion/styled";

export const ContentArea = styled.div<{ $sidebarExpanded: boolean }>`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 40px 32px 100px;
  transition:
    margin-left 220ms ease-in-out,
    width 220ms ease-in-out;
  margin-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "240px" : "84px")};
  width: ${({ $sidebarExpanded }) =>
    $sidebarExpanded ? "calc(100% - 240px)" : "calc(100% - 84px)"};
`;

export const ContentInner = styled.div`
  width: 100%;
  max-width: 1240px;
`;

export const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100svh;
  font-size: 14px;
  color: rgba(60, 50, 45, 0.5);
`;

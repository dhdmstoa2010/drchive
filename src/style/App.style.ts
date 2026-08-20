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

import styled from "@emotion/styled";
import { gradients } from "../../styles/theme";

export const Background = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  background-image: ${gradients.page};
  font-family: -apple-system, system-ui, sans-serif;
`;

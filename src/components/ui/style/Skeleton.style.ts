import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const SkeletonBlock = styled.div`
  border-radius: 8px;
  background: linear-gradient(100deg, #e5e7eb 30%, #f1f2f4 50%, #e5e7eb 70%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

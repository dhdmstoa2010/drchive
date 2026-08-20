import type { HTMLAttributes } from "react";
import { SkeletonBlock } from "./style/Skeleton.style";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
};

export function Skeleton({
  width,
  height,
  radius,
  style,
  ...props
}: SkeletonProps) {
  return (
    <SkeletonBlock
      style={{ width, height, borderRadius: radius, ...style }}
      {...props}
    />
  );
}

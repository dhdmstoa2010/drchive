import { Skeleton } from "./ui/Skeleton";
import {
  SkeletonCard,
  SkeletonImageWrap,
  SkeletonFooter,
  SkeletonTextGroup,
} from "./style/PhotoCardSkeleton.style";

export function PhotoCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImageWrap>
        <Skeleton width="100%" height="100%" radius={0} />
      </SkeletonImageWrap>
      <SkeletonFooter>
        <SkeletonTextGroup>
          <Skeleton width={110} height={16} radius={6} />
          <Skeleton width={140} height={13} radius={6} />
        </SkeletonTextGroup>
        <Skeleton width={64} height={22} radius={9999} />
      </SkeletonFooter>
    </SkeletonCard>
  );
}

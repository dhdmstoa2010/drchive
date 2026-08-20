import { Skeleton } from "../components/ui/Skeleton";
import { PhotoCardSkeleton } from "../components/PhotoCardSkeleton";
import {
  SkeletonPage,
  SidebarSkeletonContainer,
  SidebarNavColumn,
  ContentArea,
  ContentInner,
  HeaderRow,
  TitleGroup,
  FilterColumn,
  FilterRow,
  PhotoGrid,
} from "./style/AppSkeleton.style";

export function AppSkeleton() {
  return (
    <SkeletonPage>
      <SidebarSkeletonContainer>
        <Skeleton width={64} height={19} radius={6} />
        <Skeleton width="100%" height={58} radius={18} />
        <SidebarNavColumn>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={40} radius={14} />
          ))}
        </SidebarNavColumn>
      </SidebarSkeletonContainer>

      <ContentArea>
        <ContentInner>
          <HeaderRow>
            <TitleGroup>
              <Skeleton width={160} height={34} radius={8} />
              <Skeleton width={200} height={16} radius={6} />
            </TitleGroup>
            <FilterColumn>
              <FilterRow>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width={56} height={36} radius={9999} />
                ))}
              </FilterRow>
              <FilterRow>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width={96} height={36} radius={9999} />
                ))}
              </FilterRow>
            </FilterColumn>
          </HeaderRow>

          <PhotoGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <PhotoCardSkeleton key={i} />
            ))}
          </PhotoGrid>
        </ContentInner>
      </ContentArea>
    </SkeletonPage>
  );
}

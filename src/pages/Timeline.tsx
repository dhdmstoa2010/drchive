import { useMemo, useState } from "react";
import { PillButton } from "../components/ui/PillButton";
import { Skeleton } from "../components/ui/Skeleton";
import PhotoCard from "../components/PhotoCard";
import { PhotoCardSkeleton } from "../components/PhotoCardSkeleton";
import { PhotoUploadModal } from "../components/PhotoUploadModal";
import { PhotoDetailModal } from "../components/PhotoDetailModal";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import { useReports } from "../hooks/useReports";
import { isVisibleToViewer } from "../utils/visibility";
import { GRADE_FILTERS } from "../constants/grade";
import type { Photo } from "../types";
import {
  PageWrapper,
  HeaderRow,
  PageTitle,
  PageSubtitle,
  FilterColumn,
  FilterRow,
  PhotoGrid,
} from "./style/Timeline.style";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "2026-1", label: "2026년 1학기" },
  { id: "2025-2", label: "2025년 2학기" },
];

export default function Timeline() {
  const { currentUser, users } = useAuth();
  const { photos, photosLoading } = usePhotos();
  const { isBlocked } = useReports();
  const [activeFilter, setActiveFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState<number | "all">(
    currentUser?.grade ?? "all",
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<(Photo & { index: number }) | null>(
    null,
  );

  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  );

  const visiblePhotos = photos.filter((p) => {
    const uploader = p.uploaderId ? usersById.get(p.uploaderId) : undefined;
    return (
      (activeFilter === "all" || p.semesterLabel === activeFilter) &&
      (gradeFilter === "all" || uploader?.grade === gradeFilter) &&
      !isBlocked(p.uploaderId) &&
      isVisibleToViewer(p.visibility, uploader, currentUser ?? undefined)
    );
  });

  return (
    <PageWrapper>
      <HeaderRow>
        <div>
          <PageTitle>Timeline</PageTitle>
          <PageSubtitle>업로드 된 사진들</PageSubtitle>
        </div>
        {photosLoading ? (
          <FilterColumn>
            <FilterRow>
              {GRADE_FILTERS.map((g) => (
                <Skeleton key={g.id} width={56} height={36} radius={9999} />
              ))}
            </FilterRow>
            <FilterRow>
              {FILTERS.map((f) => (
                <Skeleton key={f.id} width={96} height={36} radius={9999} />
              ))}
              <Skeleton width={80} height={36} radius={9999} />
            </FilterRow>
          </FilterColumn>
        ) : (
          <FilterColumn>
            <FilterRow>
              {GRADE_FILTERS.map((g) => (
                <PillButton
                  key={g.id}
                  type="button"
                  active={gradeFilter === g.id}
                  onClick={() => setGradeFilter(g.id)}
                >
                  {g.label}
                </PillButton>
              ))}
            </FilterRow>
            <FilterRow>
              {FILTERS.map((f) => (
                <PillButton
                  key={f.id}
                  type="button"
                  active={activeFilter === f.id}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.label}
                </PillButton>
              ))}
              <PillButton type="button" onClick={() => setUploadOpen(true)}>
                + 업로드
              </PillButton>
            </FilterRow>
          </FilterColumn>
        )}
      </HeaderRow>

      <PhotoGrid>
        {photosLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <PhotoCardSkeleton key={i} />
            ))
          : visiblePhotos.map((p, i) => (
              <PhotoCard
                key={p.id}
                photo={p}
                index={i}
                onClick={() => setSelected({ ...p, index: i })}
              />
            ))}
      </PhotoGrid>

      <PhotoUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <PhotoDetailModal photo={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  );
}

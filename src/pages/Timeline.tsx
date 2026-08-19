import { useState } from "react";
import { PillButton } from "../components/ui/PillButton";
import PhotoCard from "../components/PhotoCard";
import { PhotoUploadModal } from "../components/PhotoUploadModal";
import { PhotoDetailModal } from "../components/PhotoDetailModal";
import { usePhotos } from "../hooks/usePhotos";
import { useReports } from "../hooks/useReports";
import type { Photo } from "../types";
import {
  PageWrapper,
  HeaderRow,
  PageTitle,
  PageSubtitle,
  FilterRow,
  PhotoGrid,
} from "./style/Timeline.style";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "2026-1", label: "2026 Sem 1" },
  { id: "2025-2", label: "2025 Sem 2" },
];

export default function Timeline() {
  const { photos } = usePhotos();
  const { isBlocked } = useReports();
  const [activeFilter, setActiveFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<(Photo & { index: number }) | null>(
    null,
  );

  const visiblePhotos = photos.filter(
    (p) =>
      (activeFilter === "all" || p.semesterLabel === activeFilter) &&
      !isBlocked(p.uploaderId),
  );

  return (
    <PageWrapper>
      <HeaderRow>
        <div>
          <PageTitle>Timeline</PageTitle>
          <PageSubtitle>업로드 된 사진들</PageSubtitle>
        </div>
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
      </HeaderRow>

      <PhotoGrid>
        {visiblePhotos.map((p, i) => (
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

import { useState } from "react";
import { PillButton } from "../components/ui/PillButton";
import { PHOTOS } from "../data/Photo";
import PhotoCard from "../components/PhotoCard";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "2026-1", label: "2026 Sem 1" },
  { id: "2025-2", label: "2025 Sem 2" },
];

export default function Timeline() {
  const [activeFilter, setActiveFilter] = useState("all");

  const visiblePhotos = PHOTOS.filter(
    (p) => activeFilter === "all" || p.semesterLabel === activeFilter,
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[38px] font-extrabold text-[#0d0d0d] tracking-[-0.6px] break-keep">
            Timeline
          </div>
          <div className="text-base text-ink-soft font-normal mt-2 break-keep whitespace-normal max-w-[520px]">
            업로드 된 사진들
          </div>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-[22px]">
        {visiblePhotos.map((p, i) => (
          <PhotoCard key={p.id} photo={p} index={i} />
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { GlassCard, PillButton } from "../uiPrimitives";
import { PHOTOS } from "../data/Photo";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "2026-1", label: "2026 Sem 1" },
  { id: "2025-2", label: "2025 Sem 2" },
];

const PLACE_BG_CLASSES = [
  "bg-place-0",
  "bg-place-1",
  "bg-place-2",
  "bg-place-3",
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
          <GlassCard key={p.id} className="overflow-hidden cursor-pointer">
            <div
              className={`relative overflow-hidden flex items-end p-3 h-[200px] rounded-t-[28px] ${PLACE_BG_CLASSES[i % 4]}`}
            >
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.place}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="relative z-[1] text-[11px] font-bold tracking-[0.4px] text-[rgba(60,40,70,0.55)] bg-[rgba(255,255,255,0.6)] px-2.5 py-1 rounded-full backdrop-blur-[6px] whitespace-nowrap">
                PHOTO · {p.place}
              </div>
            </div>
            <div className="flex items-center justify-between px-[18px] pt-3.5 pb-[18px]">
              <div>
                <div className="text-base font-bold text-ink">{p.place}</div>
                <div className="text-[13px] text-ink-faint mt-[3px]">
                  {p.date} · {p.uploader}
                </div>
              </div>
              <div className="text-[11px] font-bold text-lavender-deep bg-lavender-bg px-2.5 py-1 rounded-full whitespace-nowrap">
                {p.semesterLabel}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

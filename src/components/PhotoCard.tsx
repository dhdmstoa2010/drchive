import { GlassCard } from "./ui/GlassCard";
import { PLACE_BG_CLASSES, type Photo } from "../data/Photo";

type PhotoCardProps = {
  photo: Photo;
  index: number;
};

export default function PhotoCard({ photo, index }: PhotoCardProps) {
  return (
    <GlassCard className="overflow-hidden cursor-pointer">
      <div
        className={`relative 
          overflow-hidden 
          flex items-end 
          p-3
          h-[200px] 
          rounded-t-[28px] 
          ${PLACE_BG_CLASSES[index % 4]}`}
      >
        {photo.imageUrl && (
          <img
            src={photo.imageUrl}
            alt={photo.place}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="relative 
        z-[1] 
        text-[11px] 
        font-bold 
        tracking-[0.4px]
         text-[rgba(60,40,70,0.55)] 
         bg-[rgba(255,255,255,0.6)] 
         px-2.5 
         py-1 
         rounded-full
          backdrop-blur-[6px] 
          whitespace-nowrap"
        >
          PHOTO · {photo.place}
        </div>
      </div>
      <div className="flex items-center justify-between px-[18px] pt-3.5 pb-[18px]">
        <div>
          <div className="text-base font-bold text-ink">{photo.place}</div>
          <div className="text-[13px] text-ink-faint mt-[3px]">
            {photo.date} · {photo.uploader}
          </div>
        </div>
        <div
          className="text-[11px] 
        font-bold 
        text-lavender-deep
        bg-lavender-bg
        px-2.5 
        py-1
        rounded-full
        whitespace-nowrap"
        >
          {photo.semesterLabel}
        </div>
      </div>
    </GlassCard>
  );
}

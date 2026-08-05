import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { MapPin } from "../components/ui/MapPin";
import { PHOTOS, PLACE_BG_CLASSES } from "../data/Photo";

const DEFAULT_PIN_POSITION = { left: "50%", top: "50%" };

const PIN_POSITIONS: Record<string, { left: string; top: string }> = {
  "Rooftop Garden": { left: "52%", top: "14%" },
  "Main Stairs": { left: "54%", top: "30%" },
  "Music Room": { left: "63%", top: "46%" },
  Schoolyard: { left: "42%", top: "63%" },
  Cafeteria: { left: "24%", top: "84%" },
  "Front Gate": { left: "8%", top: "76%" },
};

export default function MapView() {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const places = Array.from(new Set(PHOTOS.map((p) => p.place)));
  const photosForPlace = PHOTOS.filter((p) => p.place === selectedPlace);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[38px] font-extrabold text-[#0d0d0d] tracking-[-0.6px] break-keep">
            Map View
          </div>
          <div className="text-base text-ink-soft font-normal mt-2 break-keep whitespace-normal max-w-[520px]">
            Tap a place to see photo layers stacked there
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start flex-wrap">
        <GlassCard className="relative w-full max-w-[640px] h-[500px] overflow-hidden">
          <img
            src="/floorplan.png"
            alt="School floor plan"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute top-6 left-6 text-xs font-bold tracking-[0.6px] text-ink-faint bg-white/70 backdrop-blur-[6px] px-2.5 py-1 rounded-full">
            SCHOOL FLOOR PLAN · 3F
          </div>

          {places.map((place) => (
            <MapPin
              key={place}
              label={place}
              count={PHOTOS.filter((p) => p.place === place).length}
              active={selectedPlace === place}
              style={PIN_POSITIONS[place] ?? DEFAULT_PIN_POSITION}
              onClick={() => setSelectedPlace(place)}
            />
          ))}
        </GlassCard>

        {selectedPlace && (
          <GlassCard interactive={false} className="w-full max-w-[400px] p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-extrabold text-ink">
                  {selectedPlace}
                </div>
                <div className="text-sm text-ink-soft mt-1">
                  Photo layers stacked in chronological order
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlace(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border-[1.5px] border-glass-border bg-glass-bg-soft text-ink-soft cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              {photosForPlace.map((photo, i) => (
                <div
                  key={photo.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-glass-bg-soft"
                >
                  <div
                    className={`w-11 h-11 rounded-xl shrink-0 ${PLACE_BG_CLASSES[i % 4]}`}
                  />
                  <div>
                    <div className="text-sm font-bold text-ink">
                      {photo.date}
                    </div>
                    <div className="text-xs text-ink-faint mt-0.5">
                      {photo.uploader}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

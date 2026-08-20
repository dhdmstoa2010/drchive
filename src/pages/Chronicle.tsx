import { useMemo, useState } from "react";
import { PillButton } from "../components/ui/PillButton";
import { usePhotos } from "../hooks/usePhotos";
import { useReports } from "../hooks/useReports";
import type { Photo } from "../types";
import {
  EmptyStateCard,
  HeaderRow,
  HighlightCard,
  HighlightGrid,
  HighlightImage,
  HighlightImageWrapper,
  HighlightInfo,
  HighlightMeta,
  HighlightPlace,
  HighlightsHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PlaceTag,
  PlaceTagRow,
  SectionTitle,
  SemesterRow,
  StoryCard,
  StoryCounter,
  StoryDescription,
  StoryFooter,
  StoryDot,
  StoryImage,
  StoryImageWrap,
  StoryMeta,
  StoryNavButton,
  StoryOverlay,
  StoryPlace,
  SummaryCard,
  SummaryText,
} from "./style/Chronicle.style";

const SEMESTERS = [
  { id: "2026-1", label: "2026년 1학기" },
  { id: "2025-2", label: "2025년 2학기" },
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default function Chronicle() {
  const { photos: allPhotos } = usePhotos();
  const { isBlocked } = useReports();
  const [semester, setSemester] = useState(SEMESTERS[0].id);
  const [seed, setSeed] = useState(0);

  const photos: Photo[] = allPhotos.filter(
    (p) => p.semesterLabel === semester && !isBlocked(p.uploaderId),
  );

  const stats = useMemo(() => {
    const byPlace = new Map<string, number>();
    const uploaders = new Set<string>();
    photos.forEach((p) => {
      byPlace.set(p.place, (byPlace.get(p.place) ?? 0) + 1);
      uploaders.add(p.uploader);
    });
    const places = [...byPlace.entries()].sort((a, b) => b[1] - a[1]);
    return {
      total: photos.length,
      places,
      participants: uploaders.size,
      topPlace: places[0],
    };
  }, [photos]);

  const highlights = useMemo(
    () => pickRandom(photos, Math.min(3, photos.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos, seed],
  );

  const story = useMemo(
    () => [...photos].sort((a, b) => a.date.localeCompare(b.date)),
    [photos],
  );
  const [storyIndex, setStoryIndex] = useState(0);
  const [storySemester, setStorySemester] = useState(semester);
  if (semester !== storySemester) {
    setStorySemester(semester);
    setStoryIndex(0);
  }

  const currentStoryPhoto = story[Math.min(storyIndex, story.length - 1)];

  function goPrev() {
    setStoryIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setStoryIndex((i) => Math.min(story.length - 1, i + 1));
  }

  const semesterLabel =
    SEMESTERS.find((s) => s.id === semester)?.label ?? semester;
  const summary =
    stats.total === 0
      ? `${semesterLabel}에는 아직 업로드된 사진이 없어요.`
      : `${semesterLabel} 동안 총 ${stats.total}장의 사진이 ${stats.places.length}곳에 업로드됐어요. 가장 인기 있었던 장소는 ${stats.topPlace?.[0]}(${stats.topPlace?.[1]}장)예요. 참여한 친구는 ${stats.participants}명이에요.`;

  return (
    <PageWrapper>
      <HeaderRow>
        <div>
          <PageTitle>Chronicle</PageTitle>
          <PageSubtitle>
            학기 동안 쌓인 사진을 자동으로 집계해 요약해줘요.
          </PageSubtitle>
        </div>
        <SemesterRow>
          {SEMESTERS.map((s) => (
            <PillButton
              key={s.id}
              type="button"
              active={semester === s.id}
              onClick={() => setSemester(s.id)}
            >
              {s.label}
            </PillButton>
          ))}
        </SemesterRow>
      </HeaderRow>

      <SummaryCard interactive={false}>
        <SummaryText>{summary}</SummaryText>
        {stats.places.length > 0 && (
          <PlaceTagRow>
            {stats.places.map(([place, count]) => (
              <PlaceTag key={place}>
                {place} · {count}장
              </PlaceTag>
            ))}
          </PlaceTagRow>
        )}
      </SummaryCard>

      <HighlightsHeader>
        <SectionTitle>타임라인 스토리</SectionTitle>
        {story.length > 0 && (
          <StoryCounter>
            {storyIndex + 1} / {story.length}
          </StoryCounter>
        )}
      </HighlightsHeader>

      {story.length === 0 ? (
        <EmptyStateCard interactive={false}>
          아직 이야기로 엮을 사진이 없어요.
        </EmptyStateCard>
      ) : (
        currentStoryPhoto && (
          <StoryCard interactive={false}>
            <StoryImageWrap $placeIndex={storyIndex}>
              {currentStoryPhoto.imageUrl && (
                <StoryImage
                  src={currentStoryPhoto.imageUrl}
                  alt={currentStoryPhoto.place}
                />
              )}
              <StoryOverlay>
                <StoryPlace>{currentStoryPhoto.place}</StoryPlace>
                <StoryMeta>
                  {currentStoryPhoto.date} · {currentStoryPhoto.uploader}
                </StoryMeta>
                {currentStoryPhoto.description && (
                  <StoryDescription>
                    {currentStoryPhoto.description}
                  </StoryDescription>
                )}
              </StoryOverlay>
              <StoryNavButton
                type="button"
                $side="left"
                onClick={goPrev}
                disabled={storyIndex === 0}
                aria-label="이전 사진"
              >
                ‹
              </StoryNavButton>
              <StoryNavButton
                type="button"
                $side="right"
                onClick={goNext}
                disabled={storyIndex === story.length - 1}
                aria-label="다음 사진"
              >
                ›
              </StoryNavButton>
            </StoryImageWrap>
            <StoryFooter>
              {story.map((p, i) => (
                <StoryDot
                  key={p.id}
                  type="button"
                  $active={i === storyIndex}
                  onClick={() => setStoryIndex(i)}
                  aria-label={`${i + 1}번째 사진으로 이동`}
                />
              ))}
            </StoryFooter>
          </StoryCard>
        )
      )}

      <HighlightsHeader>
        <SectionTitle>하이라이트</SectionTitle>
        {highlights.length > 0 && (
          <PillButton type="button" onClick={() => setSeed((s) => s + 1)}>
            다시 만들기
          </PillButton>
        )}
      </HighlightsHeader>

      {highlights.length === 0 ? (
        <EmptyStateCard interactive={false}>
          하이라이트로 보여줄 사진이 아직 없어요.
        </EmptyStateCard>
      ) : (
        <HighlightGrid>
          {highlights.map((p, i) => (
            <HighlightCard key={p.id}>
              <HighlightImageWrapper $placeIndex={i}>
                {p.imageUrl && <HighlightImage src={p.imageUrl} alt={p.place} />}
              </HighlightImageWrapper>
              <HighlightInfo>
                <HighlightPlace>{p.place}</HighlightPlace>
                <HighlightMeta>
                  {p.date} · {p.uploader}
                </HighlightMeta>
              </HighlightInfo>
            </HighlightCard>
          ))}
        </HighlightGrid>
      )}
    </PageWrapper>
  );
}

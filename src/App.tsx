import { useState } from 'react'
import styled from 'styled-components'
import SideBar, { type TabId } from './sideBar'
import { GlassCard, PillButton } from './uiPrimitives'
import { INK, INK_FAINT, INK_SOFT, LAVENDER_BG, LAVENDER_DEEP, PLACE_HUES } from './theme'

type Photo = {
  id: number
  place: string
  date: string
  uploader: string
  semesterLabel: string
  imageUrl?: string
}

const PHOTOS: Photo[] = [
  { id: 1, place: 'Schoolyard', date: '2026.05.14', uploader: 'Seoyeon, Class 3', semesterLabel: '2026-1' },
  { id: 2, place: 'Cafeteria', date: '2026.05.10', uploader: 'Doyoon, Class 1', semesterLabel: '2026-1' },
  { id: 3, place: 'Main Stairs', date: '2026.04.28', uploader: 'Haeun, Class 2', semesterLabel: '2026-1' },
  { id: 4, place: 'Music Room', date: '2025.11.02', uploader: 'Jiho, Class 4', semesterLabel: '2025-2' },
  { id: 5, place: 'Rooftop Garden', date: '2025.10.20', uploader: 'Seoyeon, Class 3', semesterLabel: '2025-2' },
  { id: 6, place: 'Front Gate', date: '2025.09.01', uploader: 'Doyoon, Class 1', semesterLabel: '2025-2' },
]

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: '2026-1', label: '2026 Sem 1' },
  { id: '2025-2', label: '2025 Sem 2' },
]

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 18%, #DAEAF1 0%, transparent 45%),
    radial-gradient(circle at 85% 12%, #F9E8A2 0%, transparent 42%),
    radial-gradient(circle at 78% 82%, #FFE6E6 0%, transparent 48%),
    radial-gradient(circle at 25% 85%, #F9E8A2 0%, transparent 40%),
    radial-gradient(circle at 55% 50%, #FFFFFF 0%, transparent 60%),
    #FFFFFF;
  font-family: -apple-system, system-ui, sans-serif;
`

const ContentShell = styled.div<{ $expanded: boolean }>`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: calc(100% - ${(p) => (p.$expanded ? 240 : 84)}px);
  margin-left: ${(p) => (p.$expanded ? 240 : 84)}px;
  transition: margin-left 0.22s ease, width 0.22s ease;
  padding: 40px 32px 100px;
  display: flex;
  justify-content: center;
`

const ContentInner = styled.div`
  width: 100%;
  max-width: 1240px;
`

const ScreenWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`

const HomeHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`

const ScreenTitle = styled.div`
  font-size: 38px;
  font-weight: 800;
  color: #0d0d0d;
  letter-spacing: -0.6px;
  word-break: keep-all;
`

const ScreenDesc = styled.div`
  font-size: 16px;
  color: ${INK_SOFT};
  font-weight: 400;
  margin-top: 8px;
  word-break: keep-all;
  white-space: normal;
  max-width: 520px;
`

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
`

const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
`

const PhotoCard = styled(GlassCard)`
  overflow: hidden;
  cursor: pointer;
`

const PhotoImage = styled.div<{ $hueA: string; $hueB: string }>`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  height: 200px;
  border-radius: 28px 28px 0 0;
  background: repeating-linear-gradient(135deg, ${(p) => p.$hueA} 0px, ${(p) => p.$hueA} 14px, ${(p) => p.$hueB} 14px, ${(p) => p.$hueB} 28px);
`

const PhotoThumb = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const PhotoLabel = styled.div`
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: rgba(60,40,70,0.55);
  background: rgba(255,255,255,0.6);
  padding: 4px 10px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
  white-space: nowrap;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 18px;
`

const PlaceText = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${INK};
`

const DateText = styled.div`
  font-size: 13px;
  color: ${INK_FAINT};
  margin-top: 3px;
`

const SemesterBadge = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${LAVENDER_DEEP};
  background: ${LAVENDER_BG};
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
`

const ComingSoon = styled(GlassCard)`
  padding: 40px;
  text-align: center;
`

const ComingSoonTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${INK};
`

const ComingSoonDesc = styled.div`
  font-size: 14px;
  color: ${INK_SOFT};
  margin-top: 8px;
`

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [activeFilter, setActiveFilter] = useState('all')

  const visiblePhotos = PHOTOS.filter((p) => activeFilter === 'all' || p.semesterLabel === activeFilter)

  return (
    <Page>
      <SideBar
        expanded={sidebarExpanded}
        activeTab={activeTab}
        onToggle={() => setSidebarExpanded((v) => !v)}
        onNavigate={setActiveTab}
      />

      <ContentShell $expanded={sidebarExpanded}>
        <ContentInner>
          {activeTab === 'home' ? (
            <ScreenWrap>
              <HomeHeader>
                <div>
                  <ScreenTitle>Timeline</ScreenTitle>
                  <ScreenDesc>업로드 된 사진들</ScreenDesc>
                </div>
                <FilterRow>
                  {FILTERS.map((f) => (
                    <PillButton
                      key={f.id}
                      type="button"
                      $active={activeFilter === f.id}
                      onClick={() => setActiveFilter(f.id)}
                    >
                      {f.label}
                    </PillButton>
                  ))}
                </FilterRow>
              </HomeHeader>

              <HomeGrid>
                {visiblePhotos.map((p, i) => {
                  const [hueA, hueB] = PLACE_HUES[i % PLACE_HUES.length]
                  return (
                    <PhotoCard key={p.id}>
                      <PhotoImage $hueA={hueA} $hueB={hueB}>
                        {p.imageUrl && <PhotoThumb src={p.imageUrl} alt={p.place} />}
                        <PhotoLabel>PHOTO · {p.place}</PhotoLabel>
                      </PhotoImage>
                      <MetaRow>
                        <div>
                          <PlaceText>{p.place}</PlaceText>
                          <DateText>
                            {p.date} · {p.uploader}
                          </DateText>
                        </div>
                        <SemesterBadge>{p.semesterLabel}</SemesterBadge>
                      </MetaRow>
                    </PhotoCard>
                  )
                })}
              </HomeGrid>
            </ScreenWrap>
          ) : (
            <ComingSoon>
              <ComingSoonTitle>Coming soon</ComingSoonTitle>
              <ComingSoonDesc>This screen isn't built yet.</ComingSoonDesc>
            </ComingSoon>
          )}
        </ContentInner>
      </ContentShell>
    </Page>
  )
}

export default App

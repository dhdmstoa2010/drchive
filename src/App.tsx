import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SideBar, { type TabId } from "./layout/sideBar";
import Timeline from "./pages/Timeline";
import MapView from "./pages/MapView";
import ComingSoon from "./pages/ComingSoon";

const TAB_PATHS: Record<TabId, string> = {
  home: "/",
  map: "/map",
  capsule: "/capsule",
  chronicle: "/chronicle",
  tag: "/tag",
};

function tabFromPathname(pathname: string): TabId {
  const entry = Object.entries(TAB_PATHS).find(([, path]) => path === pathname);
  return (entry?.[0] as TabId) ?? "home";
}

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabFromPathname(location.pathname);

  return (
    <div
      className="
    relative min-h-screen w-full
    overflow-hidden
    bg-page
    bg-white
    [font-family:-apple-system,system-ui,sans-serif]
    "
    >
      <SideBar
        expanded={sidebarExpanded}
        activeTab={activeTab}
        onToggle={() => setSidebarExpanded((v) => !v)}
        onNavigate={(tab) => navigate(TAB_PATHS[tab])}
      />

      <div
        className={`
      relative z-[2] 
      box-border flex 
      justify-center 
      px-8
       pt-10 
      pb-25 
      transition-[margin-left,width]
       duration-[220ms] 
       ease-in-out ${
         sidebarExpanded
           ? "ml-60 w-[calc(100%-240px)]"
           : "ml-21 w-[calc(100%-84px)]"
       }`}
      >
        <div className="w-full max-w-[1240px]">
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/map" element={<MapView />} />
            <Route
              path="/capsule"
              element={
                <ComingSoon
                  title="Time Capsule"
                  description="추억을 담아두었다가 나중에 열어볼 수 있는 타임캡슐 기능이에요."
                />
              }
            />
            <Route
              path="/chronicle"
              element={
                <ComingSoon
                  title="AI Chronicle"
                  description="업로드된 사진들을 AI가 정리해 이야기로 보여주는 기능이에요."
                />
              }
            />
            <Route
              path="/tag"
              element={
                <ComingSoon
                  title="Anonymous Tagging"
                  description="사진 속 친구를 익명으로 태그할 수 있는 기능이에요."
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

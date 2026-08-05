import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SideBar, { type TabId } from "./layout/sideBar";
import Timeline from "./pages/Timeline";
import MapView from "./pages/MapView";

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
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

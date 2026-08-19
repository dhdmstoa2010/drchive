import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SideBar, { type TabId } from "./layout/SideBar";
import { PageBackground } from "./layout/PageBackground";
import Timeline from "./pages/Timeline";
import Capsule from "./pages/Capsule";
import Chronicle from "./pages/Chronicle";
import TagBoard from "./pages/Tagging";
import MyPage from "./pages/MyPage";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./hooks/useAuth";
import { loadJSON, saveJSON } from "./backend/lib/storage";
import { ContentArea, ContentInner, LoadingScreen } from "./style/App.style";

const TAB_PATHS: Record<TabId, string> = {
  home: "/",
  capsule: "/capsule",
  chronicle: "/chronicle",
  tag: "/tag",
  mypage: "/mypage",
};

const PUBLIC_PATHS = ["/onboarding", "/login", "/signup"];

function tabFromPathname(pathname: string): TabId {
  const entry = Object.entries(TAB_PATHS).find(([, path]) => path === pathname);
  return (entry?.[0] as TabId) ?? "home";
}

function AuthedShell() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabFromPathname(location.pathname);

  return (
    <PageBackground>
      <SideBar
        expanded={sidebarExpanded}
        activeTab={activeTab}
        onToggle={() => setSidebarExpanded((v) => !v)}
        onNavigate={(tab) => navigate(TAB_PATHS[tab])}
      />

      <ContentArea $sidebarExpanded={sidebarExpanded}>
        <ContentInner>
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/capsule" element={<Capsule />} />
            <Route path="/chronicle" element={<Chronicle />} />
            <Route path="/tag" element={<TagBoard />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ContentInner>
      </ContentArea>
    </PageBackground>
  );
}

function App() {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();
  const onboarded = loadJSON<boolean>("onboarded", false);
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);

  useEffect(() => {
    if (currentUser) saveJSON("onboarded", true);
  }, [currentUser]);

  if (authLoading) {
    return <LoadingScreen>불러오는 중...</LoadingScreen>;
  }

  if (!currentUser) {
    if (isPublicPath) {
      return (
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      );
    }
    return <Navigate to={onboarded ? "/login" : "/onboarding"} replace />;
  }

  if (isPublicPath) {
    return <Navigate to="/" replace />;
  }

  return <AuthedShell />;
}

export default App;

import SidebarNavItem from "./SidebarNavItem";
import { NotificationBell } from "../components/NotificationBell";
import { useAuth } from "../hooks/useAuth";
import { resolveThemeId } from "../styles/theme";
import {
  SidebarContainer,
  TopBar,
  Logo,
  IconControls,
  ToggleButton,
  Chevron,
  ProfileCard,
  Avatar,
  ProfileText,
  ProfileName,
  ProfileMeta,
  NavList,
} from "./style/sideBar.style";

export type TabId = "home" | "capsule" | "chronicle" | "tag" | "mypage";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Timeline" },
  { id: "capsule", label: "Time Capsule" },
  { id: "chronicle", label: "Chronicle" },
  { id: "tag", label: "Anonymous Tagging" },
];

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <Chevron
      width="8"
      height="13"
      viewBox="0 0 8 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      $expanded={expanded}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z"
        fill="currentColor"
      />
    </Chevron>
  );
}

type SideBarProps = {
  expanded: boolean;
  activeTab: TabId;
  onToggle: () => void;
  onNavigate: (tab: TabId) => void;
};

export default function SideBar({
  expanded,
  activeTab,
  onToggle,
  onNavigate,
}: SideBarProps) {
  const { currentUser } = useAuth();
  const initials = currentUser?.name ? currentUser.name.slice(0, 2) : "??";
  const themeId = resolveThemeId(currentUser?.themeColor);

  return (
    <SidebarContainer $expanded={expanded} $themeId={themeId}>
      <TopBar $expanded={expanded}>
        <Logo>{expanded ? "Drchive" : "D"}</Logo>
        <IconControls>
          {expanded && <NotificationBell />}
          <ToggleButton type="button" onClick={onToggle}>
            <ChevronIcon expanded={expanded} />
          </ToggleButton>
        </IconControls>
      </TopBar>

      <ProfileCard onClick={() => onNavigate("mypage")} $expanded={expanded}>
        <Avatar>{initials}</Avatar>
        {expanded && (
          <ProfileText>
            <ProfileName>{currentUser?.name ?? "게스트"}</ProfileName>
            <ProfileMeta>
              {currentUser
                ? `${currentUser.grade}학년 ${currentUser.className}반`
                : ""}
            </ProfileMeta>
          </ProfileText>
        )}
      </ProfileCard>

      <NavList>
        {TABS.map((t) => (
          <SidebarNavItem
            key={t.id}
            id={t.id}
            label={t.label}
            active={activeTab === t.id}
            expanded={expanded}
            onClick={() => onNavigate(t.id)}
          />
        ))}
        <SidebarNavItem
          id="mypage"
          label="My Page"
          active={activeTab === "mypage"}
          expanded={expanded}
          onClick={() => onNavigate("mypage")}
        />
      </NavList>
    </SidebarContainer>
  );
}

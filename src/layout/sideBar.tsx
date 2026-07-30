import SidebarNavItem from "./SidebarNavItem";

export type TabId = "home" | "map" | "capsule" | "chronicle" | "tag";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Timeline" },
  { id: "map", label: "Map View" },
  { id: "capsule", label: "Time Capsule" },
  { id: "chronicle", label: "AI Chronicle" },
  { id: "tag", label: "Anonymous Tagging" },
];

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="8"
      height="13"
      viewBox="0 0 8 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-[220ms] ease-in-out ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z"
        fill="currentColor"
      />
    </svg>
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
  return (
    <div
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col gap-[18px] py-[22px] px-4 box-border transition-[width] duration-[220ms] ease-in-out bg-sidebar backdrop-blur-[30px] backdrop-saturate-[200%] border-r-[1.5px] border-r-[rgba(255,255,255,0.4)] shadow-sidebar ${
        expanded ? "w-60" : "w-21"
      }`}
    >
      <div
        className={`flex items-center flex-wrap gap-2 p-1 ${
          expanded ? "justify-between" : "justify-center"
        }`}
      >
        <div className="text-[19px] font-extrabold text-white tracking-[-0.5px] italic">
          {expanded ? "Drchive" : "D"}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="w-[26px] h-[26px] rounded-lg border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.15)] text-white cursor-pointer shrink-0 flex items-center justify-center"
        >
          <ChevronIcon className={expanded ? "" : "rotate-180"} />
        </button>
      </div>

      <div
        className={`flex items-center gap-3 p-3 rounded-[18px] bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.25)] ${
          expanded ? "justify-start" : "justify-center"
        }`}
      >
        <div className="w-[34px] h-[34px] rounded-full shrink-0 bg-avatar text-white text-xs font-bold flex items-center justify-center">
          ES
        </div>
        {expanded && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-white whitespace-nowrap">
              Eunsam Oh
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.65)] mt-0.5 whitespace-nowrap">
              Grade 1, Class 1
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 flex-1">
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
      </div>
    </div>
  );
}

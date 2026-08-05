type MapPinProps = {
  label: string;
  count: number;
  active?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export function MapPin({ label, count, active = false, style, onClick }: MapPinProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer"
    >
      <span
        className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap backdrop-blur-[10px] transition-colors ${
          active
            ? "bg-coral text-white shadow-[0_6px_16px_rgba(200,90,70,0.35)]"
            : "border-[1.5px] border-glass-border bg-glass-bg-soft text-ink shadow-pill-idle"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : "bg-coral"}`}
        />
        {label}
      </span>
      <span className="-mt-1.5 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-ink text-white text-[10px] font-bold">
        {count}
      </span>
    </button>
  );
}

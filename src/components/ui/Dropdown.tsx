import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Wrapper, Trigger, TriggerLabel, Chevron, Menu, Option } from "./style/Dropdown.style";

export type DropdownOption<T extends string | number> = {
  value: T;
  label: string;
};

type DropdownProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  className?: string;
};

export function Dropdown<T extends string | number>({
  value,
  onChange,
  options,
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuRect({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    updatePosition();

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    // capture:true so this also fires for scrolls inside nested scroll
    // containers (e.g. a modal's own overflow-y), not just window scroll.
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <Trigger
        type="button"
        $open={open}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <TriggerLabel>{selected?.label ?? ""}</TriggerLabel>
        <Chevron $open={open} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Chevron>
      </Trigger>
      {open &&
        menuRect &&
        createPortal(
          <Menu
            ref={menuRef}
            role="listbox"
            style={{
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
            }}
          >
            {options.map((o) => (
              <Option
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                $selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </Option>
            ))}
          </Menu>,
          document.body,
        )}
    </Wrapper>
  );
}

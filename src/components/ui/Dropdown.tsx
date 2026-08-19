import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
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
      {open && (
        <Menu role="listbox">
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
        </Menu>
      )}
    </Wrapper>
  );
}

import type { ReactNode } from "react";
import { Overlay, Backdrop, Panel } from "./style/Modal.style";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
};

// Callers still pass Tailwind-style arbitrary-value classes (e.g. "max-w-[480px]")
// so existing call sites don't need to change. Extract the raw CSS value from
// inside the brackets and fall back to the raw string if it isn't bracketed.
function extractMaxWidth(widthClass: string): string {
  const match = widthClass.match(/\[(.+)\]/);
  return match ? match[1] : widthClass;
}

export function Modal({
  open,
  onClose,
  children,
  widthClass = "max-w-[480px]",
}: ModalProps) {
  if (!open) return null;
  return (
    <Overlay>
      <Backdrop onClick={onClose} />
      <Panel $maxWidth={extractMaxWidth(widthClass)}>{children}</Panel>
    </Overlay>
  );
}

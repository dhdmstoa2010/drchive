import { useContext } from "react";
import { CapsuleContext } from "../backend/context/CapsuleContext";

export function useCapsules() {
  const ctx = useContext(CapsuleContext);
  if (!ctx) throw new Error("useCapsules must be used within CapsuleProvider");
  return ctx;
}

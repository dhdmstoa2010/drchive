import { useContext } from "react";
import { TagContext } from "../backend/context/TagContext";

export function useTags() {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error("useTags must be used within TagProvider");
  return ctx;
}

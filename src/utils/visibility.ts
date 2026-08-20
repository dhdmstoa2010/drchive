import type { Visibility } from "../types";

type GradeClass = { grade: number; className: number };

export function isVisibleToViewer(
  visibility: Visibility | undefined,
  poster: GradeClass | undefined,
  viewer: GradeClass | undefined,
): boolean {
  const scope = visibility ?? "all";
  if (scope === "all") return true;
  if (!poster || !viewer) return false;
  if (scope === "grade") return poster.grade === viewer.grade;
  return poster.grade === viewer.grade && poster.className === viewer.className;
}

// Chronological order (oldest first) — DEFAULT_SEMESTER below relies on the
// most recent one being last, so append new semesters at the end.
export const SEMESTERS: { id: string; label: string }[] = [
  { id: "2025-2", label: "2025년 2학기" },
  { id: "2026-1", label: "2026년 1학기" },
  { id: "2026-2", label: "2026년 2학기" },
];

export const DEFAULT_SEMESTER = SEMESTERS[SEMESTERS.length - 1].id;

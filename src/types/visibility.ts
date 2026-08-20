export type Visibility = "all" | "grade" | "class";

export const VISIBILITY_OPTIONS: { value: Visibility; label: string }[] = [
  { value: "class", label: "우리 반만" },
  { value: "grade", label: "우리 학년만" },
  { value: "all", label: "전체 공개" },
];

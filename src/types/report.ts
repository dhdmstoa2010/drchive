export type ReportTargetType = "tag_post" | "photo" | "user";

export type Report = {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string;
  reason: string;
  detail?: string;
  createdAt: string;
};

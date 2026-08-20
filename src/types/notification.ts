export type NotificationType =
  | "capsule_arrived"
  | "tag_suggested"
  | "tag_approved"
  | "tag_rejected"
  | "report_received"
  | "publish_requested"
  | "publish_approved"
  | "publish_rejected"
  | "tag_claim_submitted"
  | "tagged_by_other"
  | "tag_admin_reviewed"
  | "tag_owner_review_needed";

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkTo?: string;
  read: boolean;
  createdAt: string;
};

export type NotificationType =
  | "capsule_arrived"
  | "tag_suggested"
  | "tag_approved"
  | "tag_rejected"
  | "report_received";

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

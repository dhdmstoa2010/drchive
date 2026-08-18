export type CapsuleStatus = "sealed" | "arrived" | "opened";

export type TimeCapsule = {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  photoIds: string[];
  sealedAt: string;
  openDate: string;
  status: CapsuleStatus;
};

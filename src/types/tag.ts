import type { Visibility } from "./visibility";

// Fractional (0–1) box relative to the original image's width/height, so it
// stays valid regardless of how differently the blurred output and the
// original were each downscaled.
export type BlurRect = { x: number; y: number; w: number; h: number };

export type TagPost = {
  id: string;
  ownerId: string;
  photoId?: string;
  place?: string;
  imageUrl: string;
  originalImageUrl?: string;
  blurRects?: BlurRect[];
  createdAt: string;
  visibility?: Visibility;
};

// Three-stage review:
// 1. An admin verifies the claimed identity is correct (against the
//    original photo).
// 2. Only once admin-approved, the submitter themselves states whether
//    they're okay with the mosaic coming off and/or the post going to
//    Memory (wantsMosaicRemoved / wantsPublish).
// 3. Only once the submitter has stated those preferences, the post owner
//    sees the request and makes the final call.
export type SuggestionStatus =
  | "pending"
  | "admin_approved"
  | "admin_rejected"
  | "owner_approved"
  | "owner_rejected";

// A "나예요" self-identification request (submitterId === taggedUserId) or a
// "제보" — someone recognizing a different member's blurred face
// (taggedUserId is whoever they picked).
export type TagSuggestion = {
  id: string;
  postId: string;
  submitterId: string;
  name: string;
  taggedUserId?: string;
  claimedDate?: string;
  extraInfo?: string;
  x: number;
  y: number;
  status: SuggestionStatus;
  // Set by the submitter after admin approval, before the owner can act.
  wantsMosaicRemoved?: boolean;
  wantsPublish?: boolean;
  createdAt: string;
};

export type PublishRequestStatus = "pending" | "approved" | "rejected";

export type PublishRequest = {
  id: string;
  postId: string;
  requesterId: string;
  status: PublishRequestStatus;
  createdAt: string;
};

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
  publishedPhotoId?: string;
};

export type SuggestionStatus = "pending" | "approved" | "rejected";

// A "나예요" self-identification request: the submitter claims a blurred
// spot in the photo is themselves (submitterId === taggedUserId). The post
// owner reviews it against the original photo and, on approval, that one
// blurred region is revealed for everyone.
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

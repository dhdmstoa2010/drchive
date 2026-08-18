export type TagPost = {
  id: string;
  ownerId: string;
  photoId?: string;
  place?: string;
  imageUrl: string;
  createdAt: string;
};

export type SuggestionStatus = "pending" | "approved" | "rejected";

export type TagSuggestion = {
  id: string;
  postId: string;
  submitterId: string;
  name: string;
  x: number;
  y: number;
  status: SuggestionStatus;
  createdAt: string;
};

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  BlurRect,
  PublishRequest,
  PublishRequestStatus,
  SuggestionStatus,
  TagPost,
  TagSuggestion,
  Visibility,
} from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { usePhotos } from "../../hooks/usePhotos";

type CreatePostInput = {
  imageUrl: string;
  originalImageUrl?: string;
  blurRects?: BlurRect[];
  photoId?: string;
  place?: string;
  visibility: Visibility;
};

type PublishDecision = "blurred" | "original" | "rejected";

// "나예요" self-claim submission — the submitter is always claiming the spot
// they clicked is themselves, so taggedUserId always equals the submitter.
type SuggestInput = {
  postId: string;
  name: string;
  taggedUserId: string;
  claimedDate?: string;
  extraInfo?: string;
  x: number;
  y: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
    img.src = src;
  });
}

// Finds which blurred rect a suggestion's click point falls in — falls back
// to the closest rect center if the click landed just outside every box.
function findRectForPoint(
  rects: BlurRect[] | undefined,
  xPercent: number,
  yPercent: number,
): BlurRect | undefined {
  if (!rects || rects.length === 0) return undefined;
  const x = xPercent / 100;
  const y = yPercent / 100;
  const containing = rects.find(
    (r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h,
  );
  if (containing) return containing;

  return rects.reduce((closest, r) => {
    const dist = (r.x + r.w / 2 - x) ** 2 + (r.y + r.h / 2 - y) ** 2;
    const closestDist = (closest.x + closest.w / 2 - x) ** 2 + (closest.y + closest.h / 2 - y) ** 2;
    return dist < closestDist ? r : closest;
  });
}

// Composites just one rect of the original (unblurred) photo back onto the
// posted (blurred) image, so only that person's face gets revealed.
async function revealRegion(
  imageUrl: string,
  originalImageUrl: string,
  rect: BlurRect,
): Promise<string> {
  const [blurredImg, originalImg] = await Promise.all([
    loadImage(imageUrl),
    loadImage(originalImageUrl),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = blurredImg.naturalWidth;
  canvas.height = blurredImg.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없어요.");
  ctx.drawImage(blurredImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    originalImg,
    rect.x * originalImg.naturalWidth,
    rect.y * originalImg.naturalHeight,
    rect.w * originalImg.naturalWidth,
    rect.h * originalImg.naturalHeight,
    rect.x * canvas.width,
    rect.y * canvas.height,
    rect.w * canvas.width,
    rect.h * canvas.height,
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}

type TagContextValue = {
  posts: TagPost[];
  suggestions: TagSuggestion[];
  publishRequests: PublishRequest[];
  createPost: (input: CreatePostInput) => Promise<void>;
  suggestTag: (input: SuggestInput) => Promise<void>;
  reviewSuggestion: (id: string, decision: "approved" | "rejected") => Promise<void>;
  suggestionsForPost: (postId: string) => TagSuggestion[];
  requestPublish: (postId: string) => Promise<void>;
  reviewPublishRequest: (id: string, decision: PublishDecision) => Promise<void>;
  publishRequestsForPost: (postId: string) => PublishRequest[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const TagContext = createContext<TagContextValue | null>(null);

export function TagProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { notify } = useNotifications();
  const { uploadPhoto } = usePhotos();
  const [posts, setPosts] = useState<TagPost[]>([]);
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [publishRequests, setPublishRequests] = useState<PublishRequest[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(collection(db, "tagPosts"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TagPost);
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setPosts(items);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(collection(db, "tagSuggestions"), (snap) => {
      const items = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as TagSuggestion,
      );
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setSuggestions(items);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(collection(db, "publishRequests"), (snap) => {
      const items = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as PublishRequest,
      );
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setPublishRequests(items);
    });
  }, [currentUser]);

  async function createPost(input: CreatePostInput) {
    if (!currentUser) return;
    await addDoc(collection(db, "tagPosts"), {
      ownerId: currentUser.id,
      photoId: input.photoId ?? null,
      place: input.place ?? null,
      imageUrl: input.imageUrl,
      originalImageUrl: input.originalImageUrl ?? null,
      blurRects: input.blurRects ?? [],
      visibility: input.visibility,
      createdAt: new Date().toISOString(),
    });
  }

  async function suggestTag(input: SuggestInput) {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === input.postId);
    await addDoc(collection(db, "tagSuggestions"), {
      postId: input.postId,
      submitterId: currentUser.id,
      name: input.name,
      taggedUserId: input.taggedUserId,
      claimedDate: input.claimedDate?.trim() || null,
      extraInfo: input.extraInfo?.trim() || null,
      x: input.x,
      y: input.y,
      status: "pending" as SuggestionStatus,
      createdAt: new Date().toISOString(),
    });
    if (post && post.ownerId !== currentUser.id) {
      await notify({
        userId: post.ownerId,
        type: "tag_suggested",
        title: "본인 확인 요청이 있어요",
        message: `${input.name}님이 회원님의 게시물에서 본인이라며 확인을 요청했어요.`,
        linkTo: "/tag",
      });
    }
    await notify({
      userId: input.taggedUserId,
      type: "tag_claim_submitted",
      title: "본인 확인 요청을 보냈어요",
      message: "게시물 주인이 확인하면 결과를 알려드릴게요.",
      linkTo: "/tag",
    });
  }

  async function reviewSuggestion(id: string, decision: "approved" | "rejected") {
    const suggestion = suggestions.find((s) => s.id === id);
    if (!suggestion) return;
    const post = posts.find((p) => p.id === suggestion.postId);

    await updateDoc(doc(db, "tagSuggestions", id), { status: decision });

    if (decision === "approved" && post?.originalImageUrl) {
      const rect = findRectForPoint(post.blurRects, suggestion.x, suggestion.y);
      if (rect) {
        try {
          const revealedImageUrl = await revealRegion(
            post.imageUrl,
            post.originalImageUrl,
            rect,
          );
          await updateDoc(doc(db, "tagPosts", post.id), {
            imageUrl: revealedImageUrl,
          });
        } catch (err) {
          console.error("모자이크 해제 실패:", err);
        }
      }
    }

    await notify({
      userId: suggestion.submitterId,
      type: decision === "approved" ? "tag_approved" : "tag_rejected",
      title: decision === "approved" ? "본인 확인이 승인됐어요" : "본인 확인이 거절됐어요",
      message:
        decision === "approved"
          ? "요청하신 부분의 모자이크가 해제됐어요."
          : "본인 확인 요청이 거절됐어요.",
      linkTo: "/tag",
    });
  }

  function suggestionsForPost(postId: string) {
    return suggestions.filter((s) => s.postId === postId);
  }

  async function requestPublish(postId: string) {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === postId);
    if (!post || post.publishedPhotoId) return;
    await addDoc(collection(db, "publishRequests"), {
      postId,
      requesterId: currentUser.id,
      status: "pending" as PublishRequestStatus,
      createdAt: new Date().toISOString(),
    });
    if (post.ownerId !== currentUser.id) {
      await notify({
        userId: post.ownerId,
        type: "publish_requested",
        title: "Memory 게시 요청이 있어요",
        message: "누군가 회원님의 태깅 게시물을 Memory에 올려도 되는지 물어봤어요.",
        linkTo: "/tag",
      });
    }
  }

  async function reviewPublishRequest(id: string, decision: PublishDecision) {
    const request = publishRequests.find((r) => r.id === id);
    const post = request && posts.find((p) => p.id === request.postId);
    if (!request || !post) return;

    await updateDoc(doc(db, "publishRequests", id), {
      status: decision === "rejected" ? "rejected" : "approved",
    });

    if (decision !== "rejected" && !post.publishedPhotoId) {
      const imageUrl =
        decision === "original"
          ? (post.originalImageUrl ?? post.imageUrl)
          : post.imageUrl;
      const photoId = await uploadPhoto({
        place: post.place ?? "익명 장소",
        semesterLabel: "2026-2",
        imageUrl,
        visibility: post.visibility ?? "grade",
      });
      await updateDoc(doc(db, "tagPosts", post.id), {
        publishedPhotoId: photoId,
      });
    }

    await notify({
      userId: request.requesterId,
      type: decision === "rejected" ? "publish_rejected" : "publish_approved",
      title: decision === "rejected" ? "Memory 게시가 거절됐어요" : "Memory 게시가 승인됐어요",
      message:
        decision === "rejected"
          ? "요청하신 게시물의 Memory 게시가 거절됐어요."
          : "요청하신 게시물이 Memory에 올라갔어요.",
      linkTo: decision === "rejected" ? "/tag" : "/",
    });
  }

  function publishRequestsForPost(postId: string) {
    return publishRequests.filter((r) => r.postId === postId);
  }

  return (
    <TagContext.Provider
      value={{
        posts,
        suggestions,
        publishRequests,
        createPost,
        suggestTag,
        reviewSuggestion,
        suggestionsForPost,
        requestPublish,
        reviewPublishRequest,
        publishRequestsForPost,
      }}
    >
      {children}
    </TagContext.Provider>
  );
}

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
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
import { SEMESTERS } from "../../constants/semester";

type CreatePostInput = {
  imageUrl: string;
  originalImageUrl?: string;
  blurRects?: BlurRect[];
  photoId?: string;
  place?: string;
  visibility: Visibility;
};

type PublishDecision = "blurred" | "original" | "rejected";

// A tag suggestion is either a "나예요" self-claim (taggedUserId ===
// submitter, filled in automatically) or a "제보" — a third party who isn't
// the post owner recognizing someone else's blurred face and pointing them
// out (taggedUserId is whichever member they picked).
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
  isAdmin: boolean;
  createPost: (input: CreatePostInput) => Promise<void>;
  suggestTag: (input: SuggestInput) => Promise<void>;
  reviewSuggestionByAdmin: (
    id: string,
    decision: "approved" | "rejected",
  ) => Promise<void>;
  reviewSuggestionByOwner: (
    id: string,
    decision: "approved" | "rejected",
  ) => Promise<void>;
  submitClaimPreferences: (
    id: string,
    prefs: { wantsMosaicRemoved: boolean; wantsPublish: boolean },
  ) => Promise<void>;
  suggestionsForPost: (postId: string) => TagSuggestion[];
  requestPublish: (postId: string) => Promise<void>;
  reviewPublishRequest: (id: string, decision: PublishDecision) => Promise<void>;
  publishRequestsForPost: (postId: string) => PublishRequest[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const TagContext = createContext<TagContextValue | null>(null);

export function TagProvider({ children }: { children: ReactNode }) {
  const { currentUser, users } = useAuth();
  const { notify } = useNotifications();
  const { uploadPhoto } = usePhotos();
  const isAdmin = currentUser?.username === "admin";
  const adminUser = users.find((u) => u.username === "admin");
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
    const isSelfClaim = input.taggedUserId === currentUser.id;

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

    if (adminUser) {
      await notify({
        userId: adminUser.id,
        type: "tag_suggested",
        title: isSelfClaim ? "본인 확인 요청이 있어요" : "새로운 태그 제보가 있어요",
        message: isSelfClaim
          ? `${input.name}님이 본인이라며 신원 확인을 요청했어요.`
          : `누군가 "${input.name}" 님을 태그했어요. 신원 확인이 필요해요.`,
        linkTo: "/tag",
      });
    }

    await notify({
      userId: currentUser.id,
      type: "tag_claim_submitted",
      title: isSelfClaim ? "본인 확인 요청을 보냈어요" : "제보를 보냈어요",
      message: "관리자가 신원을 확인하면 결과를 알려드릴게요.",
      linkTo: "/tag",
    });
  }

  // Stage 1: an admin checks the claimed identity against the original
  // photo. Rejecting here ends the request; approving hands it back to the
  // submitter to state their own mosaic/publish preferences.
  async function reviewSuggestionByAdmin(
    id: string,
    decision: "approved" | "rejected",
  ) {
    const suggestion = suggestions.find((s) => s.id === id);
    const post = suggestion && posts.find((p) => p.id === suggestion.postId);
    if (!suggestion || !post) return;
    const isSelfClaim = suggestion.taggedUserId === suggestion.submitterId;

    const status: SuggestionStatus =
      decision === "approved" ? "admin_approved" : "admin_rejected";
    await updateDoc(doc(db, "tagSuggestions", id), { status });

    await notify({
      userId: suggestion.submitterId,
      type: "tag_admin_reviewed",
      title:
        decision === "approved" ? "관리자가 신원을 확인했어요" : "관리자가 요청을 거절했어요",
      message:
        decision === "approved"
          ? isSelfClaim
            ? "모자이크 해제와 Memory 게시 여부를 직접 정해주세요."
            : "이제 게시물 주인이 공개 여부를 결정해요."
          : "제출하신 요청이 신원 확인 단계에서 거절됐어요.",
      linkTo: "/tag",
    });

    // "제보" (tagging someone else) skips the submitter-preference step, so
    // the owner needs to be notified here instead of after that step.
    if (decision === "approved" && !isSelfClaim && post.ownerId !== suggestion.submitterId) {
      await notify({
        userId: post.ownerId,
        type: "tag_owner_review_needed",
        title: "공개 여부를 결정해주세요",
        message: `관리자가 신원을 확인한 태그 제보가 있어요. "${suggestion.name}" 태그를 반영해도 될까요?`,
        linkTo: "/tag",
      });
    }
  }

  // Stage 2: only reachable once admin-approved. The submitter — the actual
  // subject of the claim — states whether they consent to the mosaic coming
  // off and/or the post being eligible for Memory. Only after this does the
  // post owner get to see and act on the request.
  async function submitClaimPreferences(
    id: string,
    prefs: { wantsMosaicRemoved: boolean; wantsPublish: boolean },
  ) {
    const suggestion = suggestions.find((s) => s.id === id);
    const post = suggestion && posts.find((p) => p.id === suggestion.postId);
    if (!suggestion || !post) return;
    if (
      suggestion.status !== "admin_approved" ||
      suggestion.submitterId !== currentUser?.id
    ) {
      return;
    }

    await updateDoc(doc(db, "tagSuggestions", id), {
      wantsMosaicRemoved: prefs.wantsMosaicRemoved,
      wantsPublish: prefs.wantsPublish,
    });

    if (post.ownerId !== suggestion.submitterId) {
      await notify({
        userId: post.ownerId,
        type: "tag_owner_review_needed",
        title: "공개 여부를 결정해주세요",
        message: `관리자 확인과 본인 동의를 마친 요청이 있어요. "${suggestion.name}" 태그를 공개해도 될까요?`,
        linkTo: "/tag",
      });
    }
  }

  // Stage 3: only reachable once admin-approved AND the submitter has set
  // their own preferences. The post owner makes the final call — for a
  // self-claim, approving reveals that one blurred region, but only if the
  // submitter opted into the mosaic coming off.
  async function reviewSuggestionByOwner(
    id: string,
    decision: "approved" | "rejected",
  ) {
    const suggestion = suggestions.find((s) => s.id === id);
    if (!suggestion || suggestion.status !== "admin_approved") return;
    const isSelfClaim = suggestion.taggedUserId === suggestion.submitterId;
    // "나예요" self-claims must wait for the submitter's own mosaic/publish
    // preferences first; "제보" (tagging someone else) skips straight here
    // since the submitter isn't the one whose consent matters.
    if (isSelfClaim && suggestion.wantsMosaicRemoved === undefined) return;
    const post = posts.find((p) => p.id === suggestion.postId);

    const status: SuggestionStatus =
      decision === "approved" ? "owner_approved" : "owner_rejected";
    await updateDoc(doc(db, "tagSuggestions", id), { status });

    // Only reveal the mosaic for self-claims the submitter opted into — a
    // third party recognizing someone else isn't that person's own consent.
    if (
      decision === "approved" &&
      isSelfClaim &&
      suggestion.wantsMosaicRemoved &&
      post?.originalImageUrl
    ) {
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
      title:
        decision === "approved"
          ? isSelfClaim
            ? "본인 확인이 최종 승인됐어요"
            : "제보가 최종 승인됐어요"
          : isSelfClaim
            ? "본인 확인이 거절됐어요"
            : "제보가 거절됐어요",
      message:
        decision === "approved"
          ? isSelfClaim
            ? suggestion.wantsMosaicRemoved
              ? suggestion.wantsPublish
                ? "요청하신 부분의 모자이크가 해제됐어요. 이제 Memory 게시를 요청할 수 있어요."
                : "요청하신 부분의 모자이크가 해제됐어요."
              : "본인 확인이 최종 승인됐어요."
            : `제보하신 "${suggestion.name}" 태그가 게시물에 반영됐어요.`
          : isSelfClaim
            ? "게시물 주인이 공개를 거절했어요."
            : "게시물 주인이 거절했어요.",
      linkTo: "/tag",
    });

    if (decision === "approved" && !isSelfClaim && suggestion.taggedUserId) {
      await notify({
        userId: suggestion.taggedUserId,
        type: "tagged_by_other",
        title: "사진에 태그됐어요",
        message: "누군가 익명 태깅 게시물에서 회원님을 지목했고, 최종 승인됐어요.",
        linkTo: "/tag",
      });
    }
  }

  function suggestionsForPost(postId: string) {
    return suggestions.filter((s) => s.postId === postId);
  }

  async function requestPublish(postId: string) {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Only someone whose own "나예요" self-claim on this post made it all
    // the way through admin + owner approval, and who opted into Memory
    // publishing themselves, can ask to publish it.
    const verified = suggestions.some(
      (s) =>
        s.postId === postId &&
        s.submitterId === currentUser.id &&
        s.taggedUserId === currentUser.id &&
        s.status === "owner_approved" &&
        s.wantsPublish,
    );
    if (!verified) {
      throw new Error("본인 확인이 최종 승인된 사람만 Memory 게시를 요청할 수 있어요.");
    }

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

    if (decision !== "rejected") {
      const imageUrl =
        decision === "original"
          ? (post.originalImageUrl ?? post.imageUrl)
          : post.imageUrl;
      await uploadPhoto({
        place: post.place ?? "익명 장소",
        semesterLabel: SEMESTERS[SEMESTERS.length - 1].id,
        imageUrl,
        visibility: post.visibility ?? "grade",
      });
      // Now that it lives on Memory, drop it from Tagging entirely.
      await deleteDoc(doc(db, "tagPosts", post.id));
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
        isAdmin,
        createPost,
        suggestTag,
        reviewSuggestionByAdmin,
        reviewSuggestionByOwner,
        submitClaimPreferences,
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

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { SuggestionStatus, TagPost, TagSuggestion } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";

type CreatePostInput = {
  imageUrl: string;
  photoId?: string;
  place?: string;
};

type SuggestInput = {
  postId: string;
  name: string;
  x: number;
  y: number;
};

type TagContextValue = {
  posts: TagPost[];
  suggestions: TagSuggestion[];
  createPost: (input: CreatePostInput) => Promise<void>;
  suggestTag: (input: SuggestInput) => Promise<void>;
  reviewSuggestion: (id: string, decision: "approved" | "rejected") => Promise<void>;
  suggestionsForPost: (postId: string) => TagSuggestion[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const TagContext = createContext<TagContextValue | null>(null);

export function TagProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { notify } = useNotifications();
  const [posts, setPosts] = useState<TagPost[]>([]);
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);

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

  async function createPost(input: CreatePostInput) {
    if (!currentUser) return;
    await addDoc(collection(db, "tagPosts"), {
      ownerId: currentUser.id,
      photoId: input.photoId ?? null,
      place: input.place ?? null,
      imageUrl: input.imageUrl,
      createdAt: new Date().toISOString(),
    });
  }

  async function suggestTag(input: SuggestInput) {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === input.postId);
    const name = input.name.trim();
    await addDoc(collection(db, "tagSuggestions"), {
      postId: input.postId,
      submitterId: currentUser.id,
      name,
      x: input.x,
      y: input.y,
      status: "pending" as SuggestionStatus,
      createdAt: new Date().toISOString(),
    });
    if (post && post.ownerId !== currentUser.id) {
      await notify({
        userId: post.ownerId,
        type: "tag_suggested",
        title: "새로운 태그 제보가 있어요",
        message: `누군가 회원님의 게시물에 "${name}" 태그를 제보했어요.`,
        linkTo: "/tag",
      });
    }
  }

  async function reviewSuggestion(id: string, decision: "approved" | "rejected") {
    const suggestion = suggestions.find((s) => s.id === id);
    if (!suggestion) return;
    await updateDoc(doc(db, "tagSuggestions", id), { status: decision });
    await notify({
      userId: suggestion.submitterId,
      type: decision === "approved" ? "tag_approved" : "tag_rejected",
      title:
        decision === "approved" ? "태그 제보가 승인됐어요" : "태그 제보가 거절됐어요",
      message:
        decision === "approved"
          ? `제보한 "${suggestion.name}" 태그가 게시물에 반영됐어요.`
          : `제보한 "${suggestion.name}" 태그가 거절됐어요.`,
      linkTo: "/tag",
    });
  }

  function suggestionsForPost(postId: string) {
    return suggestions.filter((s) => s.postId === postId);
  }

  return (
    <TagContext.Provider
      value={{
        posts,
        suggestions,
        createPost,
        suggestTag,
        reviewSuggestion,
        suggestionsForPost,
      }}
    >
      {children}
    </TagContext.Provider>
  );
}

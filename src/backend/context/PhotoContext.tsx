import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Photo } from "../../types";
import { useAuth } from "../../hooks/useAuth";

type UploadInput = {
  place: string;
  semesterLabel: string;
  imageUrl: string;
};

type PhotoContextValue = {
  photos: Photo[];
  uploadPhoto: (input: UploadInput) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PhotoContext = createContext<PhotoContextValue | null>(null);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Photo));
    });
  }, [currentUser]);

  async function uploadPhoto(input: UploadInput) {
    await addDoc(collection(db, "photos"), {
      place: input.place,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      uploader: currentUser
        ? `${currentUser.name}, ${currentUser.grade}학년 ${currentUser.className}반`
        : "익명",
      uploaderId: currentUser?.id ?? null,
      semesterLabel: input.semesterLabel,
      imageUrl: input.imageUrl,
      createdAt: serverTimestamp(),
    });
  }

  return (
    <PhotoContext.Provider value={{ photos, uploadPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}

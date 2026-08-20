import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Photo, Visibility } from "../../types";
import { useAuth } from "../../hooks/useAuth";

type UploadInput = {
  place: string;
  semesterLabel: string;
  imageUrl: string;
  description?: string;
  visibility: Visibility;
};

type PhotoContextValue = {
  photos: Photo[];
  photosLoading: boolean;
  uploadPhoto: (input: UploadInput) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PhotoContext = createContext<PhotoContextValue | null>(null);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Photo));
      setPhotosLoading(false);
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
      description: input.description?.trim() ?? "",
      visibility: input.visibility,
      createdAt: serverTimestamp(),
    });
  }

  async function deletePhoto(id: string) {
    await deleteDoc(doc(db, "photos", id));
  }

  return (
    <PhotoContext.Provider
      value={{ photos, photosLoading, uploadPhoto, deletePhoto }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

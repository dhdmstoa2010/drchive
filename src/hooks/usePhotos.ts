import { useContext } from "react";
import { PhotoContext } from "../backend/context/PhotoContext";

export function usePhotos() {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhotos must be used within PhotoProvider");
  return ctx;
}

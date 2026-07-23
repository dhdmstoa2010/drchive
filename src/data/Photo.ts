export type Photo = {
  id: number;
  place: string;
  date: string;
  uploader: string;
  semesterLabel: string;
  imageUrl?: string;
};

export const PHOTOS: Photo[] = [
  {
    id: 1,
    place: "Schoolyard",
    date: "2026.05.14",
    uploader: "Seoyeon, Class 3",
    semesterLabel: "2026-1",
    imageUrl: "/schoolyard.jpg",
  },
  {
    id: 2,
    place: "Cafeteria",
    date: "2026.05.10",
    uploader: "Doyoon, Class 1",
    semesterLabel: "2026-1",
  },
  {
    id: 3,
    place: "Main Stairs",
    date: "2026.04.28",
    uploader: "Haeun, Class 2",
    semesterLabel: "2026-1",
  },
  {
    id: 4,
    place: "Music Room",
    date: "2025.11.02",
    uploader: "Jiho, Class 4",
    semesterLabel: "2025-2",
  },
  {
    id: 5,
    place: "Rooftop Garden",
    date: "2025.10.20",
    uploader: "Seoyeon, Class 3",
    semesterLabel: "2025-2",
    imageUrl: "/taegeun.jpg",
  },
  {
    id: 6,
    place: "Front Gate",
    date: "2025.09.01",
    uploader: "Doyoon, Class 1",
    semesterLabel: "2025-2",
  },
];

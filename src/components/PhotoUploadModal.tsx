import { useState, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "./Modal";
import { PillButton } from "./ui/PillButton";
import { usePhotos } from "../hooks/usePhotos";
import { fileToResizedDataUrl } from "../lib/image";
import {
  Title,
  Subtitle,
  Form,
  Select,
  TextInput,
  HiddenFileInput,
  UploadZone,
  UploadIcon,
  UploadHint,
  UploadSubHint,
  PreviewImage,
  ChangeOverlay,
  ErrorText,
  ButtonRow,
  CancelButton,
} from "./style/PhotoUploadModal.style";

const PLACES = [
  "Schoolyard",
  "Cafeteria",
  "Main Stairs",
  "Music Room",
  "Rooftop Garden",
  "Front Gate",
];
const CUSTOM_PLACE = "직접 입력";

const SEMESTERS = [
  { id: "2026-1", label: "2026 Sem 1" },
  { id: "2025-2", label: "2025 Sem 2" },
];

type PhotoUploadModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PhotoUploadModal({ open, onClose }: PhotoUploadModalProps) {
  const { uploadPhoto } = usePhotos();
  const [place, setPlace] = useState(PLACES[0]);
  const [customPlace, setCustomPlace] = useState("");
  const [semesterLabel, setSemesterLabel] = useState(SEMESTERS[0].id);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setPlace(PLACES[0]);
    setCustomPlace("");
    setSemesterLabel(SEMESTERS[0].id);
    setPreview(null);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPreview(await fileToResizedDataUrl(file));
    } catch {
      setError("이미지를 처리하지 못했어요. 다른 사진을 선택해주세요.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const finalPlace = place === CUSTOM_PLACE ? customPlace.trim() : place;
    if (!finalPlace) {
      setError("장소를 입력해주세요.");
      return;
    }
    if (!preview) {
      setError("사진을 선택해주세요.");
      return;
    }
    await uploadPhoto({ place: finalPlace, semesterLabel, imageUrl: preview });
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Title>사진 업로드</Title>
      <Subtitle>장소를 태그하고 사진을 업로드해요.</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Select value={place} onChange={(e) => setPlace(e.target.value)}>
          {PLACES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value={CUSTOM_PLACE}>{CUSTOM_PLACE}</option>
        </Select>
        {place === CUSTOM_PLACE && (
          <TextInput
            placeholder="장소 이름"
            value={customPlace}
            onChange={(e) => setCustomPlace(e.target.value)}
          />
        )}
        <Select
          value={semesterLabel}
          onChange={(e) => setSemesterLabel(e.target.value)}
        >
          {SEMESTERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
        <UploadZone $hasPreview={!!preview}>
          <HiddenFileInput type="file" accept="image/*" onChange={handleFile} />
          {preview ? (
            <>
              <PreviewImage src={preview} alt="미리보기" />
              <ChangeOverlay className="change-overlay">다른 사진 선택</ChangeOverlay>
            </>
          ) : (
            <>
              <UploadIcon>📷</UploadIcon>
              <UploadHint>클릭해서 사진 선택</UploadHint>
              <UploadSubHint>JPG, PNG</UploadSubHint>
            </>
          )}
        </UploadZone>
        {error && <ErrorText>{error}</ErrorText>}
        <ButtonRow>
          <CancelButton type="button" onClick={handleClose}>
            취소
          </CancelButton>
          <PillButton type="submit" active>
            업로드
          </PillButton>
        </ButtonRow>
      </Form>
    </Modal>
  );
}

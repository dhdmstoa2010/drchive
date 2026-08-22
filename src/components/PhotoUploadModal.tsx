import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "./Modal";
import { PillButton } from "./ui/PillButton";
import { VisibilityPicker } from "./ui/VisibilityPicker";
import { usePhotos } from "../hooks/usePhotos";
import { fileToResizedDataUrl } from "../utils/image";
import { SEMESTERS, DEFAULT_SEMESTER } from "../constants/semester";
import type { Visibility } from "../types";
import {
  Title,
  Subtitle,
  Form,
  FieldLabel,
  Select,
  TextInput,
  DescriptionTextArea,
  HiddenFileInput,
  UploadZone,
  UploadHint,
  UploadSubHint,
  PreviewImage,
  ChangeOverlay,
  ErrorText,
  ButtonRow,
  CancelButton,
} from "./style/PhotoUploadModal.style";

const CUSTOM_PLACE = "직접 입력";

type PhotoUploadModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PhotoUploadModal({ open, onClose }: PhotoUploadModalProps) {
  const { photos, uploadPhoto } = usePhotos();

  const placeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    photos.forEach((p) => {
      if (!p.place) return;
      counts.set(p.place, (counts.get(p.place) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([place]) => place);
  }, [photos]);

  const [place, setPlace] = useState(() => placeOptions[0] ?? CUSTOM_PLACE);
  const [placeTouched, setPlaceTouched] = useState(false);
  const [customPlace, setCustomPlace] = useState("");

  // placeOptions loads asynchronously from Firestore, so the very first
  // render can compute an empty list before the modal ever opens. Once real
  // data comes in, re-sync the default — unless the user already picked
  // something themselves. Adjusted during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [syncedTopPlace, setSyncedTopPlace] = useState(placeOptions[0]);
  if (!placeTouched && placeOptions[0] !== syncedTopPlace) {
    setSyncedTopPlace(placeOptions[0]);
    setPlace(placeOptions[0] ?? CUSTOM_PLACE);
  }

  const [semesterLabel, setSemesterLabel] = useState(DEFAULT_SEMESTER);
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("grade");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setPlace(placeOptions[0] ?? CUSTOM_PLACE);
    setPlaceTouched(false);
    setCustomPlace("");
    setSemesterLabel(DEFAULT_SEMESTER);
    setDescription("");
    setVisibility("grade");
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
    await uploadPhoto({
      place: finalPlace,
      semesterLabel,
      imageUrl: preview,
      description,
      visibility,
    });
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Title>사진 업로드</Title>
      <Subtitle>장소를 태그하고 사진을 업로드해요.</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Select
          value={place}
          onChange={(e) => {
            setPlace(e.target.value);
            setPlaceTouched(true);
          }}
        >
          {placeOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value={CUSTOM_PLACE}>{CUSTOM_PLACE} (새 장소 추가)</option>
        </Select>
        {place === CUSTOM_PLACE && (
          <TextInput
            placeholder="장소 이름 (예: 도서관, 급식실)"
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
        <DescriptionTextArea
          placeholder="사진에 대한 설명을 남겨보세요 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div>
          <FieldLabel>공개 범위</FieldLabel>
          <VisibilityPicker value={visibility} onChange={setVisibility} />
        </div>
        <UploadZone $hasPreview={!!preview}>
          <HiddenFileInput type="file" accept="image/*" onChange={handleFile} />
          {preview ? (
            <>
              <PreviewImage src={preview} alt="미리보기" />
              <ChangeOverlay className="change-overlay">
                다른 사진 선택
              </ChangeOverlay>
            </>
          ) : (
            <>
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

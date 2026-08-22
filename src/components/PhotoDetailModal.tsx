import { useState } from "react";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { ReportModal } from "./ReportModal";
import { VisibilityPicker } from "./ui/VisibilityPicker";
import { PillButton } from "./ui/PillButton";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import { useReports } from "../hooks/useReports";
import { SEMESTERS, DEFAULT_SEMESTER } from "../constants/semester";
import type { Photo, Visibility } from "../types";
import {
  DetailImage,
  DetailImagePlaceholder,
  DetailBody,
  DetailPlace,
  DetailMeta,
  DetailSemesterTag,
  DetailDescription,
  DetailFooter,
  DeleteButton,
  ActionRow,
  BlockButton,
  ReportButton,
  MineBadge,
  EditButton,
} from "./style/PhotoDetailModal.style";
import {
  Form,
  FieldLabel,
  TextInput,
  Select,
  DescriptionTextArea,
  ErrorText,
  ButtonRow,
  CancelButton,
} from "./style/PhotoUploadModal.style";

type PhotoDetailModalProps = {
  photo: (Photo & { index: number }) | null;
  onClose: () => void;
};

export function PhotoDetailModal({ photo, onClose }: PhotoDetailModalProps) {
  const { currentUser } = useAuth();
  const { updatePhoto, deletePhoto } = usePhotos();
  const { blockUser } = useReports();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editPlace, setEditPlace] = useState("");
  const [editSemester, setEditSemester] = useState(DEFAULT_SEMESTER);
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState<Visibility>("grade");
  const [editError, setEditError] = useState<string | null>(null);
  // The modal component stays mounted across different photos (Memory.tsx
  // always renders one instance), so switching photos without cancelling
  // an in-progress edit must not carry stale form state onto the new photo.
  const [openPhotoId, setOpenPhotoId] = useState(photo?.id);
  if (photo && photo.id !== openPhotoId) {
    setOpenPhotoId(photo.id);
    setEditing(false);
    setEditError(null);
  }

  if (!photo) return null;

  const isOwner = !!currentUser && currentUser.id === photo.uploaderId;

  function startEditing() {
    setEditPlace(photo!.place);
    setEditSemester(photo!.semesterLabel);
    setEditDescription(photo!.description ?? "");
    setEditVisibility(photo!.visibility ?? "grade");
    setEditError(null);
    setEditing(true);
  }

  async function handleSaveEdit() {
    const place = editPlace.trim();
    if (!place) {
      setEditError("장소를 입력해주세요.");
      return;
    }
    try {
      await updatePhoto(photo!.id, {
        place,
        semesterLabel: editSemester,
        description: editDescription,
        visibility: editVisibility,
      });
      setEditing(false);
    } catch (err) {
      console.error("사진 수정 실패:", err);
      setEditError("수정하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleDelete() {
    try {
      await deletePhoto(photo!.id);
      setConfirmOpen(false);
      onClose();
    } catch {
      setDeleteError("삭제하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <>
      <Modal open onClose={onClose} widthClass="max-w-[560px]">
        {photo.imageUrl ? (
          <DetailImage src={photo.imageUrl} alt={photo.place} />
        ) : (
          <DetailImagePlaceholder $placeIndex={photo.index} />
        )}

        {isOwner && editing ? (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div>
              <FieldLabel>장소</FieldLabel>
              <TextInput
                value={editPlace}
                onChange={(e) => setEditPlace(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>학기</FieldLabel>
              <Select
                value={editSemester}
                onChange={(e) => setEditSemester(e.target.value)}
              >
                {SEMESTERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>설명</FieldLabel>
              <DescriptionTextArea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <FieldLabel>공개 범위</FieldLabel>
              <VisibilityPicker
                value={editVisibility}
                onChange={setEditVisibility}
              />
            </div>
            {editError && <ErrorText>{editError}</ErrorText>}
            <ButtonRow>
              <CancelButton type="button" onClick={() => setEditing(false)}>
                취소
              </CancelButton>
              <PillButton type="submit" active>
                저장하기
              </PillButton>
            </ButtonRow>
          </Form>
        ) : (
          <>
            <DetailBody>
              <div>
                <DetailPlace>{photo.place}</DetailPlace>
                <DetailMeta>
                  <span>
                    {photo.date} · {photo.uploader}
                  </span>
                  {isOwner && <MineBadge>내 사진</MineBadge>}
                </DetailMeta>
              </div>
              <DetailSemesterTag>{photo.semesterLabel}</DetailSemesterTag>
            </DetailBody>
            {photo.description && (
              <DetailDescription>{photo.description}</DetailDescription>
            )}
          </>
        )}

        {isOwner && !editing ? (
          <DetailFooter>
            <EditButton type="button" onClick={startEditing}>
              수정
            </EditButton>
            <DeleteButton
              type="button"
              onClick={() => {
                setDeleteError(null);
                setConfirmOpen(true);
              }}
            >
              사진 삭제
            </DeleteButton>
          </DetailFooter>
        ) : (
          !isOwner &&
          currentUser && (
            <DetailFooter>
              <ActionRow>
                {photo.uploaderId && (
                  <BlockButton
                    type="button"
                    onClick={() => blockUser(photo.uploaderId!)}
                  >
                    차단
                  </BlockButton>
                )}
                <ReportButton type="button" onClick={() => setReportOpen(true)}>
                  신고
                </ReportButton>
              </ActionRow>
            </DetailFooter>
          )
        )}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="이 사진을 삭제할까요?"
        description={deleteError ?? "삭제하면 되돌릴 수 없어요."}
        confirmLabel="삭제하기"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="photo"
        targetId={photo.id}
        targetOwnerId={photo.uploaderId}
      />
    </>
  );
}

import { useState } from "react";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import type { Photo } from "../types";
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
  MineBadge,
} from "./style/PhotoDetailModal.style";

type PhotoDetailModalProps = {
  photo: (Photo & { index: number }) | null;
  onClose: () => void;
};

export function PhotoDetailModal({ photo, onClose }: PhotoDetailModalProps) {
  const { currentUser } = useAuth();
  const { deletePhoto } = usePhotos();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!photo) return null;

  const isOwner = !!currentUser && currentUser.id === photo.uploaderId;

  async function handleDelete() {
    await deletePhoto(photo!.id);
    setConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <Modal open onClose={onClose} widthClass="max-w-[560px]">
        {photo.imageUrl ? (
          <DetailImage src={photo.imageUrl} alt={photo.place} />
        ) : (
          <DetailImagePlaceholder $placeIndex={photo.index} />
        )}
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
        {isOwner && (
          <DetailFooter>
            <DeleteButton type="button" onClick={() => setConfirmOpen(true)}>
              사진 삭제
            </DeleteButton>
          </DetailFooter>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="이 사진을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요."
        confirmLabel="삭제하기"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

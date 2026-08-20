import { useState } from "react";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { ReportModal } from "./ReportModal";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import { useReports } from "../hooks/useReports";
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
  ActionRow,
  BlockButton,
  ReportButton,
  MineBadge,
} from "./style/PhotoDetailModal.style";

type PhotoDetailModalProps = {
  photo: (Photo & { index: number }) | null;
  onClose: () => void;
};

export function PhotoDetailModal({ photo, onClose }: PhotoDetailModalProps) {
  const { currentUser } = useAuth();
  const { deletePhoto } = usePhotos();
  const { blockUser } = useReports();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  if (!photo) return null;

  const isOwner = !!currentUser && currentUser.id === photo.uploaderId;

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
        {isOwner ? (
          <DetailFooter>
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

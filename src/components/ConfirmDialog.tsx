import { Modal } from "./Modal";
import {
  Title,
  Description,
  ButtonRow,
  CancelButton,
  ConfirmButton,
} from "./style/ConfirmDialog.style";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "확인",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} widthClass="max-w-[360px]">
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      <ButtonRow>
        <CancelButton type="button" onClick={onCancel}>
          취소
        </CancelButton>
        <ConfirmButton type="button" onClick={onConfirm} $danger={danger}>
          {confirmLabel}
        </ConfirmButton>
      </ButtonRow>
    </Modal>
  );
}

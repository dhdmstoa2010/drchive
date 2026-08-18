import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { PillButton } from "./ui/PillButton";
import { useReports } from "../hooks/useReports";
import type { ReportTargetType } from "../types";
import {
  Title,
  DoneWrap,
  DoneText,
  Form,
  Select,
  Textarea,
  ButtonRow,
  CancelButton,
} from "./style/ReportModal.style";

const REASONS = ["부적절한 사진", "괴롭힘/따돌림", "스팸", "기타"];

type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string;
};

export function ReportModal({
  open,
  onClose,
  targetType,
  targetId,
  targetOwnerId,
}: ReportModalProps) {
  const { submitReport } = useReports();
  const [reason, setReason] = useState(REASONS[0]);
  const [detail, setDetail] = useState("");
  const [done, setDone] = useState(false);

  function reset() {
    setReason(REASONS[0]);
    setDetail("");
    setDone(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitReport({
      targetType,
      targetId,
      targetOwnerId,
      reason,
      detail: detail.trim() || undefined,
    });
    setDone(true);
  }

  return (
    <Modal open={open} onClose={handleClose} widthClass="max-w-[380px]">
      <Title>신고하기</Title>
      {done ? (
        <DoneWrap>
          <DoneText>신고가 접수됐어요. 확인 후 조치할게요.</DoneText>
          <PillButton type="button" active onClick={handleClose}>
            확인
          </PillButton>
        </DoneWrap>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Textarea
            placeholder="자세한 내용 (선택)"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
          />
          <ButtonRow>
            <CancelButton type="button" onClick={handleClose}>
              취소
            </CancelButton>
            <PillButton type="submit" active>
              신고 제출
            </PillButton>
          </ButtonRow>
        </Form>
      )}
    </Modal>
  );
}

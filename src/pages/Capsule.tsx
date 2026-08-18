import { useMemo, useState, type FormEvent } from "react";
import { PillButton } from "../components/ui/PillButton";
import { Modal } from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import { useCapsules } from "../hooks/useCapsules";
import { usePhotos } from "../hooks/usePhotos";
import { useReports } from "../hooks/useReports";
import type { CapsuleStatus, TimeCapsule } from "../types";
import {
  PageWrapper,
  PageHeaderRow,
  PageTitle,
  PageSubtitle,
  TabRow,
  EmptyState,
  CapsuleGrid,
  CapsuleCard,
  CardTopRow,
  StatusIcon,
  StatusBadge,
  CardTitle,
  CardMeta,
  SelectField,
  MessageTextArea,
  DateField,
  Title,
  Subtitle,
  HeaderRow,
  MetaText,
  PhotoRow,
  ThumbImage,
  NoRecipientsNote,
  SealForm,
  FieldLabel,
  PhotoThumbButton,
  PlaceholderThumb,
  ErrorText,
  FormActions,
  CancelButton,
  LockedState,
  LockIcon,
  LockedTitle,
  LockedHint,
  ContentSection,
  MessageBox,
  AttachedPhoto,
  OpenButton,
} from "./style/Capsule.style";

const STATUS_LABEL: Record<CapsuleStatus, string> = {
  sealed: "봉인됨",
  arrived: "개봉 가능",
  opened: "열람됨",
};

function todayPlusOne() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, ".");
}

function SealModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentUser, users } = useAuth();
  const { photos } = usePhotos();
  const { seal } = useCapsules();
  const { isBlocked } = useReports();

  const recipients = users.filter(
    (u) => u.id !== currentUser?.id && !isBlocked(u.id),
  );
  const myPhotos = photos.filter((p) => p.uploaderId === currentUser?.id);

  const [recipientId, setRecipientId] = useState(recipients[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [openDate, setOpenDate] = useState(todayPlusOne());
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setRecipientId(recipients[0]?.id ?? "");
    setMessage("");
    setOpenDate(todayPlusOne());
    setPhotoIds([]);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function togglePhoto(id: string) {
    setPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!recipientId) {
      setError("받는 사람을 선택해주세요.");
      return;
    }
    if (!message.trim()) {
      setError("편지 내용을 입력해주세요.");
      return;
    }
    seal({ recipientId, message: message.trim(), photoIds, openDate });
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Title>타임캡슐 봉인</Title>
      <Subtitle>친구에게 미래에 열어볼 편지를 남겨보세요.</Subtitle>

      {recipients.length === 0 ? (
        <NoRecipientsNote>
          아직 다른 가입자가 없어요. 다른 계정이 가입하면 캡슐을 보낼 수
          있어요.
        </NoRecipientsNote>
      ) : (
        <SealForm onSubmit={handleSubmit}>
          <SelectField
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          >
            {recipients.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.grade}학년 {u.className}반)
              </option>
            ))}
          </SelectField>

          <MessageTextArea
            placeholder="편지 내용을 적어주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <div>
            <FieldLabel>개봉일</FieldLabel>
            <DateField
              type="date"
              min={todayPlusOne()}
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
            />
          </div>

          {myPhotos.length > 0 && (
            <div>
              <FieldLabel>사진 첨부 (선택)</FieldLabel>
              <PhotoRow>
                {myPhotos.map((p) => (
                  <PhotoThumbButton
                    type="button"
                    key={p.id}
                    onClick={() => togglePhoto(p.id)}
                    $selected={photoIds.includes(p.id)}
                  >
                    {p.imageUrl ? (
                      <ThumbImage src={p.imageUrl} alt={p.place} />
                    ) : (
                      <PlaceholderThumb />
                    )}
                  </PhotoThumbButton>
                ))}
              </PhotoRow>
            </div>
          )}

          {error && <ErrorText>{error}</ErrorText>}

          <FormActions>
            <CancelButton type="button" onClick={handleClose}>
              취소
            </CancelButton>
            <PillButton type="submit" active>
              봉인하기
            </PillButton>
          </FormActions>
        </SealForm>
      )}
    </Modal>
  );
}

function DetailModal({
  capsule,
  onClose,
}: {
  capsule: TimeCapsule | null;
  onClose: () => void;
}) {
  const { currentUser, users } = useAuth();
  const { photos } = usePhotos();
  const { open } = useCapsules();

  if (!capsule) return null;

  const sender = users.find((u) => u.id === capsule.senderId);
  const recipient = users.find((u) => u.id === capsule.recipientId);
  const isRecipient = currentUser?.id === capsule.recipientId;
  const locked = isRecipient && capsule.status === "sealed";
  const attachedPhotos = photos.filter((p) => capsule.photoIds.includes(p.id));

  return (
    <Modal open onClose={onClose}>
      <HeaderRow>
        <div>
          <Title>
            {sender?.name ?? "알 수 없음"} → {recipient?.name ?? "알 수 없음"}
          </Title>
          <MetaText>
            개봉일 {formatDate(capsule.openDate)} · {STATUS_LABEL[capsule.status]}
          </MetaText>
        </div>
      </HeaderRow>

      {locked ? (
        <LockedState>
          <LockIcon>🔒</LockIcon>
          <LockedTitle>
            {formatDate(capsule.openDate)}에 열어볼 수 있어요
          </LockedTitle>
          <LockedHint>그때까지 편지 내용은 비밀이에요.</LockedHint>
        </LockedState>
      ) : (
        <ContentSection>
          <MessageBox>{capsule.message}</MessageBox>
          {attachedPhotos.length > 0 && (
            <PhotoRow>
              {attachedPhotos.map((p) => (
                <AttachedPhoto key={p.id}>
                  {p.imageUrl && <ThumbImage src={p.imageUrl} alt={p.place} />}
                </AttachedPhoto>
              ))}
            </PhotoRow>
          )}
          {isRecipient && capsule.status === "arrived" && (
            <OpenButton type="button" active onClick={() => open(capsule.id)}>
              열람 완료로 표시
            </OpenButton>
          )}
        </ContentSection>
      )}
    </Modal>
  );
}

export default function Capsule() {
  const { currentUser, users } = useAuth();
  const { capsules } = useCapsules();
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [sealOpen, setSealOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = capsules.find((c) => c.id === selectedId) ?? null;

  const list = useMemo(
    () =>
      capsules
        .filter((c) =>
          tab === "received"
            ? c.recipientId === currentUser?.id
            : c.senderId === currentUser?.id,
        )
        .sort((a, b) => b.sealedAt.localeCompare(a.sealedAt)),
    [capsules, tab, currentUser],
  );

  function nameOf(id: string) {
    return users.find((u) => u.id === id)?.name ?? "알 수 없음";
  }

  return (
    <PageWrapper>
      <PageHeaderRow>
        <div>
          <PageTitle>Time Capsule</PageTitle>
          <PageSubtitle>
            편지+사진을 담아 미래의 친구에게 봉인해보세요.
          </PageSubtitle>
        </div>
        <TabRow>
          <PillButton
            type="button"
            active={tab === "received"}
            onClick={() => setTab("received")}
          >
            받은 캡슐
          </PillButton>
          <PillButton
            type="button"
            active={tab === "sent"}
            onClick={() => setTab("sent")}
          >
            보낸 캡슐
          </PillButton>
          <PillButton type="button" onClick={() => setSealOpen(true)}>
            + 새 캡슐 봉인
          </PillButton>
        </TabRow>
      </PageHeaderRow>

      {list.length === 0 ? (
        <EmptyState interactive={false}>
          {tab === "received"
            ? "아직 받은 타임캡슐이 없어요."
            : "아직 보낸 타임캡슐이 없어요."}
        </EmptyState>
      ) : (
        <CapsuleGrid>
          {list.map((c) => (
            <CapsuleCard key={c.id} onClick={() => setSelectedId(c.id)}>
              <CardTopRow>
                <StatusIcon>
                  {c.status === "sealed" ? "🔒" : c.status === "arrived" ? "📬" : "📖"}
                </StatusIcon>
                <StatusBadge>{STATUS_LABEL[c.status]}</StatusBadge>
              </CardTopRow>
              <CardTitle>
                {tab === "received"
                  ? `${nameOf(c.senderId)}님이 보냄`
                  : `${nameOf(c.recipientId)}님에게`}
              </CardTitle>
              <CardMeta>개봉일 {formatDate(c.openDate)}</CardMeta>
            </CapsuleCard>
          ))}
        </CapsuleGrid>
      )}

      <SealModal open={sealOpen} onClose={() => setSealOpen(false)} />
      <DetailModal capsule={selected} onClose={() => setSelectedId(null)} />
    </PageWrapper>
  );
}

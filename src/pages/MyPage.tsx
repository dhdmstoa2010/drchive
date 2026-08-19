import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PillButton } from "../components/ui/PillButton";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import { useCapsules } from "../hooks/useCapsules";
import { useTags } from "../hooks/useTags";
import { useReports } from "../hooks/useReports";
import {
  AccountActionsRow,
  Avatar,
  CancelButton,
  CapsuleCard,
  CapsuleLinkButton,
  CapsuleStatLabel,
  CapsuleStatValue,
  EditFieldsRow,
  EmptyCard,
  EmptyPhotoCard,
  FieldInput,
  FieldSelect,
  ListColumn,
  ListItemCard,
  ListItemText,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PhotoGrid,
  PhotoThumb,
  PhotoThumbImage,
  ProfileActionsRow,
  ProfileCard,
  ProfileHeaderRow,
  ProfileIdentity,
  ProfileMeta,
  ProfileName,
  ReportCard,
  ReportDetail,
  Section,
  SectionTitle,
  StatusTag,
  UnblockButton,
  WithdrawButton,
} from "./style/MyPage.style";

const STATUS_LABEL: Record<string, string> = {
  approved: "승인됨",
  rejected: "거절됨",
  pending: "대기중",
};

export default function MyPage() {
  const { currentUser, users, logout, withdraw, updateProfile } = useAuth();
  const { photos } = usePhotos();
  const { capsules } = useCapsules();
  const { suggestions } = useTags();
  const { myReports, blockedUserIds, unblockUser } = useReports();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? "");
  const [grade, setGrade] = useState(currentUser?.grade ?? 1);
  const [className, setClassName] = useState(currentUser?.className ?? 1);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  if (!currentUser) return null;

  const myPhotos = photos.filter((p) => p.uploaderId === currentUser.id);
  const sentCapsules = capsules.filter((c) => c.senderId === currentUser.id);
  const receivedCapsules = capsules.filter(
    (c) => c.recipientId === currentUser.id,
  );
  const mySuggestions = suggestions.filter(
    (s) => s.submitterId === currentUser.id,
  );

  async function saveProfile() {
    await updateProfile({
      name: name.trim() || currentUser!.name,
      grade,
      className,
    });
    setEditing(false);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function handleWithdraw() {
    const result = await withdraw();
    if (!result.ok) {
      setWithdrawError(result.error);
      return;
    }
    navigate("/login");
  }

  return (
    <PageWrapper>
      <div>
        <PageTitle>My Page</PageTitle>
        <PageSubtitle>내 정보와 활동 내역을 관리해요.</PageSubtitle>
      </div>

      <ProfileCard interactive={false}>
        <ProfileHeaderRow>
          <ProfileIdentity>
            <Avatar>{currentUser.name.slice(0, 2)}</Avatar>
            {!editing ? (
              <div>
                <ProfileName>{currentUser.name}</ProfileName>
                <ProfileMeta>
                  {currentUser.grade}학년 {currentUser.className}반 ·{" "}
                  {currentUser.email}
                </ProfileMeta>
              </div>
            ) : (
              <EditFieldsRow>
                <FieldInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FieldSelect
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                >
                  {[1, 2, 3].map((g) => (
                    <option key={g} value={g}>
                      {g}학년
                    </option>
                  ))}
                </FieldSelect>
                <FieldSelect
                  value={className}
                  onChange={(e) => setClassName(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <option key={c} value={c}>
                      {c}반
                    </option>
                  ))}
                </FieldSelect>
              </EditFieldsRow>
            )}
          </ProfileIdentity>
          <ProfileActionsRow>
            {editing ? (
              <>
                <CancelButton type="button" onClick={() => setEditing(false)}>
                  취소
                </CancelButton>
                <PillButton type="button" active onClick={saveProfile}>
                  저장
                </PillButton>
              </>
            ) : (
              <PillButton type="button" onClick={() => setEditing(true)}>
                프로필 수정
              </PillButton>
            )}
          </ProfileActionsRow>
        </ProfileHeaderRow>

        <AccountActionsRow>
          <PillButton type="button" onClick={handleLogout}>
            로그아웃
          </PillButton>
          <WithdrawButton
            type="button"
            onClick={() => {
              setWithdrawError(null);
              setWithdrawOpen(true);
            }}
          >
            회원 탈퇴
          </WithdrawButton>
        </AccountActionsRow>
      </ProfileCard>

      <Section>
        <SectionTitle>내 업로드 사진 ({myPhotos.length})</SectionTitle>
        {myPhotos.length === 0 ? (
          <EmptyPhotoCard interactive={false}>
            아직 업로드한 사진이 없어요.
          </EmptyPhotoCard>
        ) : (
          <PhotoGrid>
            {myPhotos.map((p) => (
              <PhotoThumb key={p.id}>
                {p.imageUrl && (
                  <PhotoThumbImage src={p.imageUrl} alt={p.place} />
                )}
              </PhotoThumb>
            ))}
          </PhotoGrid>
        )}
      </Section>

      <Section>
        <SectionTitle>내 타임캡슐</SectionTitle>
        <CapsuleCard interactive={false}>
          <div>
            <CapsuleStatValue>{sentCapsules.length}</CapsuleStatValue>
            <CapsuleStatLabel>보낸 캡슐</CapsuleStatLabel>
          </div>
          <div>
            <CapsuleStatValue>{receivedCapsules.length}</CapsuleStatValue>
            <CapsuleStatLabel>받은 캡슐</CapsuleStatLabel>
          </div>
          <CapsuleLinkButton
            type="button"
            active
            onClick={() => navigate("/capsule")}
          >
            타임캡슐 보러가기
          </CapsuleLinkButton>
        </CapsuleCard>
      </Section>

      <Section>
        <SectionTitle>내 태그 제보 내역 ({mySuggestions.length})</SectionTitle>
        {mySuggestions.length === 0 ? (
          <EmptyCard interactive={false}>아직 제보한 태그가 없어요.</EmptyCard>
        ) : (
          <ListColumn>
            {mySuggestions.map((s) => (
              <ListItemCard key={s.id} interactive={false}>
                <ListItemText>"{s.name}" 태그</ListItemText>
                <StatusTag $status={s.status}>
                  {STATUS_LABEL[s.status]}
                </StatusTag>
              </ListItemCard>
            ))}
          </ListColumn>
        )}
      </Section>

      <Section>
        <SectionTitle>차단 목록 ({blockedUserIds.length})</SectionTitle>
        {blockedUserIds.length === 0 ? (
          <EmptyCard interactive={false}>차단한 사용자가 없어요.</EmptyCard>
        ) : (
          <ListColumn>
            {blockedUserIds.map((id) => {
              const user = users.find((u) => u.id === id);
              return (
                <ListItemCard key={id} interactive={false}>
                  <ListItemText>{user?.name ?? "알 수 없음"}</ListItemText>
                  <UnblockButton
                    type="button"
                    onClick={() => unblockUser(id)}
                  >
                    차단 해제
                  </UnblockButton>
                </ListItemCard>
              );
            })}
          </ListColumn>
        )}
      </Section>

      <Section>
        <SectionTitle>내 신고 내역 ({myReports.length})</SectionTitle>
        {myReports.length === 0 ? (
          <EmptyCard interactive={false}>신고한 내역이 없어요.</EmptyCard>
        ) : (
          <ListColumn>
            {myReports.map((r) => (
              <ReportCard key={r.id} interactive={false}>
                <ListItemText>{r.reason}</ListItemText>
                {r.detail && <ReportDetail>{r.detail}</ReportDetail>}
              </ReportCard>
            ))}
          </ListColumn>
        )}
      </Section>

      <ConfirmDialog
        open={withdrawOpen}
        title="정말 회원 탈퇴하시겠어요?"
        description={
          withdrawError ??
          "계정 정보가 삭제되고 로그아웃돼요. 업로드한 사진/게시물은 남아있을 수 있어요."
        }
        confirmLabel="탈퇴하기"
        danger
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawOpen(false)}
      />
    </PageWrapper>
  );
}

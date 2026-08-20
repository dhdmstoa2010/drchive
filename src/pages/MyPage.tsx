import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PillButton } from "../components/ui/PillButton";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import { useCapsules } from "../hooks/useCapsules";
import { useTags } from "../hooks/useTags";
import { useReports } from "../hooks/useReports";
import { fileToResizedDataUrl } from "../utils/image";
import {
  backgroundThemes,
  resolveThemeId,
  type BackgroundThemeId,
} from "../styles/theme";
import {
  AccountActionsRow,
  Avatar,
  AvatarWrap,
  AvatarEditButton,
  CancelButton,
  CapsuleCard,
  CapsuleLinkButton,
  CapsuleStatLabel,
  CapsuleStatValue,
  EditFieldsRow,
  EmptyCard,
  EmptyPhotoCard,
  ErrorText,
  FieldInput,
  FieldSelect,
  HiddenFileInput,
  ListColumn,
  ListItemCard,
  ListItemText,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PasswordActionsRow,
  PasswordCard,
  PasswordForm,
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
  SuccessText,
  ThemeCard,
  ThemeSwatchButton,
  ThemeSwatchLabel,
  ThemeSwatchRow,
  UnblockButton,
  WithdrawButton,
} from "./style/MyPage.style";

const STATUS_LABEL: Record<string, string> = {
  approved: "승인됨",
  rejected: "거절됨",
  pending: "대기중",
};

export default function MyPage() {
  const {
    currentUser,
    users,
    logout,
    withdraw,
    updateProfile,
    changePassword,
  } = useAuth();
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
  const [themeError, setThemeError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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

  const activeThemeId: BackgroundThemeId = resolveThemeId(
    currentUser.themeColor,
  );

  async function handleThemeSelect(id: BackgroundThemeId) {
    try {
      setThemeError(null);
      await updateProfile({ themeColor: id });
    } catch {
      setThemeError("테마를 저장하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setAvatarError(null);
      const dataUrl = await fileToResizedDataUrl(file, 240, 0.85);
      await updateProfile({ avatarUrl: dataUrl });
    } catch {
      setAvatarError(
        "프로필 사진을 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않아요.");
      return;
    }
    const result = await changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }
    setPasswordError(null);
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
            <AvatarWrap>
              <Avatar $imageUrl={currentUser.avatarUrl}>
                {!currentUser.avatarUrl && currentUser.name.slice(0, 2)}
              </Avatar>
              <AvatarEditButton
                type="button"
                onClick={() =>
                  document.getElementById("avatar-file-input")?.click()
                }
                aria-label="프로필 사진 변경"
              >
                🖊
              </AvatarEditButton>
              <HiddenFileInput
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </AvatarWrap>
            {!editing ? (
              <div>
                <ProfileName>{currentUser.name}</ProfileName>
                <ProfileMeta>
                  {currentUser.grade}학년 {currentUser.className}반 · @
                  {currentUser.username}
                </ProfileMeta>
                {avatarError && <ErrorText>{avatarError}</ErrorText>}
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
        <SectionTitle>테마 배경색</SectionTitle>
        <ThemeCard interactive={false}>
          <ThemeSwatchRow>
            {(Object.keys(backgroundThemes) as BackgroundThemeId[]).map(
              (id) => (
                <ThemeSwatchButton
                  key={id}
                  type="button"
                  $background={backgroundThemes[id].swatch}
                  $active={activeThemeId === id}
                  onClick={() => handleThemeSelect(id)}
                >
                  <ThemeSwatchLabel $active={activeThemeId === id}>
                    {backgroundThemes[id].label}
                  </ThemeSwatchLabel>
                </ThemeSwatchButton>
              ),
            )}
          </ThemeSwatchRow>
          {themeError && <ErrorText>{themeError}</ErrorText>}
        </ThemeCard>
      </Section>

      <Section>
        <SectionTitle>비밀번호 변경</SectionTitle>
        <PasswordCard interactive={false}>
          {!passwordOpen ? (
            <PillButton
              type="button"
              onClick={() => {
                setPasswordError(null);
                setPasswordSuccess(false);
                setPasswordOpen(true);
              }}
            >
              비밀번호 변경
            </PillButton>
          ) : (
            <PasswordForm onSubmit={handleChangePassword}>
              <FieldInput
                type="password"
                required
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <FieldInput
                type="password"
                required
                placeholder="새 비밀번호 (6자 이상)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FieldInput
                type="password"
                required
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && <ErrorText>{passwordError}</ErrorText>}
              {passwordSuccess && (
                <SuccessText>비밀번호가 변경됐어요.</SuccessText>
              )}
              <PasswordActionsRow>
                <CancelButton
                  type="button"
                  onClick={() => setPasswordOpen(false)}
                >
                  닫기
                </CancelButton>
                <PillButton type="submit" active>
                  변경하기
                </PillButton>
              </PasswordActionsRow>
            </PasswordForm>
          )}
        </PasswordCard>
      </Section>

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
                  <UnblockButton type="button" onClick={() => unblockUser(id)}>
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

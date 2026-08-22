import { useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { PillButton } from "../components/ui/PillButton";
import { Modal } from "../components/Modal";
import { BlurCanvas } from "../components/BlurCanvas";
import { ReportModal } from "../components/ReportModal";
import { VisibilityPicker } from "../components/ui/VisibilityPicker";
import { Dropdown } from "../components/ui/Dropdown";
import { useAuth } from "../hooks/useAuth";
import { usePhotos } from "../hooks/usePhotos";
import { useTags } from "../hooks/useTags";
import { useReports } from "../hooks/useReports";
import { fileToResizedDataUrl } from "../utils/image";
import { isVisibleToViewer } from "../utils/visibility";
import { GRADE_FILTERS } from "../constants/grade";
import type { TagPost, Visibility } from "../types";
import {
  PageWrapper,
  PageHeaderRow,
  PageTitle,
  PageSubtitle,
  EmptyState,
  PostGrid,
  PostCard,
  PostThumb,
  PostCaption,
  Title,
  Subtitle,
  FormSection,
  FieldLabel,
  HiddenFileInput,
  UploadZone,
  UploadHint,
  PhotoRow,
  PhotoThumbButton,
  ThumbImage,
  BlurWrap,
  HeaderRow,
  MetaText,
  ActionRow,
  BlockButton,
  ReportButton,
  ImageFrame,
  PostImage,
  TagMarker,
  TagLabel,
  PendingMarker,
  PendingDot,
  SuggestRow,
  PendingSection,
  SectionLabel,
  EmptyNote,
  PendingList,
  PendingItem,
  PendingItemText,
  PendingItemActions,
  ApproveButton,
  AltApproveButton,
  RejectButton,
  FilterRow,
  PostMeta,
  ErrorText,
  ClaimInput,
  ClaimTextArea,
  OriginalPreview,
} from "./style/Tagging.style";

function NewPostModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { currentUser } = useAuth();
  const { photos } = usePhotos();
  const { createPost } = useTags();
  const myPhotos = photos.filter(
    (p) => p.uploaderId === currentUser?.id && p.imageUrl,
  );
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    photoId?: string;
    place?: string;
  } | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("grade");

  function handleClose() {
    setSelectedImage(null);
    setVisibility("grade");
    onClose();
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = await fileToResizedDataUrl(file);
    setSelectedImage({ imageUrl });
  }

  return (
    <Modal open={open} onClose={handleClose} widthClass="max-w-[460px]">
      <Title>새 게시물</Title>
      <Subtitle>
        사진을 업로드하거나 내 사진 중 하나를 골라 얼굴을 블러 처리한 뒤
        게시해요.
      </Subtitle>

      {!selectedImage ? (
        <FormSection>
          <div>
            <FieldLabel>새 이미지 업로드</FieldLabel>
            <UploadZone $hasPreview={false}>
              <HiddenFileInput
                type="file"
                accept="image/*"
                onChange={handleFile}
              />
              <UploadHint>클릭해서 사진 선택</UploadHint>
            </UploadZone>
          </div>

          {myPhotos.length > 0 && (
            <div>
              <FieldLabel>내 업로드 사진에서 선택</FieldLabel>
              <PhotoRow>
                {myPhotos.map((p) => (
                  <PhotoThumbButton
                    type="button"
                    key={p.id}
                    onClick={() =>
                      setSelectedImage({
                        imageUrl: p.imageUrl!,
                        photoId: p.id,
                        place: p.place,
                      })
                    }
                  >
                    <ThumbImage src={p.imageUrl} alt={p.place} />
                  </PhotoThumbButton>
                ))}
              </PhotoRow>
            </div>
          )}

          <div>
            <FieldLabel>공개 범위</FieldLabel>
            <VisibilityPicker value={visibility} onChange={setVisibility} />
          </div>
        </FormSection>
      ) : (
        <BlurWrap>
          <BlurCanvas
            imageUrl={selectedImage.imageUrl}
            onCancel={() => setSelectedImage(null)}
            onConfirm={(dataUrl, blurRects) => {
              createPost({
                imageUrl: dataUrl,
                originalImageUrl: selectedImage.imageUrl,
                blurRects,
                photoId: selectedImage.photoId,
                place: selectedImage.place,
                visibility,
              });
              handleClose();
            }}
          />
        </BlurWrap>
      )}
    </Modal>
  );
}

function PostDetailModal({
  post,
  onClose,
}: {
  post: TagPost | null;
  onClose: () => void;
}) {
  const { currentUser, users } = useAuth();
  const {
    suggestionsForPost,
    suggestTag,
    reviewSuggestionByAdmin,
    reviewSuggestionByOwner,
    submitClaimPreferences,
    publishRequestsForPost,
    requestPublish,
    reviewPublishRequest,
    isAdmin,
  } = useTags();
  const { blockUser } = useReports();
  const [claimMode, setClaimMode] = useState<"self" | "report" | null>(null);
  const [claimedDate, setClaimedDate] = useState("");
  const [claimInfo, setClaimInfo] = useState("");
  const [reportedUserId, setReportedUserId] = useState("");
  const [pending, setPending] = useState({ x: 50, y: 50 });
  const [reportOpen, setReportOpen] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [prefMosaic, setPrefMosaic] = useState(true);
  const [prefPublish, setPrefPublish] = useState(true);
  // This modal stays mounted across different posts (TagBoard always
  // renders one instance), so switching posts without cancelling an
  // in-progress claim/report must not carry the stale form onto the new
  // post — e.g. a still-selected "제보" target getting submitted against
  // whichever post is opened next.
  const [openPostId, setOpenPostId] = useState(post?.id);
  if (post && post.id !== openPostId) {
    setOpenPostId(post.id);
    resetClaimForm();
  }

  if (!post) return null;
  const isOwner = currentUser?.id === post.ownerId;
  const owner = users.find((u) => u.id === post.ownerId);
  const memberOptions = [
    { value: "", label: "지목할 멤버 선택" },
    ...users
      .filter((u) => u.id !== currentUser?.id)
      .map((u) => ({
        value: u.id,
        label: `${u.name} (${u.grade}학년 ${u.className}반)`,
      })),
  ];
  const suggestions = suggestionsForPost(post.id);
  const approved = suggestions.filter((s) => s.status === "owner_approved");
  const pendingAdminList = suggestions.filter((s) => s.status === "pending");
  const pendingOwnerList = suggestions.filter((s) => {
    if (s.status !== "admin_approved") return false;
    const isSelfClaim = s.taggedUserId === s.submitterId;
    return !isSelfClaim || s.wantsMosaicRemoved !== undefined;
  });
  const publishRequests = publishRequestsForPost(post.id);
  const myPublishRequest = publishRequests.find(
    (r) => r.requesterId === currentUser?.id,
  );
  const pendingPublishRequests = publishRequests.filter(
    (r) => r.status === "pending",
  );
  const myVerifiedClaim = suggestions.some(
    (s) =>
      s.submitterId === currentUser?.id &&
      s.taggedUserId === currentUser?.id &&
      s.status === "owner_approved" &&
      s.wantsPublish,
  );
  const myPendingPreference = suggestions.find(
    (s) =>
      s.submitterId === currentUser?.id &&
      s.taggedUserId === currentUser?.id &&
      s.status === "admin_approved" &&
      s.wantsMosaicRemoved === undefined,
  );

  function handleImageClick(e: MouseEvent<HTMLDivElement>) {
    if (isOwner || !claimMode) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    setPending({
      x: ((e.clientX - bounds.left) / bounds.width) * 100,
      y: ((e.clientY - bounds.top) / bounds.height) * 100,
    });
  }

  function resetClaimForm() {
    setClaimMode(null);
    setPending({ x: 50, y: 50 });
    setClaimedDate("");
    setClaimInfo("");
    setReportedUserId("");
    setPrefMosaic(true);
    setPrefPublish(true);
    setClaimError(null);
  }

  async function submitClaim() {
    if (!currentUser || !claimInfo.trim()) return;
    setClaimError(null);
    try {
      await suggestTag({
        postId: post!.id,
        name: currentUser.name,
        taggedUserId: currentUser.id,
        claimedDate,
        extraInfo: claimInfo,
        x: pending.x,
        y: pending.y,
      });
      resetClaimForm();
    } catch (err) {
      console.error("본인 확인 요청 실패:", err);
      setClaimError("요청을 보내지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleSubmitPreferences() {
    if (!myPendingPreference) return;
    setClaimError(null);
    try {
      await submitClaimPreferences(myPendingPreference.id, {
        wantsMosaicRemoved: prefMosaic,
        wantsPublish: prefPublish,
      });
    } catch (err) {
      console.error("동의 여부 제출 실패:", err);
      setClaimError("제출하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function submitReport() {
    if (!reportedUserId) return;
    const reported = users.find((u) => u.id === reportedUserId);
    if (!reported) return;
    setClaimError(null);
    try {
      await suggestTag({
        postId: post!.id,
        name: reported.name,
        taggedUserId: reported.id,
        x: pending.x,
        y: pending.y,
      });
      resetClaimForm();
    } catch (err) {
      console.error("제보 실패:", err);
      setClaimError("제보를 보내지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleRequestPublish() {
    setPublishError(null);
    try {
      await requestPublish(post!.id);
    } catch (err) {
      console.error("Memory 게시 요청 실패:", err);
      setPublishError(
        err instanceof Error
          ? err.message
          : "요청을 보내지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    }
  }

  async function handlePublishDecision(
    requestId: string,
    decision: "blurred" | "original" | "rejected",
  ) {
    setPublishError(null);
    try {
      await reviewPublishRequest(requestId, decision);
    } catch (err) {
      console.error("Memory 게시 요청 처리 실패:", err);
      setPublishError("처리하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleAdminDecision(
    suggestionId: string,
    decision: "approved" | "rejected",
  ) {
    setClaimError(null);
    try {
      await reviewSuggestionByAdmin(suggestionId, decision);
    } catch (err) {
      console.error("신원 확인 처리 실패:", err);
      setClaimError("처리하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleOwnerDecision(
    suggestionId: string,
    decision: "approved" | "rejected",
  ) {
    setClaimError(null);
    try {
      await reviewSuggestionByOwner(suggestionId, decision);
    } catch (err) {
      console.error("공개 여부 처리 실패:", err);
      setClaimError("처리하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <Modal open onClose={onClose} widthClass="max-w-[520px]">
      <HeaderRow>
        <div>
          <Title>{post.place ?? "익명 게시물"}</Title>
          <MetaText>{owner ? `게시자: ${owner.name}` : "게시자: 알 수 없음"}</MetaText>
          <MetaText>
            {isOwner
              ? "내 게시물"
              : "본인이 나왔다면 '나예요', 다른 사람이 나온 것 같다면 '제보'를 눌러보세요"}
          </MetaText>
        </div>
        {!isOwner && (
          <ActionRow>
            <BlockButton type="button" onClick={() => blockUser(post.ownerId)}>
              차단
            </BlockButton>
            <ReportButton type="button" onClick={() => setReportOpen(true)}>
              신고
            </ReportButton>
          </ActionRow>
        )}
      </HeaderRow>

      <ImageFrame onClick={handleImageClick}>
        <PostImage src={post.imageUrl} alt={post.place ?? "tag post"} />
        {approved.map((s) => (
          <TagMarker key={s.id} style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <TagLabel>{s.name}</TagLabel>
          </TagMarker>
        ))}
        {!isOwner && claimMode && (
          <PendingMarker
            style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
          >
            <PendingDot />
          </PendingMarker>
        )}
      </ImageFrame>

      {!isOwner && myPendingPreference && (
        <FormSection>
          <MetaText>
            관리자가 신원을 확인했어요! 아래 두 가지를 직접 정해주세요.
          </MetaText>
          <div>
            <FieldLabel>모자이크를 해제할까요?</FieldLabel>
            <SuggestRow>
              <PillButton
                type="button"
                active={prefMosaic}
                onClick={() => setPrefMosaic(true)}
              >
                해제할래요
              </PillButton>
              <PillButton
                type="button"
                active={!prefMosaic}
                onClick={() => setPrefMosaic(false)}
              >
                그대로 둘래요
              </PillButton>
            </SuggestRow>
          </div>
          <div>
            <FieldLabel>Memory에 게시되는 것도 괜찮을까요?</FieldLabel>
            <SuggestRow>
              <PillButton
                type="button"
                active={prefPublish}
                onClick={() => setPrefPublish(true)}
              >
                괜찮아요
              </PillButton>
              <PillButton
                type="button"
                active={!prefPublish}
                onClick={() => setPrefPublish(false)}
              >
                안 돼요
              </PillButton>
            </SuggestRow>
          </div>
          {claimError && <ErrorText>{claimError}</ErrorText>}
          <PillButton type="button" active onClick={handleSubmitPreferences}>
            제출하기
          </PillButton>
        </FormSection>
      )}

      {!isOwner && !claimMode && !myPendingPreference && (
        <SuggestRow>
          <PillButton type="button" active onClick={() => setClaimMode("self")}>
            나예요
          </PillButton>
          <PillButton type="button" onClick={() => setClaimMode("report")}>
            제보
          </PillButton>
        </SuggestRow>
      )}

      {!isOwner && claimMode === "self" && !myPendingPreference && (
        <FormSection>
          <MetaText>
            표시가 본인이 아닌 곳에 있다면, 사진에서 본인 위치를 클릭해
            옮겨주세요.
          </MetaText>
          <div>
            <FieldLabel>촬영 장소</FieldLabel>
            <MetaText>{post.place ?? "정보 없음"}</MetaText>
          </div>
          <div>
            <FieldLabel>촬영 날짜 (아는 만큼 적어주세요)</FieldLabel>
            <ClaimInput
              placeholder="예: 2026년 5월경"
              value={claimedDate}
              onChange={(e) => setClaimedDate(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>추가 정보</FieldLabel>
            <ClaimTextArea
              placeholder="본인이 맞다는 걸 확인할 수 있는 정보를 적어주세요 (옷차림, 위치 등)"
              value={claimInfo}
              onChange={(e) => setClaimInfo(e.target.value)}
              rows={3}
            />
          </div>
          {claimError && <ErrorText>{claimError}</ErrorText>}
          <SuggestRow>
            <PillButton
              type="button"
              active
              disabled={!claimInfo.trim()}
              onClick={submitClaim}
            >
              확인 요청 보내기
            </PillButton>
            <PillButton type="button" onClick={resetClaimForm}>
              취소
            </PillButton>
          </SuggestRow>
        </FormSection>
      )}

      {!isOwner && claimMode === "report" && !myPendingPreference && (
        <FormSection>
          <MetaText>
            표시가 지목하려는 사람이 아니라면, 사진에서 그 위치를 클릭해
            옮겨주세요.
          </MetaText>
          <div>
            <FieldLabel>이 사람은 누구인가요?</FieldLabel>
            <Dropdown
              value={reportedUserId}
              onChange={setReportedUserId}
              options={memberOptions}
            />
          </div>
          {claimError && <ErrorText>{claimError}</ErrorText>}
          <SuggestRow>
            <PillButton
              type="button"
              active
              disabled={!reportedUserId}
              onClick={submitReport}
            >
              제보하기
            </PillButton>
            <PillButton type="button" onClick={resetClaimForm}>
              취소
            </PillButton>
          </SuggestRow>
        </FormSection>
      )}

      {!isOwner && (
        <SuggestRow>
          {myPublishRequest?.status === "pending" ? (
            <EmptyNote>
              Memory 게시를 요청했어요. 게시물 주인의 승인을 기다리는 중이에요.
            </EmptyNote>
          ) : myVerifiedClaim ? (
            <PillButton type="button" onClick={handleRequestPublish}>
              Memory에 올려도 될까요?
            </PillButton>
          ) : (
            <EmptyNote>
              "나예요" 요청이 관리자·게시물 주인에게 모두 승인되면 Memory 게시를
              요청할 수 있어요.
            </EmptyNote>
          )}
        </SuggestRow>
      )}
      {!isOwner && publishError && <ErrorText>{publishError}</ErrorText>}

      {isAdmin && (
        <PendingSection>
          <SectionLabel>
            [관리자] 신원 확인 대기 ({pendingAdminList.length})
          </SectionLabel>
          {post.originalImageUrl && pendingAdminList.length > 0 && (
            <OriginalPreview src={post.originalImageUrl} alt="원본 사진" />
          )}
          {pendingAdminList.length === 0 ? (
            <EmptyNote>대기 중인 요청이 없어요.</EmptyNote>
          ) : (
            <PendingList>
              {pendingAdminList.map((s) => {
                const isSelfClaim = s.taggedUserId === s.submitterId;
                return (
                  <PendingItem key={s.id}>
                    <PendingItemText>
                      {isSelfClaim
                        ? `${s.name}님이 본인이라며 확인을 요청했어요`
                        : `누군가 이 사진 속 인물이 "${s.name}"님이라고 제보했어요`}
                      {isSelfClaim && s.claimedDate && (
                        <MetaText>촬영 날짜: {s.claimedDate}</MetaText>
                      )}
                      {isSelfClaim && s.extraInfo && (
                        <MetaText>{s.extraInfo}</MetaText>
                      )}
                    </PendingItemText>
                    <PendingItemActions>
                      <ApproveButton
                        type="button"
                        onClick={() => handleAdminDecision(s.id, "approved")}
                      >
                        신원 확인됨
                      </ApproveButton>
                      <RejectButton
                        type="button"
                        onClick={() => handleAdminDecision(s.id, "rejected")}
                      >
                        거절
                      </RejectButton>
                    </PendingItemActions>
                  </PendingItem>
                );
              })}
            </PendingList>
          )}
          {claimError && <ErrorText>{claimError}</ErrorText>}
        </PendingSection>
      )}

      {isOwner && (
        <PendingSection>
          <SectionLabel>
            공개 여부 결정 ({pendingOwnerList.length})
          </SectionLabel>
          {pendingOwnerList.length === 0 ? (
            <EmptyNote>관리자 확인을 거쳐 대기 중인 요청이 없어요.</EmptyNote>
          ) : (
            <PendingList>
              {pendingOwnerList.map((s) => {
                const isSelfClaim = s.taggedUserId === s.submitterId;
                return (
                  <PendingItem key={s.id}>
                    <PendingItemText>
                      {isSelfClaim
                        ? `${s.name}님의 본인 확인이 완료됐어요. 공개해도 될까요?`
                        : `"${s.name}"님 태그가 관리자 확인을 거쳤어요. 반영해도 될까요?`}
                      {isSelfClaim && (
                        <MetaText>
                          모자이크 해제:{" "}
                          {s.wantsMosaicRemoved ? "원함" : "원치 않음"} · Memory
                          게시: {s.wantsPublish ? "동의" : "비동의"}
                        </MetaText>
                      )}
                    </PendingItemText>
                    <PendingItemActions>
                      <ApproveButton
                        type="button"
                        onClick={() => handleOwnerDecision(s.id, "approved")}
                      >
                        공개
                      </ApproveButton>
                      <RejectButton
                        type="button"
                        onClick={() => handleOwnerDecision(s.id, "rejected")}
                      >
                        거절
                      </RejectButton>
                    </PendingItemActions>
                  </PendingItem>
                );
              })}
            </PendingList>
          )}
          {claimError && <ErrorText>{claimError}</ErrorText>}
        </PendingSection>
      )}

      {isOwner && (
        <PendingSection>
          <SectionLabel>Memory 게시 요청 ({pendingPublishRequests.length})</SectionLabel>
          {pendingPublishRequests.length === 0 ? (
            <EmptyNote>대기 중인 게시 요청이 없어요.</EmptyNote>
          ) : (
            <PendingList>
              {pendingPublishRequests.map((r) => (
                <PendingItem key={r.id}>
                  <PendingItemText>
                    Memory에 올려달라는 요청이 있어요
                  </PendingItemText>
                  <PendingItemActions>
                    <ApproveButton
                      type="button"
                      onClick={() => handlePublishDecision(r.id, "blurred")}
                    >
                      블러로 올리기
                    </ApproveButton>
                    {post.originalImageUrl && (
                      <AltApproveButton
                        type="button"
                        onClick={() => handlePublishDecision(r.id, "original")}
                      >
                        원본으로 올리기
                      </AltApproveButton>
                    )}
                    <RejectButton
                      type="button"
                      onClick={() => handlePublishDecision(r.id, "rejected")}
                    >
                      거절
                    </RejectButton>
                  </PendingItemActions>
                </PendingItem>
              ))}
            </PendingList>
          )}
        </PendingSection>
      )}
      {isOwner && publishError && <ErrorText>{publishError}</ErrorText>}

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="tag_post"
        targetId={post.id}
        targetOwnerId={post.ownerId}
      />
    </Modal>
  );
}

export default function TagBoard() {
  const { currentUser, users } = useAuth();
  const { posts, isAdmin } = useTags();
  const { isBlocked } = useReports();
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [selected, setSelected] = useState<TagPost | null>(null);
  const [gradeFilter, setGradeFilter] = useState<number | "all">(
    currentUser?.grade ?? "all",
  );

  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  );

  const visiblePosts = posts.filter((p) => {
    const owner = usersById.get(p.ownerId);
    // Admins need to see every post to review pending identity checks,
    // regardless of the post's grade/class visibility scope.
    if (isAdmin) return true;
    return (
      !isBlocked(p.ownerId) &&
      (gradeFilter === "all" || owner?.grade === gradeFilter) &&
      isVisibleToViewer(p.visibility, owner, currentUser ?? undefined)
    );
  });

  return (
    <PageWrapper>
      <PageHeaderRow>
        <div>
          <PageTitle>Anonymous Tagging</PageTitle>
          <PageSubtitle>
            얼굴을 블러 처리한 사진에서 본인을 찾으면 "나예요"로, 다른 사람을
            알아보면 "제보"로 알려주세요.
          </PageSubtitle>
        </div>
        <PillButton type="button" onClick={() => setNewPostOpen(true)}>
          + 새 게시물
        </PillButton>
      </PageHeaderRow>

      <FilterRow>
        {GRADE_FILTERS.map((g) => (
          <PillButton
            key={g.id}
            type="button"
            active={gradeFilter === g.id}
            onClick={() => setGradeFilter(g.id)}
          >
            {g.label}
          </PillButton>
        ))}
      </FilterRow>

      {visiblePosts.length === 0 ? (
        <EmptyState interactive={false}>아직 게시물이 없어요.</EmptyState>
      ) : (
        <PostGrid>
          {visiblePosts.map((post) => {
            const owner = usersById.get(post.ownerId);
            return (
              <PostCard key={post.id} onClick={() => setSelected(post)}>
                <PostThumb src={post.imageUrl} alt={post.place ?? "tag post"} />
                <PostCaption>{post.place ?? "익명 게시물"}</PostCaption>
                <PostMeta>{owner ? owner.name : "알 수 없음"}</PostMeta>
              </PostCard>
            );
          })}
        </PostGrid>
      )}

      <NewPostModal open={newPostOpen} onClose={() => setNewPostOpen(false)} />
      <PostDetailModal
        post={selected ? (posts.find((p) => p.id === selected.id) ?? null) : null}
        onClose={() => setSelected(null)}
      />
    </PageWrapper>
  );
}

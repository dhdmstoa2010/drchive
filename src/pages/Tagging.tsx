import { useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { PillButton } from "../components/ui/PillButton";
import { Modal } from "../components/Modal";
import { BlurCanvas } from "../components/BlurCanvas";
import { ReportModal } from "../components/ReportModal";
import { VisibilityPicker } from "../components/ui/VisibilityPicker";
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
    reviewSuggestion,
    publishRequestsForPost,
    requestPublish,
    reviewPublishRequest,
  } = useTags();
  const { blockUser } = useReports();
  const [claiming, setClaiming] = useState(false);
  const [claimedDate, setClaimedDate] = useState("");
  const [claimInfo, setClaimInfo] = useState("");
  const [pending, setPending] = useState({ x: 50, y: 50 });
  const [reportOpen, setReportOpen] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  if (!post) return null;
  const isOwner = currentUser?.id === post.ownerId;
  const owner = users.find((u) => u.id === post.ownerId);
  const suggestions = suggestionsForPost(post.id);
  const approved = suggestions.filter((s) => s.status === "approved");
  const pendingList = suggestions.filter((s) => s.status === "pending");
  const published = !!post.publishedPhotoId;
  const publishRequests = publishRequestsForPost(post.id);
  const myPublishRequest = publishRequests.find(
    (r) => r.requesterId === currentUser?.id,
  );
  const pendingPublishRequests = publishRequests.filter(
    (r) => r.status === "pending",
  );

  function handleImageClick(e: MouseEvent<HTMLDivElement>) {
    if (isOwner || !claiming) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    setPending({
      x: ((e.clientX - bounds.left) / bounds.width) * 100,
      y: ((e.clientY - bounds.top) / bounds.height) * 100,
    });
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
      setClaiming(false);
      setPending({ x: 50, y: 50 });
      setClaimedDate("");
      setClaimInfo("");
    } catch (err) {
      console.error("본인 확인 요청 실패:", err);
      setClaimError("요청을 보내지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleRequestPublish() {
    setPublishError(null);
    try {
      await requestPublish(post!.id);
    } catch (err) {
      console.error("Memory 게시 요청 실패:", err);
      setPublishError("요청을 보내지 못했어요. 잠시 후 다시 시도해주세요.");
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

  async function handleClaimDecision(
    suggestionId: string,
    decision: "approved" | "rejected",
  ) {
    setClaimError(null);
    try {
      await reviewSuggestion(suggestionId, decision);
    } catch (err) {
      console.error("본인 확인 요청 처리 실패:", err);
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
              : "본인이 나온 사진이라면 '나예요' 버튼으로 확인을 요청해보세요"}
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
        {!isOwner && claiming && (
          <PendingMarker
            style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
          >
            <PendingDot />
          </PendingMarker>
        )}
      </ImageFrame>

      {!isOwner && !claiming && (
        <SuggestRow>
          <PillButton type="button" active onClick={() => setClaiming(true)}>
            나예요
          </PillButton>
        </SuggestRow>
      )}

      {!isOwner && claiming && (
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
            <PillButton type="button" onClick={() => setClaiming(false)}>
              취소
            </PillButton>
          </SuggestRow>
        </FormSection>
      )}

      {!isOwner && (
        <SuggestRow>
          {published ? (
            <EmptyNote>이 게시물은 이미 Memory에 게시됐어요.</EmptyNote>
          ) : myPublishRequest?.status === "pending" ? (
            <EmptyNote>
              Memory 게시를 요청했어요. 게시물 주인의 승인을 기다리는 중이에요.
            </EmptyNote>
          ) : (
            <PillButton type="button" onClick={handleRequestPublish}>
              Memory에 올려도 될까요?
            </PillButton>
          )}
        </SuggestRow>
      )}
      {!isOwner && publishError && <ErrorText>{publishError}</ErrorText>}

      {isOwner && (
        <PendingSection>
          <SectionLabel>본인 확인 요청 ({pendingList.length})</SectionLabel>
          {post.originalImageUrl && pendingList.length > 0 && (
            <OriginalPreview src={post.originalImageUrl} alt="원본 사진" />
          )}
          {pendingList.length === 0 ? (
            <EmptyNote>대기 중인 요청이 없어요.</EmptyNote>
          ) : (
            <PendingList>
              {pendingList.map((s) => (
                <PendingItem key={s.id}>
                  <PendingItemText>
                    {s.name}님이 본인이라며 확인을 요청했어요
                    {s.claimedDate && (
                      <MetaText>촬영 날짜: {s.claimedDate}</MetaText>
                    )}
                    {s.extraInfo && <MetaText>{s.extraInfo}</MetaText>}
                  </PendingItemText>
                  <PendingItemActions>
                    <ApproveButton
                      type="button"
                      onClick={() => handleClaimDecision(s.id, "approved")}
                    >
                      승인
                    </ApproveButton>
                    <RejectButton
                      type="button"
                      onClick={() => handleClaimDecision(s.id, "rejected")}
                    >
                      거절
                    </RejectButton>
                  </PendingItemActions>
                </PendingItem>
              ))}
            </PendingList>
          )}
          {claimError && <ErrorText>{claimError}</ErrorText>}
        </PendingSection>
      )}

      {isOwner && (
        <PendingSection>
          <SectionLabel>Memory 게시 요청 ({pendingPublishRequests.length})</SectionLabel>
          {published ? (
            <EmptyNote>이 게시물은 이미 Memory에 게시됐어요.</EmptyNote>
          ) : pendingPublishRequests.length === 0 ? (
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
  const { posts } = useTags();
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
            얼굴을 블러 처리한 사진에서 본인을 찾으면 "나예요"로 확인을
            요청해보세요.
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
      <PostDetailModal post={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  );
}

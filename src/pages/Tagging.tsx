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
  Input,
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
  RejectButton,
  FilterRow,
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
            onConfirm={(dataUrl) => {
              createPost({
                imageUrl: dataUrl,
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
  const { currentUser } = useAuth();
  const { suggestionsForPost, suggestTag, reviewSuggestion } = useTags();
  const { blockUser } = useReports();
  const [name, setName] = useState("");
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  if (!post) return null;
  const isOwner = currentUser?.id === post.ownerId;
  const suggestions = suggestionsForPost(post.id);
  const approved = suggestions.filter((s) => s.status === "approved");
  const pendingList = suggestions.filter((s) => s.status === "pending");

  function handleImageClick(e: MouseEvent<HTMLDivElement>) {
    if (isOwner) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    setPending({
      x: ((e.clientX - bounds.left) / bounds.width) * 100,
      y: ((e.clientY - bounds.top) / bounds.height) * 100,
    });
  }

  function submitSuggestion() {
    if (!pending || !name.trim()) return;
    suggestTag({
      postId: post!.id,
      name: name.trim(),
      x: pending.x,
      y: pending.y,
    });
    setPending(null);
    setName("");
  }

  return (
    <Modal open onClose={onClose} widthClass="max-w-[520px]">
      <HeaderRow>
        <div>
          <Title>{post.place ?? "익명 게시물"}</Title>
          <MetaText>
            {isOwner
              ? "내 게시물"
              : "사진을 클릭해 친구를 태그해보세요 (익명으로 제보돼요)"}
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
        {pending && (
          <PendingMarker
            style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
          >
            <PendingDot />
          </PendingMarker>
        )}
      </ImageFrame>

      {!isOwner && pending && (
        <SuggestRow>
          <Input
            autoFocus
            placeholder="이 사람은 누구인가요?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <PillButton type="button" active onClick={submitSuggestion}>
            제보
          </PillButton>
        </SuggestRow>
      )}

      {isOwner && (
        <PendingSection>
          <SectionLabel>대기 중인 제보 ({pendingList.length})</SectionLabel>
          {pendingList.length === 0 ? (
            <EmptyNote>대기 중인 제보가 없어요.</EmptyNote>
          ) : (
            <PendingList>
              {pendingList.map((s) => (
                <PendingItem key={s.id}>
                  <PendingItemText>"{s.name}" 태그 제보</PendingItemText>
                  <PendingItemActions>
                    <ApproveButton
                      type="button"
                      onClick={() => reviewSuggestion(s.id, "approved")}
                    >
                      승인
                    </ApproveButton>
                    <RejectButton
                      type="button"
                      onClick={() => reviewSuggestion(s.id, "rejected")}
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
            얼굴을 블러 처리한 사진에 친구를 익명으로 태그해보세요.
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
          {visiblePosts.map((post) => (
            <PostCard key={post.id} onClick={() => setSelected(post)}>
              <PostThumb src={post.imageUrl} alt={post.place ?? "tag post"} />
              <PostCaption>{post.place ?? "익명 게시물"}</PostCaption>
            </PostCard>
          ))}
        </PostGrid>
      )}

      <NewPostModal open={newPostOpen} onClose={() => setNewPostOpen(false)} />
      <PostDetailModal post={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  );
}

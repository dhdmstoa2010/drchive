import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { BlurRect } from "../types";
import {
  Wrapper,
  HelperText,
  LoadingText,
  StyledCanvas,
  UndoButton,
  ErrorText,
  ButtonRow,
  CancelButton,
  ConfirmButton,
} from "./style/BlurCanvas.style";

type Rect = { x: number; y: number; w: number; h: number };

const BLUR_RADIUS = 14;
const MAX_DISPLAY_WIDTH = 380;
// Firestore documents are capped at 1MiB, so the exported image needs to be
// downscaled — a raw phone photo at full resolution easily blows past that.
const MAX_OUTPUT_DIMENSION = 1280;

type BlurCanvasProps = {
  imageUrl: string;
  onConfirm: (dataUrl: string, blurRects: BlurRect[]) => void;
  onCancel: () => void;
};

function applyBlurRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rect: Rect,
  drawScale: number,
) {
  if (rect.w <= 0 || rect.h <= 0) return;
  ctx.save();
  ctx.filter = `blur(${BLUR_RADIUS}px)`;
  ctx.drawImage(
    img,
    rect.x,
    rect.y,
    rect.w,
    rect.h,
    rect.x * drawScale,
    rect.y * drawScale,
    rect.w * drawScale,
    rect.h * drawScale,
  );
  ctx.restore();
}

export function BlurCanvas({ imageUrl, onConfirm, onCancel }: BlurCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [dragging, setDragging] = useState<Rect | null>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setScale(Math.min(1, MAX_DISPLAY_WIDTH / img.naturalWidth));
      setReady(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const dispW = img.naturalWidth * scale;
    const dispH = img.naturalHeight * scale;
    canvas.width = dispW;
    canvas.height = dispH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dispW, dispH);
    ctx.drawImage(img, 0, 0, dispW, dispH);
    rects.forEach((r) => applyBlurRect(ctx, img, r, scale));

    ctx.strokeStyle = "rgba(150,110,190,0.9)";
    ctx.lineWidth = 2;
    rects.forEach((r) => {
      ctx.strokeRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
    });

    if (dragging) {
      ctx.fillStyle = "rgba(150,110,190,0.25)";
      ctx.fillRect(
        dragging.x * scale,
        dragging.y * scale,
        dragging.w * scale,
        dragging.h * scale,
      );
      ctx.strokeRect(
        dragging.x * scale,
        dragging.y * scale,
        dragging.w * scale,
        dragging.h * scale,
      );
    }
  }, [ready, rects, dragging, scale]);

  function toImageCoords(e: MouseEvent<HTMLCanvasElement>) {
    const bounds = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - bounds.left) / scale,
      y: (e.clientY - bounds.top) / scale,
    };
  }

  function handleMouseDown(e: MouseEvent<HTMLCanvasElement>) {
    const point = toImageCoords(e);
    dragStart.current = point;
    setDragging({ x: point.x, y: point.y, w: 0, h: 0 });
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!dragStart.current) return;
    const point = toImageCoords(e);
    const start = dragStart.current;
    setDragging({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      w: Math.abs(point.x - start.x),
      h: Math.abs(point.y - start.y),
    });
  }

  function handleMouseUp() {
    if (dragging && dragging.w > 4 && dragging.h > 4) {
      setRects((prev) => [...prev, dragging]);
      setError(null);
    }
    setDragging(null);
    dragStart.current = null;
  }

  function undoLast() {
    setRects((prev) => prev.slice(0, -1));
  }

  function handleConfirm() {
    if (rects.length === 0) {
      setError("블러 처리할 얼굴 부분을 최소 1곳 드래그해주세요.");
      return;
    }
    const img = imgRef.current;
    if (!img) return;
    const outputScale = Math.min(
      1,
      MAX_OUTPUT_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const out = document.createElement("canvas");
    out.width = Math.round(img.naturalWidth * outputScale);
    out.height = Math.round(img.naturalHeight * outputScale);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, out.width, out.height);
    rects.forEach((r) => applyBlurRect(ctx, img, r, outputScale));
    const blurRects: BlurRect[] = rects.map((r) => ({
      x: r.x / img.naturalWidth,
      y: r.y / img.naturalHeight,
      w: r.w / img.naturalWidth,
      h: r.h / img.naturalHeight,
    }));
    onConfirm(out.toDataURL("image/jpeg", 0.82), blurRects);
  }

  return (
    <Wrapper>
      <HelperText>
        얼굴이 보이는 부분을 마우스로 드래그해서 블러 처리하세요. (자동 인식이
        아니라 직접 지정하는 방식이에요)
      </HelperText>
      {!ready ? (
        <LoadingText>이미지를 불러오는 중...</LoadingText>
      ) : (
        <StyledCanvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      )}
      <UndoButton type="button" onClick={undoLast} disabled={rects.length === 0}>
        마지막 영역 지우기 ({rects.length}개 지정됨)
      </UndoButton>
      {error && <ErrorText>{error}</ErrorText>}
      <ButtonRow>
        <CancelButton type="button" onClick={onCancel}>
          취소
        </CancelButton>
        <ConfirmButton type="button" onClick={handleConfirm}>
          블러 확정하고 계속
        </ConfirmButton>
      </ButtonRow>
    </Wrapper>
  );
}

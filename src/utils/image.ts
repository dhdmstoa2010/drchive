const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.82;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러올 수 없어요."));
    img.src = src;
  });
}

export function resizeImage(
  img: HTMLImageElement,
  maxDimension = MAX_DIMENSION,
  quality = JPEG_QUALITY,
): string {
  const scale = Math.min(
    1,
    maxDimension / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없어요.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function fileToResizedDataUrl(
  file: File,
  maxDimension = MAX_DIMENSION,
  quality = JPEG_QUALITY,
): Promise<string> {
  const reader = new FileReader();
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const img = await loadImage(rawDataUrl);
  return resizeImage(img, maxDimension, quality);
}

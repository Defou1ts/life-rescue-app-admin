import type { ImageDto } from "@/api/kyc/types";

export function getKycImageSrc(image: ImageDto | null | undefined) {
  if (!image?.base64Content) {
    return null;
  }

  const extension = image.fileName.split(".").pop()?.toLowerCase();
  const mimeType =
    extension === "png"
      ? "image/png"
      : extension === "webp"
        ? "image/webp"
        : "image/jpeg";

  return `data:${mimeType};base64,${image.base64Content}`;
}

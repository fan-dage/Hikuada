/** Maps DB `image_object_fit` to ProductImagePreview prop (default cover). */
export function productCardImageObjectFit(raw: string | null | undefined): "cover" | "contain" {
  return raw?.trim().toLowerCase() === "contain" ? "contain" : "cover";
}

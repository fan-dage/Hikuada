/** True when Accept-Language lists Vietnamese ahead of or without English preference. */
export function acceptLanguagePrefersVietnamese(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const parts = acceptLanguage.split(",").map((chunk) => {
    const tag = chunk.split(";")[0]?.trim().toLowerCase();
    const qPart = chunk.split(";").find((p) => p.trim().toLowerCase().startsWith("q="));
    const q = qPart ? Number(qPart.split("=")[1]) : 1;
    return { tag: tag || "", q: Number.isFinite(q) ? q : 1 };
  });

  let bestVi = 0;
  let bestEn = 0;
  for (const { tag, q } of parts) {
    if (!tag) continue;
    if (tag === "vi" || tag.startsWith("vi-")) bestVi = Math.max(bestVi, q);
    if (tag === "en" || tag.startsWith("en-")) bestEn = Math.max(bestEn, q);
  }
  if (bestVi > 0 && bestEn <= 0) return true;
  if (bestVi > bestEn) return true;
  return false;
}

export function countryIsVietnam(country: string | null | undefined): boolean {
  return (country || "").trim().toUpperCase() === "VN";
}

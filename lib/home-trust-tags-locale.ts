import type { AppLocale } from "@/lib/site-locale-constants";

/** English labels from Admin `hikuada_home_tags` or code defaults → Vietnamese for `vi` locale. */
const HOME_TRUST_TAG_EN_TO_VI: Record<string, string> = {
  "Direct Factory Price": "Giá xưởng trực tiếp",
  "Fast Shipping to Vietnam": "Giao nhanh về Việt Nam",
  "Strict Quality Control": "Kiểm soát chất lượng nghiêm ngặt",
  "Source Factory Direct": "Nguồn trực tiếp từ xưởng",
  "Worldwide Logistics": "Hậu cần toàn cầu",
  "Premium Quality Assurance": "Đảm bảo chất lượng cao cấp",
  "Premium Quality Control": "Kiểm soát chất lượng cao cấp",
  "Global Shipping": "Vận chuyển toàn cầu",
};

export function localizeHomeTrustTags(labels: string[], locale: AppLocale): string[] {
  if (locale !== "vi") return labels;
  return labels.map((raw) => {
    const key = raw.trim();
    return HOME_TRUST_TAG_EN_TO_VI[key] ?? raw;
  });
}

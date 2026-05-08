import type { AppLocale } from "@/lib/site-locale-constants";

/** Fallback when DB row missing or query fails (matches previous homepage copy). */
export const BANNER_HERO_DEFAULTS = {
  badge_text: "PS MOLDINGS | FACTORY DIRECT",
  headline: "Premium PS Moldings Factory Direct",
  subheading:
    "Specialized in Southeast Asia markets with Form E support and door-to-door double-clearance logistics.",
  pill_tag_1: "OEM/ODM Service",
  pill_tag_2: "Stable Output Capacity",
  pill_tag_3: "Export Standard Packing",
} as const;

/** Vietnamese hero overlay when site locale is `vi` (English hero copy still comes from DB for `en`). */
export const BANNER_HERO_VI: BannerHeroRow = {
  badge_text: "PHÀO CHỈ PS | TRỰC TIẾP XƯỞNG",
  headline: "Xưởng phào chỉ PS cao cấp — giao hàng trực tiếp từ nhà máy",
  subheading:
    "Giải pháp chuỗi cung ứng toàn cầu, giao nhận quốc tế và kinh nghiệm xuất khẩu chuyên nghiệp.",
  pill_tag_1: "Dịch vụ OEM/ODM",
  pill_tag_2: "Năng lực sản xuất ổn định",
  pill_tag_3: "Đóng gói theo tiêu chuẩn xuất khẩu",
};

/** Maps common English hero pill / tag lines from DB or older defaults to Vietnamese. */
const HERO_LINE_EN_TO_VI: Record<string, string> = {
  [BANNER_HERO_DEFAULTS.pill_tag_1]: BANNER_HERO_VI.pill_tag_1,
  [BANNER_HERO_DEFAULTS.pill_tag_2]: BANNER_HERO_VI.pill_tag_2,
  [BANNER_HERO_DEFAULTS.pill_tag_3]: BANNER_HERO_VI.pill_tag_3,
  "Premium Quality Control": "Kiểm soát chất lượng cao cấp",
  "Global Shipping": "Vận chuyển toàn cầu",
  "Source Factory Direct": "Nguồn trực tiếp từ xưởng",
  "Worldwide Logistics": "Hậu cần toàn cầu",
  "Premium Quality Assurance": "Đảm bảo chất lượng cao cấp",
};

export type BannerHeroRow = {
  badge_text: string;
  headline: string;
  subheading: string;
  pill_tag_1: string;
  pill_tag_2: string;
  pill_tag_3: string;
};

export function normalizeBannerHero(row: Partial<BannerHeroRow> | null | undefined): BannerHeroRow {
  const d = BANNER_HERO_DEFAULTS;
  return {
    badge_text: row?.badge_text?.trim() || d.badge_text,
    headline: row?.headline?.trim() || d.headline,
    subheading: row?.subheading?.trim() || d.subheading,
    pill_tag_1: row?.pill_tag_1?.trim() ?? d.pill_tag_1,
    pill_tag_2: row?.pill_tag_2?.trim() ?? d.pill_tag_2,
    pill_tag_3: row?.pill_tag_3?.trim() ?? d.pill_tag_3,
  };
}

export function heroPillTags(hero: BannerHeroRow): string[] {
  return [hero.pill_tag_1, hero.pill_tag_2, hero.pill_tag_3].map((s) => s.trim()).filter(Boolean);
}

/**
 * Hero text is stored in English in the database. When the visitor uses Vietnamese UI, show
 * localized hero copy (and map known English pill strings to Vietnamese when pills differ from defaults).
 */
export function bannerHeroForLocale(hero: BannerHeroRow, locale: AppLocale): BannerHeroRow {
  if (locale !== "vi") return hero;

  const pill1 = HERO_LINE_EN_TO_VI[hero.pill_tag_1.trim()] ?? hero.pill_tag_1;
  const pill2 = HERO_LINE_EN_TO_VI[hero.pill_tag_2.trim()] ?? hero.pill_tag_2;
  const pill3 = HERO_LINE_EN_TO_VI[hero.pill_tag_3.trim()] ?? hero.pill_tag_3;

  const subEnToVi: Record<string, string> = {
    [BANNER_HERO_DEFAULTS.subheading]:
      "Chuyên thị trường Đông Nam Á, hỗ trợ Form E và logistics door-to-door thông quan hai đầu.",
    "Global supply chain solutions with worldwide shipping and professional export expertise.":
      "Giải pháp chuỗi cung ứng toàn cầu, giao nhận quốc tế và kinh nghiệm xuất khẩu chuyên nghiệp.",
  };

  return {
    badge_text: hero.badge_text.trim() === BANNER_HERO_DEFAULTS.badge_text ? BANNER_HERO_VI.badge_text : hero.badge_text,
    headline:
      hero.headline.trim() === BANNER_HERO_DEFAULTS.headline ? BANNER_HERO_VI.headline : hero.headline,
    subheading: subEnToVi[hero.subheading.trim()] ?? hero.subheading,
    pill_tag_1: pill1,
    pill_tag_2: pill2,
    pill_tag_3: pill3,
  };
}

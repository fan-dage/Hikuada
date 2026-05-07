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

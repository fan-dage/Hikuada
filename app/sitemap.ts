import type { MetadataRoute } from "next";
import { PRODUCT_DETAIL_CATEGORY_SLUG } from "@/lib/product-catalog-back-href";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getSiteBaseUrl } from "@/lib/site-url";

const STATIC_PATHS = [
  "",
  "/about",
  "/products",
  "/how-to-order",
  "/privacy-policy",
  "/business-terms",
  "/business-terms/vi",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteBaseUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const loc of ["en", "vi"] as const) {
    for (const p of STATIC_PATHS) {
      const path = p === "" ? `/${loc}` : `/${loc}${p}`;
      entries.push({
        url: `${base}${path}`,
        lastModified: new Date(),
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1 : 0.8,
      });
    }
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("hikuada_products")
      .select("id, created_at")
      .eq("category", PRODUCT_DETAIL_CATEGORY_SLUG);

    for (const row of data ?? []) {
      const id = row.id as number;
      const lastModified = row.created_at ? new Date(row.created_at as string) : new Date();
      for (const loc of ["en", "vi"] as const) {
        entries.push({
          url: `${base}/${loc}/products/${id}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Build-time or missing env: static routes only
  }

  return entries;
}

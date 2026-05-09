import { headers } from "next/headers";
import type { Metadata } from "next";
import type { AppLocale } from "@/lib/site-locale-constants";
import { HIKUADA_PUBLIC_PATH_HEADER } from "@/lib/site-locale-constants";
import { getSiteBaseUrl } from "@/lib/site-url";

/** Strip `/en` or `/vi` URL prefix so we can build cross-locale alternates. */
export function logicalPathFromPublicPath(publicPath: string): string {
  const p = publicPath.split("?")[0] || "/";
  if (p === "/vi" || p === "/vi/") return "/";
  if (p === "/en" || p === "/en/") return "/";
  if (p.startsWith("/vi/")) return p.slice(3) || "/";
  if (p.startsWith("/en/")) return p.slice(3) || "/";
  return p || "/";
}

export async function getRequestCanonicalUrl(): Promise<string> {
  const h = await headers();
  const pub = h.get(HIKUADA_PUBLIC_PATH_HEADER) ?? "/";
  const path = pub.split("?")[0] || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (!host) return `${getSiteBaseUrl()}${normalized}`;
  return `${proto}://${host}${normalized}`;
}

export function localePrefixedAbsoluteUrl(logicalPath: string, locale: AppLocale): string {
  const base = getSiteBaseUrl();
  const suffix = logicalPath === "/" ? "" : logicalPath;
  const prefix = locale === "vi" ? "/vi" : "/en";
  return `${base}${prefix}${suffix}`;
}

/** hreflang alternates for English and Vietnamese crawlable URLs (`/en/...`, `/vi/...`). */
export function buildHreflangAlternates(logicalPath: string): NonNullable<Metadata["alternates"]>["languages"] {
  return {
    en: localePrefixedAbsoluteUrl(logicalPath, "en"),
    vi: localePrefixedAbsoluteUrl(logicalPath, "vi"),
    "x-default": localePrefixedAbsoluteUrl(logicalPath, "en"),
  };
}

export async function alternatesWithCanonical(logicalPath: string): Promise<Pick<Metadata, "alternates">> {
  const canonical = await getRequestCanonicalUrl();
  return {
    alternates: {
      canonical,
      languages: buildHreflangAlternates(logicalPath),
    },
  };
}

/** SEO keyword footers (requested EN/VI phrases; no separate CN site URL). */
export function withSeoKeywordFootnote(description: string, locale: AppLocale): string {
  const d = description.trim();
  if (locale === "vi") {
    if (/Phào chỉ PS/i.test(d) && /[Xx]ưởng sản xuất/i.test(d) && /[Gg]iá sỉ/i.test(d)) return d;
    return `${d} Phào chỉ PS (PS moldings), xưởng sản xuất, giá sỉ — FCL toàn cầu.`;
  }
  if (/PS frame molding manufacturer/i.test(d) && /Wholesale picture frames/i.test(d) && /FCL shipping/i.test(d)) {
    return d;
  }
  return `${d} PS frame molding manufacturer, wholesale picture frames, FCL shipping.`;
}

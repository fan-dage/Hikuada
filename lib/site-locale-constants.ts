export const HIKUADA_LOCALE_COOKIE = "hikuada_locale";
export const HIKUADA_LOCALE_HEADER = "x-hikuada-locale";
/** Original request path (may include `/en` or `/vi` prefix) for canonicals and hreflang logical paths. */
export const HIKUADA_PUBLIC_PATH_HEADER = "x-hikuada-public-path";

export type AppLocale = "en" | "vi";

export const APP_LOCALES: AppLocale[] = ["en", "vi"];

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === "en" || value === "vi";
}

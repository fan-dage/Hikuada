export const HIKUADA_LOCALE_COOKIE = "hikuada_locale";
export const HIKUADA_LOCALE_HEADER = "x-hikuada-locale";

export type AppLocale = "en" | "vi";

export const APP_LOCALES: AppLocale[] = ["en", "vi"];

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === "en" || value === "vi";
}

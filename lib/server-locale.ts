import { cookies, headers } from "next/headers";
import type { AppLocale } from "@/lib/site-locale-constants";
import { HIKUADA_LOCALE_COOKIE, HIKUADA_LOCALE_HEADER, isAppLocale } from "@/lib/site-locale-constants";

export async function getServerLocale(): Promise<AppLocale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(HIKUADA_LOCALE_HEADER);
  if (isAppLocale(fromHeader)) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(HIKUADA_LOCALE_COOKIE)?.value;
  if (isAppLocale(fromCookie)) return fromCookie;

  return "en";
}

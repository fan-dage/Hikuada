import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { acceptLanguagePrefersVietnamese, countryIsVietnam } from "@/lib/detect-locale";
import type { AppLocale } from "@/lib/site-locale-constants";
import { HIKUADA_LOCALE_COOKIE, HIKUADA_LOCALE_HEADER, isAppLocale } from "@/lib/site-locale-constants";

function detectDefaultLocale(request: NextRequest): AppLocale {
  const country =
    request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
  if (countryIsVietnam(country)) return "vi";
  if (acceptLanguagePrefersVietnamese(request.headers.get("accept-language"))) return "vi";
  return "en";
}

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(HIKUADA_LOCALE_COOKIE)?.value;
  let locale: AppLocale;

  if (isAppLocale(existing)) {
    locale = existing;
  } else {
    locale = detectDefaultLocale(request);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HIKUADA_LOCALE_HEADER, locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!isAppLocale(existing)) {
    response.cookies.set(HIKUADA_LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      // Must be readable/writable from document.cookie so the header language switcher can override auto-detected locale.
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

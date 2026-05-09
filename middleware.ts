import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { acceptLanguagePrefersVietnamese, countryIsVietnam } from "@/lib/detect-locale";
import type { AppLocale } from "@/lib/site-locale-constants";
import {
  HIKUADA_LOCALE_COOKIE,
  HIKUADA_LOCALE_HEADER,
  HIKUADA_PUBLIC_PATH_HEADER,
  isAppLocale,
} from "@/lib/site-locale-constants";

function detectDefaultLocale(request: NextRequest): AppLocale {
  const country =
    request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
  if (countryIsVietnam(country)) return "vi";
  if (acceptLanguagePrefersVietnamese(request.headers.get("accept-language"))) return "vi";
  return "en";
}

function stripLocalePrefix(pathname: string): { locale: AppLocale; path: string } | null {
  if (pathname === "/vi" || pathname === "/vi/") {
    return { locale: "vi", path: "/" };
  }
  if (pathname === "/en" || pathname === "/en/") {
    return { locale: "en", path: "/" };
  }
  if (pathname.startsWith("/vi/")) {
    return { locale: "vi", path: pathname.slice(3) || "/" };
  }
  if (pathname.startsWith("/en/")) {
    return { locale: "en", path: pathname.slice(3) || "/" };
  }
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HIKUADA_PUBLIC_PATH_HEADER, pathname);

  const stripped = stripLocalePrefix(pathname);
  if (stripped) {
    requestHeaders.set(HIKUADA_LOCALE_HEADER, stripped.locale);
    const url = request.nextUrl.clone();
    url.pathname = stripped.path;
    const res = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    res.cookies.set(HIKUADA_LOCALE_COOKIE, stripped.locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false,
    });
    return res;
  }

  const existing = request.cookies.get(HIKUADA_LOCALE_COOKIE)?.value;
  let locale: AppLocale;

  if (isAppLocale(existing)) {
    locale = existing;
  } else {
    locale = detectDefaultLocale(request);
  }

  requestHeaders.set(HIKUADA_LOCALE_HEADER, locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!isAppLocale(existing)) {
    response.cookies.set(HIKUADA_LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

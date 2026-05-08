import { NextResponse } from "next/server";
import type { AppLocale } from "@/lib/site-locale-constants";
import { HIKUADA_LOCALE_COOKIE, isAppLocale } from "@/lib/site-locale-constants";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const locale = (body as { locale?: string })?.locale;
  if (!isAppLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale." }, { status: 400 });
  }

  const chosen: AppLocale = locale;
  const res = NextResponse.json({ success: true, locale: chosen });
  res.cookies.set(HIKUADA_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}

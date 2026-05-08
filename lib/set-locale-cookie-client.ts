import type { AppLocale } from "@/lib/site-locale-constants";
import { HIKUADA_LOCALE_COOKIE } from "@/lib/site-locale-constants";

/** Persists locale in the browser; must run on the client (same cookie name as middleware / API). */
export function setLocaleCookieOnClient(locale: AppLocale): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  const parts = [`${HIKUADA_LOCALE_COOKIE}=${locale}`, "path=/", `max-age=${maxAge}`, "SameSite=Lax"];
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }
  document.cookie = parts.join("; ");
}

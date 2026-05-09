import { headers } from "next/headers";
import { HIKUADA_PUBLIC_PATH_HEADER } from "@/lib/site-locale-constants";

export async function getPublicPathname(): Promise<string> {
  const h = await headers();
  const raw = h.get(HIKUADA_PUBLIC_PATH_HEADER);
  if (!raw) return "/";
  const path = raw.split("?")[0] || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

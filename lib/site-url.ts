/** Public site origin for canonical URLs, OG, sitemap, and JSON-LD. Set in production: `NEXT_PUBLIC_SITE_URL=https://hikuada.com` */
export function getSiteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

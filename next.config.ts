import type { NextConfig } from "next";

const supabaseHostname = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
})();

/**
 * Hostnames allowed to hit Next dev-only assets / HMR when the page is opened by URL
 * (e.g. http://192.168.x.x:3000). Wildcards like `192.168.*` do NOT match IPs — use exact
 * hostnames or DNS-style patterns (see Next docs). Extra hosts: NEXT_ALLOWED_DEV_ORIGINS in .env.local.
 */
const allowedDevOrigins = Array.from(
  new Set([
    "localhost",
    "127.0.0.1",
    "::1",
    // Common LAN dev IP from local network testing (add yours via NEXT_ALLOWED_DEV_ORIGINS if different).
    "192.168.0.109",
    ...(process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
      .map((host) => host.trim())
      .filter(Boolean) ?? []),
  ]),
);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  // Browsers often fetch /favicon.ico first; serve our PNG icon so the tab logo updates reliably.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.png" }];
  },
  async headers() {
    return [
      {
        source: "/icon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
      {
        source: "/apple-icon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;

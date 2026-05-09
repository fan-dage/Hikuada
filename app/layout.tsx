import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { FacebookPixel } from "@/components/FacebookPixel";
import { GoogleTag } from "@/components/GoogleTag";
import { SiteProviders } from "@/components/site-providers";
import { getServerLocale } from "@/lib/server-locale";
import { withSeoKeywordFootnote } from "@/lib/seo-metadata";
import { getSiteBaseUrl } from "@/lib/site-url";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadataBase = new URL(getSiteBaseUrl());

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const icons = {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  };

  if (locale === "vi") {
    return {
      title: "Hikuada | Nhà máy phào chỉ khung ảnh PS",
      description: withSeoKeywordFootnote(
        "Hikuada là nhà sản xuất phào chỉ PS chuyên nghiệp, phục vụ khách mua sỉ tại Việt Nam và Đông Nam Á.",
        "vi",
      ),
      icons,
      openGraph: { type: "website", siteName: "Hikuada" },
      twitter: { card: "summary_large_image" },
    };
  }
  return {
    title: "Hikuada | PS Moldings Factory",
    description: withSeoKeywordFootnote(
      "Hikuada is a professional PS moldings manufacturer serving wholesale buyers in Vietnam and Southeast Asia.",
      "en",
    ),
    icons,
    openGraph: { type: "website", siteName: "Hikuada" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const htmlLang = locale === "vi" ? "vi" : "en";

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <GoogleTag />
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <SiteProviders locale={locale}>{children}</SiteProviders>
      </body>
    </html>
  );
}

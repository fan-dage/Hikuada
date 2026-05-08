import Image from "next/image";
import Link from "next/link";
import { SiteHeaderNav } from "@/components/site-header-nav";
import { getServerLocale } from "@/lib/server-locale";
import { getSiteMessages } from "@/lib/site-messages";

export async function SiteHeader() {
  const locale = await getServerLocale();
  const nav = getSiteMessages(locale).nav;

  return (
    <header className="relative z-50 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <nav className="mx-auto flex min-h-[3.75rem] max-w-6xl items-center justify-between gap-2 px-4 py-2 md:h-28 md:gap-3 md:px-6 md:py-0">
        <Link href="/" className="inline-flex min-w-0 shrink items-center">
          <Image
            src="/hikuada.png"
            alt="Hikuada logo"
            width={380}
            height={112}
            className="h-14 w-auto md:h-24"
            priority
          />
        </Link>
        <SiteHeaderNav
          locale={locale}
          aboutHref="/about"
          aboutLabel={nav.aboutUs}
          businessTermsHref="/how-to-order"
          businessTermsLabel={nav.businessTerms}
          contactHref="/about#contact"
          contactLabel={nav.contactUs}
        />
      </nav>
    </header>
  );
}

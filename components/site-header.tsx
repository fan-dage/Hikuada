import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProductsDropdown } from "@/components/products-dropdown";
import { getServerLocale } from "@/lib/server-locale";
import { getSiteMessages } from "@/lib/site-messages";

export async function SiteHeader() {
  const locale = await getServerLocale();
  const nav = getSiteMessages(locale).nav;
  const businessTermsHref = locale === "vi" ? "/business-terms/vi" : "/business-terms";

  return (
    <header className="relative z-50 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <nav className="mx-auto flex h-28 max-w-6xl items-center justify-between gap-3 px-6">
        <Link href="/" className="inline-flex min-w-0 shrink items-center">
          <Image src="/hikuada.png" alt="Hikuada logo" width={380} height={112} className="h-24 w-auto" priority />
        </Link>
        <div className="flex max-w-[min(100%,28rem)] flex-wrap items-center justify-end gap-2 sm:max-w-none sm:gap-3">
          <ProductsDropdown />
          <Link
            href={businessTermsHref}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white sm:px-4"
          >
            {nav.businessTerms}
          </Link>
          <Link
            href="/#contact"
            className="rounded-md border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 sm:px-4"
          >
            {nav.contactUs}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </nav>
    </header>
  );
}

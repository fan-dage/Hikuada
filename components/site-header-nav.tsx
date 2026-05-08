"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProductsDropdown } from "@/components/products-dropdown";
import { useSiteCopy } from "@/components/site-copy-context";
import type { AppLocale } from "@/lib/site-locale-constants";

const mobileNavLinkClass =
  "block rounded-lg px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50 active:bg-slate-100";
const mobileNavSectionClass = "mt-1 border-t border-slate-100 pt-4 first:mt-0 first:border-t-0 first:pt-0";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeaderNav({
  locale,
  aboutHref,
  aboutLabel,
  businessTermsHref,
  businessTermsLabel,
  contactHref,
  contactLabel,
}: {
  locale: AppLocale;
  aboutHref: string;
  aboutLabel: string;
  businessTermsHref: string;
  businessTermsLabel: string;
  contactHref: string;
  contactLabel: string;
}) {
  const { nav } = useSiteCopy();
  const menu = nav.productsMenu;
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const close = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, close]);

  const mobileDrawer =
    drawerOpen &&
    typeof document !== "undefined" &&
    createPortal(
      <div className="fixed inset-0 z-[9999] md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"
          aria-label={nav.closeMobileMenu}
          onClick={close}
        />
        <aside
          id="site-mobile-nav"
          className="pointer-events-auto absolute right-0 top-0 flex h-full max-h-[100dvh] w-[min(100%,20rem)] flex-col border-l border-slate-200 bg-white shadow-[-8px_0_32px_-12px_rgba(15,23,42,0.25)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-mobile-nav-title"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
            <span id="site-mobile-nav-title" className="text-sm font-semibold text-slate-900">
              {nav.mobileMenuTitle}
            </span>
            <button
              type="button"
              onClick={close}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label={nav.closeMobileMenu}
            >
              ×
            </button>
          </div>
          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4"
            aria-label={nav.mobileMenuTitle}
          >
            <div className={mobileNavSectionClass}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {menu.trigger}
              </p>
              <Link href="/products?category=ps_moldings" className={mobileNavLinkClass} onClick={close}>
                {menu.pictureFrameMoldings}
              </Link>
              <Link
                href="/products?category=frame_machinery_consumables"
                className={mobileNavLinkClass}
                onClick={close}
              >
                {menu.frameMachineryConsumables}
              </Link>
              <Link
                href="/products?category=finished_products_others"
                className={mobileNavLinkClass}
                onClick={close}
              >
                {menu.finishedOtherProducts}
              </Link>
            </div>
            <div className={mobileNavSectionClass}>
              <Link href={aboutHref} className={mobileNavLinkClass} onClick={close}>
                {aboutLabel}
              </Link>
              <Link href={businessTermsHref} className={mobileNavLinkClass} onClick={close}>
                {businessTermsLabel}
              </Link>
              <Link href={contactHref} className={mobileNavLinkClass} onClick={close}>
                {contactLabel}
              </Link>
            </div>
          </nav>
        </aside>
      </div>,
      document.body,
    );

  return (
    <>
      <div className="hidden shrink-0 items-center gap-2 md:flex md:gap-3">
        <ProductsDropdown />
        <Link
          href={aboutHref}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white sm:px-4"
        >
          {aboutLabel}
        </Link>
        <Link
          href={businessTermsHref}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white sm:px-4"
        >
          {businessTermsLabel}
        </Link>
        <Link
          href={contactHref}
          className="rounded-md border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 sm:px-4"
        >
          {contactLabel}
        </Link>
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div className="flex shrink-0 items-center gap-2 md:hidden">
        <div className="shrink-0">
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <button
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="site-mobile-nav"
          aria-label={nav.openMenuAria}
          onClick={() => setDrawerOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {mobileDrawer}
    </>
  );
}

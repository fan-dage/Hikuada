import type { Metadata } from "next";
import Link from "next/link";
import { HowToOrderB2B } from "@/components/how-to-order-b2b";
import { HowToOrderTimeline } from "@/components/how-to-order-timeline";
import { InquiryForm } from "@/components/inquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerLocale } from "@/lib/server-locale";
import { getSiteMessages } from "@/lib/site-messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const p = getSiteMessages(locale).howToOrderPage;
  return { title: p.metaTitle, description: p.metaDescription };
}

export default async function HowToOrderPage() {
  const locale = await getServerLocale();
  const m = getSiteMessages(locale);
  const p = m.howToOrderPage;
  const fullTermsHref = locale === "vi" ? "/business-terms/vi" : "/business-terms";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            <Link href="/" className="transition hover:text-slate-800">
              Hikuada
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span>{m.nav.businessTerms}</span>
          </p>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.35rem] md:leading-tight">
            {p.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
            {p.heroSubtitle}
          </p>
        </div>
      </header>

      <HowToOrderTimeline
        title={p.timelineTitle}
        steps={p.steps}
        langLabels={{
          zh: p.stepLangLabelZh,
          en: p.stepLangLabelEn,
          vi: p.stepLangLabelVi,
        }}
        stepPanelClose={p.stepPanelClose}
      />

      <HowToOrderB2B
        title={p.b2bTitle}
        locale={locale}
        langLabels={{
          zh: p.stepLangLabelZh,
          en: p.stepLangLabelEn,
          vi: p.stepLangLabelVi,
        }}
        panelClose={p.stepPanelClose}
        fullTermsLink={p.fullTermsLink}
        fullTermsHref={fullTermsHref}
      />

      <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16" aria-labelledby="inquiry-heading">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 id="inquiry-heading" className="sr-only">
            {m.inquiryForm.title}
          </h2>
          <div id="inquiry-form" className="scroll-mt-[5.5rem] sm:scroll-mt-28">
            <div className="rounded-3xl bg-white p-2 shadow-[0_24px_48px_-14px_rgba(239,246,255,0.85),0_8px_24px_-10px_rgba(226,232,240,0.35)] sm:p-3">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter contactAnchorId={false} />
    </main>
  );
}

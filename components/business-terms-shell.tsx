import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export function BusinessTermsShell({
  documentHeading,
  kicker,
  lastUpdatedLabel,
  lastUpdatedIso,
  lastUpdatedDisplay,
  alternate,
  articleLang = "en",
  children,
}: {
  documentHeading: string;
  kicker?: string;
  lastUpdatedLabel: string;
  lastUpdatedIso: string;
  lastUpdatedDisplay: string;
  alternate: { href: string; label: string };
  articleLang?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          {kicker ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{kicker}</p>
          ) : null}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{documentHeading}</h1>
          <p className="mt-4 text-sm text-slate-600">
            {lastUpdatedLabel}{" "}
            <time dateTime={lastUpdatedIso} className="tabular-nums text-slate-800">
              {lastUpdatedDisplay}
            </time>
          </p>
        </div>
      </div>
      <article lang={articleLang} className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-10 md:shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <div className="space-y-9 text-[15px] leading-relaxed text-slate-700 md:text-base md:leading-8">{children}</div>
          <div className="mt-12 border-t border-slate-200 pt-8">
            <Link
              href={alternate.href}
              className="inline-flex text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-[5px] transition hover:decoration-slate-900"
            >
              {alternate.label}
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

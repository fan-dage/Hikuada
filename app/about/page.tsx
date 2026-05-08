import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerLocale } from "@/lib/server-locale";
import { getSiteMessages } from "@/lib/site-messages";

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*(.+)\*\*$/);
        if (m) return <strong key={i}>{m[1]}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const a = getSiteMessages(locale).about;
  return { title: a.metaTitle, description: a.metaDescription };
}

export default async function AboutPage() {
  const locale = await getServerLocale();
  const m = getSiteMessages(locale);
  const a = m.about;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{a.kicker}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{a.heroTitle}</h1>
          {a.heroSubtitle ? (
            <p className="mt-2 text-sm font-medium text-slate-500">{a.heroSubtitle}</p>
          ) : null}
          <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-700 sm:text-base sm:leading-8">
            <p>
              <BoldText text={a.introLead} />
            </p>
            <p>
              <BoldText text={a.introBody} />
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{a.strengthsTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: a.strength1Title, body: a.strength1Body },
              { title: a.strength2Title, body: a.strength2Body },
              { title: a.strength3Title, body: a.strength3Body },
            ].map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      <BoldText text={card.body} />
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-[5.5rem] border-b border-slate-200 bg-white py-10 sm:scroll-mt-28 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{a.contactTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{a.contactLead}</p>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{a.directLabel}</p>
          <div className="mt-3 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <a
              href="https://zalo.me/8618630000333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-sky-700 bg-sky-700 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-800"
            >
              <ZaloGlyph className="h-6 w-6 shrink-0 text-white" />
              {m.home.chatZalo}
            </a>
            <a
              href="https://wa.me/8619933036333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-500 bg-amber-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              <WhatsAppGlyph className="h-6 w-6 shrink-0 text-slate-950" />
              {m.home.chatWhatsapp}
            </a>
          </div>

          <div className="mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{a.factoryTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-800 sm:text-base">{a.factoryAddress}</p>
          </div>

          <div id="inquiry-form" className="mx-auto mt-12 max-w-2xl scroll-mt-[5.5rem] sm:scroll-mt-28">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-2 sm:bg-white">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter contactAnchorId={false} />
    </main>
  );
}

function ZaloGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.05 2 10.5c0 2.55 1.45 4.8 3.7 6.1-.1.55-.65 2.15-.65 2.15s-.05.15.05.2c.1.05.2 0 .25-.05 0 0 1.65-1.1 2.35-1.35.85.25 1.75.35 2.3.35 5.52 0 10-4.05 10-8.5S17.52 2 12 2zm-1.2 11.25H8.55c-.55 0-1-.45-1-1V8.5c0-.55.45-1 1-1h2.25c.55 0 1 .45 1 1v3.75c0 .55-.45 1-1 1zm5.4 0h-2.25c-.55 0-1-.45-1-1V8.5c0-.55.45-1 1-1h2.25c.55 0 1 .45 1 1v3.75c0 .55-.45 1-1 1z" />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

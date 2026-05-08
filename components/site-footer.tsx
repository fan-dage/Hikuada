import Link from "next/link";
import { getServerLocale } from "@/lib/server-locale";
import { getSiteMessages } from "@/lib/site-messages";

export async function SiteFooter() {
  const locale = await getServerLocale();
  const m = getSiteMessages(locale);

  return (
    <footer id="contact" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-base text-slate-700">{m.home.footerContact}</p>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <a
              href="https://zalo.me/8618630000333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-sky-700 bg-sky-700 px-8 py-4 text-base font-semibold text-white transition hover:bg-sky-800"
            >
              {m.home.chatZalo}
            </a>
            <a
              href="https://wa.me/8619933036333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-amber-500 bg-amber-500 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              {m.home.chatWhatsapp}
            </a>
          </div>
        </div>
        <nav
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-8"
          aria-label="Legal"
        >
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-[5px] transition hover:text-slate-900 hover:decoration-slate-600"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

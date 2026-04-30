import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <nav className="mx-auto flex h-28 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center">
          <Image src="/hikuada.png" alt="Hikuada logo" width={380} height={112} className="h-24 w-auto" priority />
        </Link>
        <div className="flex items-center gap-3">
          <div className="group relative">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Products
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-20 w-72 pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <Link
                  href="/products?category=ps_moldings"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Picture Frame Moldings
                </Link>
                <Link
                  href="/products?category=frame_machinery_consumables"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Frame Machinery & Consumables
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/#contact"
            className="rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  );
}

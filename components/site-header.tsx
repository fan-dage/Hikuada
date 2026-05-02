import Image from "next/image";
import Link from "next/link";
import { ProductsDropdown } from "@/components/products-dropdown";

export function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <nav className="mx-auto flex h-28 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center">
          <Image src="/hikuada.png" alt="Hikuada logo" width={380} height={112} className="h-24 w-auto" priority />
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <ProductsDropdown />
          <Link
            href="/business-terms"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            Business Terms
          </Link>
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

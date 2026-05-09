"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function productsCategoryChipClass(active: boolean) {
  const base =
    "flex w-full items-center justify-center rounded-xl border px-4 py-3 text-center text-sm font-medium leading-snug transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 lg:inline-flex lg:w-auto lg:shrink-0 lg:rounded-full lg:px-5 lg:py-2.5 lg:text-left lg:whitespace-nowrap";
  return active
    ? `${base} border-slate-900 bg-slate-900 text-white shadow-sm`
    : `${base} border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50`;
}

export function ProductsCategoryNav({
  validCategory,
  navAriaLabel,
  categorySelectAll,
  pictureFrameMoldings,
  frameMachineryConsumables,
  finishedOtherProducts,
}: {
  validCategory: string | null;
  navAriaLabel: string;
  categorySelectAll: string;
  pictureFrameMoldings: string;
  frameMachineryConsumables: string;
  finishedOtherProducts: string;
}) {
  const router = useRouter();
  const selectValue =
    validCategory === "ps_moldings" ||
    validCategory === "frame_machinery_consumables" ||
    validCategory === "finished_products_others"
      ? validCategory
      : "";

  return (
    <nav className="mb-8" aria-label={navAriaLabel}>
      <div className="lg:hidden">
        <label htmlFor="hikuada-product-category" className="sr-only">
          {navAriaLabel}
        </label>
        <select
          id="hikuada-product-category"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm font-medium text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
          value={selectValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") router.push("/products");
            else router.push(`/products?category=${v}`);
          }}
        >
          <option value="">{categorySelectAll}</option>
          <option value="ps_moldings">{pictureFrameMoldings}</option>
          <option value="frame_machinery_consumables">{frameMachineryConsumables}</option>
          <option value="finished_products_others">{finishedOtherProducts}</option>
        </select>
      </div>

      <div className="hidden flex-col gap-2 lg:flex lg:flex-row lg:flex-wrap lg:gap-3">
        <Link
          href="/products?category=ps_moldings"
          aria-current={validCategory === "ps_moldings" ? "page" : undefined}
          className={productsCategoryChipClass(validCategory === "ps_moldings")}
        >
          {pictureFrameMoldings}
        </Link>
        <Link
          href="/products?category=frame_machinery_consumables"
          aria-current={validCategory === "frame_machinery_consumables" ? "page" : undefined}
          className={productsCategoryChipClass(validCategory === "frame_machinery_consumables")}
        >
          {frameMachineryConsumables}
        </Link>
        <Link
          href="/products?category=finished_products_others"
          aria-current={validCategory === "finished_products_others" ? "page" : undefined}
          className={productsCategoryChipClass(validCategory === "finished_products_others")}
        >
          {finishedOtherProducts}
        </Link>
      </div>
    </nav>
  );
}

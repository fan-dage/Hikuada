"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteCopy } from "@/components/site-copy-context";

export function ProductsDropdown() {
  const { nav } = useSiteCopy();
  const menu = nav.productsMenu;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const node = rootRef.current;
      if (!node || node.contains(event.target as Node)) return;
      close();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="group relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
      >
        {menu.trigger}
      </button>
      <div
        className={[
          "absolute right-0 top-full z-[100] w-72 pt-2 transition duration-150",
          open ? "max-md:pointer-events-auto max-md:visible max-md:opacity-100" : "max-md:pointer-events-none max-md:invisible max-md:opacity-0",
          "md:pointer-events-none md:invisible md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:visible md:group-hover:opacity-100",
          "md:group-focus-within:pointer-events-auto md:group-focus-within:visible md:group-focus-within:opacity-100",
        ].join(" ")}
        role="menu"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <Link
            href="/products?category=ps_moldings"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            onClick={close}
          >
            {menu.pictureFrameMoldings}
          </Link>
          <Link
            href="/products?category=frame_machinery_consumables"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            onClick={close}
          >
            {menu.frameMachineryConsumables}
          </Link>
          <Link
            href="/products?category=finished_products_others"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            onClick={close}
          >
            {menu.finishedOtherProducts}
          </Link>
        </div>
      </div>
    </div>
  );
}

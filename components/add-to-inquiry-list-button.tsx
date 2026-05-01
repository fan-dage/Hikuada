"use client";

import { useState } from "react";
import { useInquiryList } from "@/components/inquiry-list-context";
import type { ProductSnapshotInput } from "@/lib/inquiry-list";

export function AddToInquiryListButton({ product }: { product: ProductSnapshotInput }) {
  const { addItem } = useInquiryList();
  const [flash, setFlash] = useState(false);

  function handleClick() {
    addItem(product);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-3 w-full rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800"
    >
      {flash ? "Added to inquiry list" : "Add to inquiry list"}
    </button>
  );
}

"use client";

import { useEffect } from "react";
import {
  buildInquiryListPrefillMessage,
  INQUIRY_PREFILL_EVENT,
  INQUIRY_PREFILL_SESSION_KEY,
} from "@/lib/inquiry-list";
import { useInquiryList } from "@/components/inquiry-list-context";
import { useSiteCopy } from "@/components/site-copy-context";

export function InquiryListDrawer() {
  const d = useSiteCopy().inquiryDrawer;
  const { items, drawerOpen, closeDrawer, removeItem, setQuantity, clear } = useInquiryList();

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  function proceedToInquiryForm() {
    const msg = buildInquiryListPrefillMessage(items);
    if (!msg.trim()) return;
    try {
      sessionStorage.setItem(INQUIRY_PREFILL_SESSION_KEY, msg);
    } catch {
      /* ignore */
    }
    closeDrawer();
    window.dispatchEvent(new Event(INQUIRY_PREFILL_EVENT));
    const pathname = window.location.pathname;
    const onHome = pathname === "/" || pathname === "";
    const onAbout = pathname === "/about";
    const onHowToOrder = pathname === "/how-to-order";
    if (onHome || onAbout || onHowToOrder) {
      document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.assign("/about#inquiry-form");
  }

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <button
        type="button"
        aria-label={d.closeList}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        onClick={closeDrawer}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-[-12px_0_40px_-20px_rgba(15,23,42,0.35)]"
        aria-modal="true"
        role="dialog"
        aria-labelledby="inquiry-list-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="inquiry-list-title" className="text-lg font-semibold text-slate-900">
              {d.title}
            </h2>
            <p className="text-xs text-slate-500">{d.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label={d.closeDialog}
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              {d.empty}
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- cart thumbnails; arbitrary URLs
                      <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] text-slate-400">
                        {d.noImage}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{item.model}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                      {d.size} {item.size ?? "-"}
                      <br />
                      {d.packing} {item.packing_spec ?? "-"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500">{d.qty}</span>
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                          aria-label={d.decreaseQty}
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] px-1 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
                          aria-label={d.increaseQty}
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        {d.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (items.length === 0) return;
                if (confirm(d.clearConfirm)) clear();
              }}
              disabled={items.length === 0}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {d.clearAll}
            </button>
            <button
              type="button"
              onClick={proceedToInquiryForm}
              disabled={items.length === 0}
              className="flex-[1.4] rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {d.proceed}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

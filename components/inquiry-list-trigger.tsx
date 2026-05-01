"use client";

import { useInquiryList } from "@/components/inquiry-list-context";
import { usePathname } from "next/navigation";

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2ZM1 2v2h2l3.6 7.59-.65 1.18c-.11.2-.18.43-.18.68 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.07L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.49A1 1 0 0 0 20.49 4H5.21L4.27 2H1Zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Floating inquiry list entry — fixed bottom-right, cart affordance, safe-area aware. */
export function InquiryListTrigger() {
  const pathname = usePathname();
  const { itemCount, openDrawer, drawerOpen } = useInquiryList();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const badge = itemCount > 99 ? "99+" : String(itemCount);

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open inquiry list${itemCount ? `, ${itemCount} items` : ""}`}
      aria-expanded={drawerOpen}
      aria-hidden={drawerOpen}
      tabIndex={drawerOpen ? -1 : undefined}
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1.25rem, env(safe-area-inset-right, 0px))",
      }}
      className={`fixed z-[140] flex touch-manipulation items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.55)] ring-1 ring-white/15 transition hover:bg-slate-800 hover:shadow-[0_14px_44px_-12px_rgba(15,23,42,0.6)] active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
        drawerOpen ? "pointer-events-none opacity-0" : "opacity-100"
      } h-14 w-14 md:h-[3.75rem] md:w-[3.75rem]`}
    >
      <CartIcon className="h-7 w-7 md:h-8 md:w-8" />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold leading-none text-slate-950 ring-2 ring-slate-900">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

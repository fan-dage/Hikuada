"use client";

import { useCallback, useState } from "react";
import type { AppLocale } from "@/lib/site-locale-constants";
import { useSiteCopy } from "@/components/site-copy-context";
import { setLocaleCookieOnClient } from "@/lib/set-locale-cookie-client";

export function LanguageSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const copy = useSiteCopy();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyLocale = useCallback(
    (next: AppLocale) => {
      if (next === currentLocale) return;
      setError(null);
      setPending(true);
      try {
        setLocaleCookieOnClient(next);
        window.location.reload();
      } catch (e) {
        setPending(false);
        setError(e instanceof Error ? e.message : "Could not update language.");
      }
    },
    [currentLocale],
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        role="group"
        aria-label={copy.language.switcherAria}
        className="inline-flex overflow-hidden rounded-md border border-slate-300 bg-white text-xs font-semibold shadow-sm"
      >
        <button
          type="button"
          disabled={pending}
          onClick={() => applyLocale("en")}
          className={`px-2.5 py-1.5 transition sm:px-3 ${
            currentLocale === "en"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => applyLocale("vi")}
          className={`border-l border-slate-300 px-2.5 py-1.5 transition sm:px-3 ${
            currentLocale === "vi"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          }`}
        >
          VI
        </button>
      </div>
      {error ? <p className="max-w-[10rem] text-right text-[10px] text-red-600">{error}</p> : null}
    </div>
  );
}

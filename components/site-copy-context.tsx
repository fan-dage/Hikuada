"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { SiteMessages } from "@/lib/site-messages";
import { getSiteMessages } from "@/lib/site-messages";
import type { AppLocale } from "@/lib/site-locale-constants";

const SiteCopyContext = createContext<SiteMessages | null>(null);

export function SiteCopyProvider({
  locale,
  children,
}: {
  locale: AppLocale;
  children: ReactNode;
}) {
  const value = getSiteMessages(locale);
  return <SiteCopyContext.Provider value={value}>{children}</SiteCopyContext.Provider>;
}

export function useSiteCopy(): SiteMessages {
  const ctx = useContext(SiteCopyContext);
  if (!ctx) {
    throw new Error("useSiteCopy must be used within SiteCopyProvider");
  }
  return ctx;
}

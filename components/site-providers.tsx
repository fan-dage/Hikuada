"use client";

import type { ReactNode } from "react";
import { InquiryListProvider } from "@/components/inquiry-list-context";
import { InquiryListDrawer } from "@/components/inquiry-list-drawer";
import { InquiryListTrigger } from "@/components/inquiry-list-trigger";
import { SiteCopyProvider } from "@/components/site-copy-context";
import type { AppLocale } from "@/lib/site-locale-constants";

export function SiteProviders({ locale, children }: { locale: AppLocale; children: ReactNode }) {
  return (
    <SiteCopyProvider locale={locale}>
      <InquiryListProvider>
        {children}
        <InquiryListTrigger />
        <InquiryListDrawer />
      </InquiryListProvider>
    </SiteCopyProvider>
  );
}

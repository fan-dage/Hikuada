"use client";

import type { ReactNode } from "react";
import { InquiryListProvider } from "@/components/inquiry-list-context";
import { InquiryListDrawer } from "@/components/inquiry-list-drawer";
import { InquiryListTrigger } from "@/components/inquiry-list-trigger";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <InquiryListProvider>
      {children}
      <InquiryListTrigger />
      <InquiryListDrawer />
    </InquiryListProvider>
  );
}

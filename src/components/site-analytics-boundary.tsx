"use client";

import { Suspense } from "react";

import { SiteAnalytics } from "@/components/site-analytics";

export function SiteAnalyticsBoundary() {
  return (
    <Suspense fallback={null}>
      <SiteAnalytics />
    </Suspense>
  );
}

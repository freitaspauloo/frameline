import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SUPPORT_HERO_CDN, SUPPORT_HERO_DEV_BASE } from "@/screens/support-hero/constants";
import { SupportHeroPreviewNav } from "@/screens/support-hero/preview-nav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Support Hero — Dev Preview",
  description:
    "Frameline dev preview (not in catalog): Support hero with Reticle Pink, Lime Green, and Cyan Blue themes.",
  robots: { index: false, follow: false, nocache: true },
  alternates: {
    canonical: SUPPORT_HERO_DEV_BASE,
  },
  openGraph: {
    title: "Support Hero — Dev Preview",
    description: "Theme variants for the Support product hero — dev only, not storefront.",
    url: SUPPORT_HERO_DEV_BASE,
    siteName: "Frameline",
  },
};

export default function DevSupportHeroLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <link rel="preconnect" href={SUPPORT_HERO_CDN} crossOrigin="anonymous" />
      <style>{`[data-frameline-quota], nextjs-portal { display: none !important; }`}</style>
      <div className="pb-24">{children}</div>
      <SupportHeroPreviewNav />
    </>
  );
}

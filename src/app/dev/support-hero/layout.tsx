import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SupportHeroPreviewNav } from "@/screens/support-hero/preview-nav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Support Hero — Dev Preview",
  description: "Frameline dev preview: Support hero theme variants and skeleton states.",
  robots: { index: false, follow: false },
};

export default function DevSupportHeroLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <SupportHeroPreviewNav />
    </>
  );
}

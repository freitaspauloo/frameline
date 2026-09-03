import type { ReactNode } from "react";

import { SupportHeroPreviewNav } from "@/screens/support-hero/preview-nav";

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

import type { ReactNode } from "react";

import { PicdropPreviewNav } from "@/screens/picdrop-dashboard/preview-nav";

export default function DevPicdropDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <PicdropPreviewNav />
    </>
  );
}

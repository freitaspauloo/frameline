import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PicdropPreviewNav } from "@/screens/picdrop-dashboard/preview-nav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Picdrop Dashboard — Dev Preview",
  description: "Frameline dev preview: Picdrop dashboard skeleton and theme variants.",
  robots: { index: false, follow: false },
};

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

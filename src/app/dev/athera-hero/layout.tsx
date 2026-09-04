import type { Metadata } from "next"
import type { ReactNode } from "react"

import { AtheraHeroPreviewNav } from "@/screens/athera-hero/preview-nav"

export const metadata: Metadata = {
  title: "Athera Hero — Dev Preview",
  description: "Frameline dev preview: financial hero with pink, cyan, and lime themes.",
  robots: { index: false, follow: false },
}

export default function DevAtheraHeroLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      {children}
      <AtheraHeroPreviewNav />
    </>
  )
}

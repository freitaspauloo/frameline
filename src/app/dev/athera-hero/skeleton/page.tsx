"use client"

import AtheraHeroSkeleton from "@/screens/athera-hero/athera-hero-skeleton"
import { AtheraHeroDevShell } from "@/screens/athera-hero/dev-shell"

export default function DevAtheraHeroSkeletonPage() {
  return (
    <AtheraHeroDevShell>
      <AtheraHeroSkeleton key="pink-skeleton" theme="pink" />
    </AtheraHeroDevShell>
  )
}

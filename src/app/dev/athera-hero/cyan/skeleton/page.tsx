"use client"

import AtheraHeroSkeleton from "@/screens/athera-hero/athera-hero-skeleton"
import { AtheraHeroDevShell } from "@/screens/athera-hero/dev-shell"

export default function DevAtheraHeroCyanSkeletonPage() {
  return (
    <AtheraHeroDevShell>
      <AtheraHeroSkeleton key="cyan-skeleton" theme="cyan" />
    </AtheraHeroDevShell>
  )
}

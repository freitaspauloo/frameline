"use client"

import AtheraHeroSkeleton from "@/screens/athera-hero/athera-hero-skeleton"
import { AtheraHeroDevShell } from "@/screens/athera-hero/dev-shell"

export default function DevAtheraHeroLimeSkeletonPage() {
  return (
    <AtheraHeroDevShell>
      <AtheraHeroSkeleton key="lime-skeleton" theme="lime" />
    </AtheraHeroDevShell>
  )
}

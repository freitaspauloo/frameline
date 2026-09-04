"use client"

import AtheraHero from "@/screens/athera-hero/athera-hero"
import { AtheraHeroDevShell } from "@/screens/athera-hero/dev-shell"

export default function DevAtheraHeroLimePage() {
  return (
    <AtheraHeroDevShell>
      <AtheraHero key="lime" theme="lime" />
    </AtheraHeroDevShell>
  )
}

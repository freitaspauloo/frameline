"use client"

import AtheraHero from "@/screens/athera-hero/athera-hero"
import { AtheraHeroDevShell } from "@/screens/athera-hero/dev-shell"

export default function DevAtheraHeroCyanPage() {
  return (
    <AtheraHeroDevShell>
      <AtheraHero key="cyan" theme="cyan" />
    </AtheraHeroDevShell>
  )
}

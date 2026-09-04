"use client"

import AtheraHero from "@/screens/athera-hero/athera-hero"
import { AtheraHeroDevShell } from "@/screens/athera-hero/dev-shell"

export default function DevAtheraHeroPage() {
  return (
    <AtheraHeroDevShell>
      <AtheraHero key="pink" theme="pink" />
    </AtheraHeroDevShell>
  )
}

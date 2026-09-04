"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { ATHERA_PREVIEW_TABS } from "./themes"

export function AtheraHeroPreviewNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-xl border border-black/10 bg-white/95 px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      aria-label="Athera Hero preview variants"
    >
      {ATHERA_PREVIEW_TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-[11px] font-medium tracking-[-0.01em] transition-colors sm:px-3 sm:text-[12px]",
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
            )}
            style={active ? { boxShadow: `inset 0 0 0 1px ${tab.swatch}55` } : undefined}
          >
            <span
              className="mr-1.5 inline-block size-2 rounded-full align-middle"
              style={{ backgroundColor: tab.swatch }}
              aria-hidden
            />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

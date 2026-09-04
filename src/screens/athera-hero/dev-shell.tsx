"use client"

import type { ReactNode } from "react"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

type AtheraHeroDevShellProps = {
  children: ReactNode
  className?: string
}

export function AtheraHeroDevShell({ children, className }: AtheraHeroDevShellProps) {
  return (
    <div
      className={cn(
        GeistSans.className,
        "min-h-dvh overflow-x-auto bg-[#e8e8e8] p-4 antialiased",
        className,
      )}
    >
      <div className="mx-auto w-fit">{children}</div>
    </div>
  )
}

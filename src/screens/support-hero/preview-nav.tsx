"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { SUPPORT_HERO_PREVIEW_TABS } from "./themes";

export function SupportHeroPreviewNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-2xl border border-black/10 bg-white/95 p-1 shadow-lg backdrop-blur-md pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      aria-label="Support hero dev preview"
    >
      {SUPPORT_HERO_PREVIEW_TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition",
              active
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              "devOnly" in tab && tab.devOnly && "opacity-80",
            )}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: tab.swatch }}
              aria-hidden
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

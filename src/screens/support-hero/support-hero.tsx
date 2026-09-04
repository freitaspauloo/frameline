"use client"

import { GeistSans } from "geist/font/sans"
import Image from "next/image"
import { useLayoutEffect, useRef, useMemo, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

import { DASHBOARD_UI, HERO_BG, NAV_LINKS } from "./constants"
import { FramelineBrand } from "./frameline-brand"
import { ArrowUpRight, GitHubMark } from "./icons"
import {
  mountSupportHeroMotion,
  SUPPORT_HERO_MOTION,
} from "./support-hero-motion"
import {
  SUPPORT_HERO_THEME_PINK,
  supportHeroThemeStyle,
  type SupportHeroTheme,
} from "./themes"
import { useSupportHeroScroll } from "./use-support-hero-scroll"
import "./support-hero.css"

type SupportHeroProps = {
  className?: string
  theme?: SupportHeroTheme
}

export default function SupportHero({
  className,
  theme = SUPPORT_HERO_THEME_PINK,
}: SupportHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const navCompact = useSupportHeroScroll(sectionRef)

  const ctaStyle: CSSProperties = useMemo(
    () => ({
      borderColor: theme.accent,
      backgroundColor: theme.brand,
    }),
    [theme.accent, theme.brand],
  )

  const ghostStyle: CSSProperties = useMemo(
    () => ({
      borderColor: `${theme.accent}55`,
      backgroundColor: `rgba(${theme.accentRgb}, 0.12)`,
    }),
    [theme.accent, theme.accentRgb],
  )

  useLayoutEffect(() => {
    const root = sectionRef.current
    if (!root) return
    return mountSupportHeroMotion(root, SUPPORT_HERO_MOTION)
  }, [])

  return (
    <section
      ref={sectionRef}
      data-sh-theme={theme.id}
      style={supportHeroThemeStyle(theme)}
      className={cn(
        GeistSans.className,
        "fl-support-hero sh-motion-pending relative flex min-h-dvh w-full flex-col bg-black text-white antialiased",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          data-sh-bg
          src={HERO_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          data-sh-overlay
          className="absolute inset-0"
          style={{ background: theme.tint, mixBlendMode: "color" }}
        />
        <div data-sh-overlay className="absolute inset-0 backdrop-blur-[5px]" />
        <div
          data-sh-overlay
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        />
      </div>

      <header className="sticky top-0 z-40 flex w-full justify-center bg-transparent px-4 pt-4 sm:px-6 sm:pt-5">
        <nav
          data-sh-nav
          className="support-nav flex w-full items-center justify-between border border-white/10 bg-[#151515] py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[40px] [border-radius:15px]"
          aria-label="Primary"
          data-compact={navCompact ? "true" : "false"}
        >
          <div className="flex shrink-0 items-center gap-3">
            <div data-sh-nav-item>
              <FramelineBrand compact size="nav" className="px-1 py-1" />
            </div>
            <a
              data-sh-nav-item
              href="#top"
              className="px-1 text-[15px] font-semibold tracking-[-0.02em] text-white"
            >
              Support
            </a>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                data-sh-nav-item
                href={`#${label.toLowerCase()}`}
                className="support-link text-[13px] font-medium text-white/55 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            data-sh-nav-item
            href="#start"
            className="support-btn inline-flex min-w-[84px] max-w-[480px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white"
            style={ctaStyle}
          >
            Get started
            <ArrowUpRight className="size-3.5 opacity-90" />
          </a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div
          data-sh-enter
          className="inline-flex items-center justify-center gap-2.5 rounded-[10px] border border-white/20 bg-white/15 px-2.5 py-1.5 text-[12.5px] font-medium text-white/80 backdrop-blur-[15px]"
        >
          <GitHubMark className="size-3.5 shrink-0 text-white" />
          <span>
            Proudly <span className="font-semibold text-white">Open-source</span> on GitHub.
          </span>
        </div>

        <h1
          data-sh-enter
          className="mt-5 w-full max-w-[730px] text-[clamp(2.4rem,5.5vw,4.25rem)] font-medium capitalize leading-[1.03] tracking-[-0.06em] text-white [font-feature-settings:'dlig'_on] sm:text-[68px] sm:leading-[70px] sm:tracking-[-4.08px]"
        >
          The Intelligence Layer For Your Hardware
        </h1>

        <p
          data-sh-enter
          className="mt-5 max-w-xl text-[18px] font-normal leading-6 tracking-[-1.08px] text-white/70 [font-feature-settings:'dlig'_on]"
        >
          A system of record for GPUs, NPUs, and AI-capable devices. Understand real aging, not
          assumptions.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            data-sh-enter
            href="#install"
            className="support-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] px-5 py-2.5 text-[14px] font-semibold text-white"
            style={ctaStyle}
          >
            Install the Agent
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            data-sh-enter
            href="#github"
            className="support-btn support-btn--ghost inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border px-5 py-2.5 text-[14px] font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-[15px]"
            style={ghostStyle}
          >
            View on Github
            <ArrowUpRight className="size-3.5 opacity-80" />
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 w-full max-w-[1236px] flex-1 px-4 pb-8 sm:mt-14 sm:px-6 lg:mt-16 lg:px-8">
        <div
          data-sh-dashboard
          className="relative mx-auto aspect-[371/190] h-auto w-full max-w-[1236px] shrink-0 overflow-hidden rounded-[15px] border border-white/10 bg-black/40 shadow-[0_-8px_60px_rgba(0,0,0,0.45)] sm:h-[633px] sm:max-h-[633px]"
        >
          <Image
            src={DASHBOARD_UI}
            alt="Support product dashboard"
            fill
            sizes="(max-width: 1236px) 100vw, 1236px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  )
}

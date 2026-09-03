"use client"

import { GeistSans } from "geist/font/sans"
import { useLayoutEffect, useRef, type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { gsap } from "@/lib/gsap-client"
import { cn } from "@/lib/utils"

import { NAV_LINKS } from "./constants"
import {
  mountSkeletonShimmer,
  mountSupportHeroMotion,
  SUPPORT_HERO_SKEL_MOTION,
} from "./support-hero-motion"
import {
  SUPPORT_HERO_THEME_PINK,
  supportHeroThemeStyle,
  type SupportHeroTheme,
} from "./themes"
import "./support-hero-skeleton.css"

function Bone({
  className,
  delay = 0,
  solid = false,
  accent = false,
  ...rest
}: {
  className?: string
  delay?: number
  solid?: boolean
  accent?: boolean
} & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "sh-skel-bone",
        solid && "sh-skel-bone--solid",
        accent && "sh-skel-bone--accent",
        className,
      )}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
      {...rest}
    />
  )
}

type SupportHeroSkeletonProps = {
  className?: string
  theme?: SupportHeroTheme
}

export function SupportHeroSkeleton({
  className,
  theme = SUPPORT_HERO_THEME_PINK,
}: SupportHeroSkeletonProps) {
  const scope = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return

    const cleanupEntrance = mountSupportHeroMotion(root, SUPPORT_HERO_SKEL_MOTION, {
      navBoneClip: true,
      contentBoneClip: true,
    })

    let cleanupShimmer: (() => void) | undefined
    const shimmerDelay = gsap.delayedCall(1.35, () => {
      cleanupShimmer = mountSkeletonShimmer(root)
    })

    return () => {
      cleanupEntrance?.()
      shimmerDelay.kill()
      cleanupShimmer?.()
    }
  }, [])

  return (
    <section
      ref={scope}
      data-sh-theme={theme.id}
      style={supportHeroThemeStyle(theme)}
      className={cn(
        GeistSans.className,
        "fl-support-skeleton sh-motion-pending relative flex min-h-dvh w-full flex-col bg-black text-white antialiased",
        className,
      )}
      aria-busy="true"
      aria-label={`Loading Support hero (${theme.label})`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div data-sh-skel-bg-art className="sh-skel-bg-art" />
        <div data-sh-skel-overlay className="sh-skel-bg-tint" />
        <div data-sh-skel-overlay className="absolute inset-0 backdrop-blur-[5px]" />
        <div
          data-sh-skel-overlay
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        />
      </div>

      <header className="relative z-40 flex w-full justify-center px-4 pt-4 sm:px-6 sm:pt-5">
        <div
          data-sh-skel-nav
          className="flex w-full max-w-[1340px] items-center justify-between rounded-[15px] border border-white/10 bg-[#151515]/90 py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[40px]"
        >
          <Bone data-sh-skel-nav-bone className="h-4 w-16 rounded-md" delay={0} />
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            {NAV_LINKS.map((label, index) => (
              <Bone
                key={label}
                data-sh-skel-nav-bone
                className="h-3 w-12 rounded-full"
                delay={80 + index * 40}
              />
            ))}
          </div>
          <Bone
            data-sh-skel-nav-bone
            className="h-9 w-[108px] rounded-[10px]"
            delay={120}
            solid
            accent
          />
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <Bone data-sh-skel-content-bone className="h-7 w-[240px] rounded-[10px]" delay={160} />
        <Bone
          data-sh-skel-content-bone
          className="mt-5 h-[clamp(2.4rem,5.5vw,4.25rem)] w-full max-w-[730px] rounded-xl sm:h-[70px]"
          delay={220}
          solid
        />
        <Bone data-sh-skel-content-bone className="mt-5 h-6 w-full max-w-xl rounded-md" delay={280} />
        <Bone
          data-sh-skel-content-bone
          className="mt-2 h-6 w-[min(100%,22rem)] rounded-md"
          delay={320}
        />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Bone
            data-sh-skel-content-bone
            className="h-10 w-[156px] rounded-[10px]"
            delay={360}
            solid
            accent
          />
          <Bone data-sh-skel-content-bone className="h-10 w-[148px] rounded-[10px]" delay={400} />
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 w-full max-w-[1236px] flex-1 px-4 pb-8 sm:mt-14 sm:px-6 lg:mt-16 lg:px-8">
        <Bone
          data-sh-skel-dashboard
          className="mx-auto aspect-[371/190] w-full max-w-[1236px] rounded-[15px] sm:h-[633px] sm:max-h-[633px]"
          delay={480}
          solid
        />
      </div>
    </section>
  )
}

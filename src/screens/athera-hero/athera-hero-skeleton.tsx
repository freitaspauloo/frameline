"use client"

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react"

import { gsap } from "@/lib/gsap-client"

import AtheraHeroPreloader from "./athera-hero-preloader"
import {
  mountSkeletonMotion,
  mountSkeletonShimmer,
  safetyReveal,
} from "./athera-hero-motion"
import { ATHERA_THEME_PINK, type AtheraThemeId } from "./themes"
import "./athera-hero.css"

function Bone({
  className = "",
  accent = false,
  solid = false,
  delay = 0,
  boneRole,
  ...rest
}: {
  className?: string
  accent?: boolean
  solid?: boolean
  delay?: number
  boneRole?: "nav" | "content"
} & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-skel-bone
      {...(boneRole === "nav" ? { "data-skel-nav-bone": true } : {})}
      {...(boneRole === "content" ? { "data-skel-content-bone": true } : {})}
      className={[
        "athera-skel-bone",
        solid && "athera-skel-bone--solid",
        accent && "athera-skel-bone--accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      <div className="athera-skel-shimmer" aria-hidden />
    </div>
  )
}

type AtheraHeroSkeletonProps = {
  theme?: AtheraThemeId
}

export default function AtheraHeroSkeleton({
  theme = ATHERA_THEME_PINK.id,
}: AtheraHeroSkeletonProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    let cleanupShimmer: (() => void) | undefined

    const safety = window.setTimeout(
      () =>
        safetyReveal(root, "skeleton", () => {
          cleanupShimmer = mountSkeletonShimmer(root)
        }),
      4000,
    )

    const ctx = gsap.context(() => {
      mountSkeletonMotion(root, () => {
        window.clearTimeout(safety)
        cleanupShimmer = mountSkeletonShimmer(root)
      })
    }, root)

    return () => {
      window.clearTimeout(safety)
      cleanupShimmer?.()
      ctx.revert()
    }
  }, [theme])

  return (
    <div
      ref={rootRef}
      data-theme={theme}
      className="athera-skeleton athera-hero athera-motion-pending relative isolate h-[1052px] w-[1440px] shrink-0 overflow-hidden rounded-[20px] border-[5px] border-white bg-[#f4f4f4] antialiased"
      aria-busy="true"
      aria-label="Loading hero preview"
    >
      <AtheraHeroPreloader />

      <header className="relative z-10 px-10 pt-5">
        <div className="athera-border-accent flex w-[672px] items-center justify-between rounded-[20px] border bg-white/90 px-[15px] py-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <Bone boneRole="nav" className="h-5 w-24 rounded-lg" />
          <div className="flex gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} boneRole="nav" className="h-3 w-14 rounded-full" />
            ))}
          </div>
          <Bone boneRole="nav" className="h-11 w-[108px] rounded-[15px]" accent />
        </div>
      </header>

      <div className="relative z-10 h-[932px] w-full">
        <section className="relative flex h-full w-[744px] shrink-0 flex-col gap-8 overflow-hidden px-10 pb-16 pt-[54px]">
          <Bone boneRole="content" className="h-9 w-[220px] rounded-xl" accent />
          <Bone boneRole="content" className="h-[68px] w-full max-w-[664px] rounded-xl" solid />
          <Bone boneRole="content" className="h-5 w-full max-w-[612px] rounded-md" />
          <Bone boneRole="content" className="h-5 w-full max-w-[480px] rounded-md" />
          <div className="flex gap-5">
            <Bone boneRole="content" className="h-[54px] w-[180px] rounded-[15px]" accent solid />
            <Bone boneRole="content" className="h-[54px] w-[140px] rounded-[15px]" />
          </div>
          <div className="mt-auto flex flex-col gap-[15px]">
            <Bone boneRole="content" className="h-5 w-[180px] rounded-md" />
            <Bone boneRole="content" className="h-10 w-full max-w-[578px] rounded-lg" solid />
          </div>
        </section>

        <div
          data-skel-dashboard
          className="absolute right-0 top-[-95px] z-20 h-[1027px] w-[696px]"
        >
          <div className="athera-ring-accent absolute left-[17px] top-[23px] h-[984px] w-[659px] overflow-hidden rounded-[20px] ring-1">
            <Bone className="absolute inset-0 rounded-[20px]" accent solid />
            <div data-skel-blend className="athera-accent-blend-stack absolute inset-0" aria-hidden>
              <div className="athera-accent-wash" />
              <div className="athera-accent-blend" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

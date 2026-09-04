"use client"

// @preview-module picdrop-dashboard-skeleton

import { type ComponentPropsWithoutRef, type CSSProperties } from "react"
import { GeistSans } from "geist/font/sans"

import { LogoMark } from "@/components/relay-ui"
import { cn } from "@/lib/utils"
import type { PicdropTheme } from "./themes"
import { usePicdropSkeletonMotion } from "./use-picdrop-motion"
import "./picdrop-dashboard-skeleton.css"

const SIDEBAR_WIDTH = 260

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
        "pd-skel-bone",
        solid && "pd-skel-bone--solid",
        accent && "pd-skel-bone--accent",
        className,
      )}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
      {...rest}
    />
  )
}

export default function PicdropDashboardSkeleton({
  className,
  theme = "pink",
}: {
  className?: string
  theme?: PicdropTheme
}) {
  const rootRef = usePicdropSkeletonMotion(theme)

  return (
    <div
      ref={rootRef}
      className={cn(
        GeistSans.className,
        "picdrop-skeleton",
        `picdrop-theme-${theme}`,
        "relative min-h-dvh w-full overflow-x-hidden bg-[#f7f7f7] text-zinc-900",
        className,
      )}
      aria-busy="true"
      aria-label="Loading Frameline dashboard"
    >
      <aside
        data-pd-skel-sidebar
        data-pd-skel-animate
        className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-[#ebebeb] bg-white"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="shrink-0 px-4 pb-3 pt-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <LogoMark className="size-[18px]" />
              <span className="text-[15px] font-semibold tracking-[-0.03em] text-zinc-900">frameline.ai</span>
            </div>
            <Bone data-pd-skel-bone className="size-6 rounded-md" delay={40} />
          </div>
          <Bone data-pd-skel-bone className="mt-4 h-9 w-full rounded-full" delay={80} />
        </div>

        <div className="min-h-0 flex-1 space-y-1 px-3 pb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Bone
              key={index}
              data-pd-skel-bone
              className="h-9 w-full rounded-xl"
              delay={120 + index * 50}
              accent={index === 0}
            />
          ))}
          <div className="ml-7 mt-1 space-y-1 pl-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Bone
                key={index}
                data-pd-skel-bone
                className="h-7 w-full rounded-lg"
                delay={380 + index * 40}
              />
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-[#f0f0f0] px-3 pb-4 pt-3">
          <div className="rounded-2xl border border-[#ececec] bg-[#fafafa] p-3.5">
            <Bone data-pd-skel-bone className="h-4 w-16 rounded-md" delay={500} />
            <Bone data-pd-skel-bone className="mt-2 h-4 w-36 rounded-md" delay={540} />
            <Bone data-pd-skel-bone className="mt-2.5 h-1 w-full rounded-full" delay={580} accent />
            <Bone data-pd-skel-bone className="mt-3 h-9 w-full rounded-xl" delay={620} solid accent />
          </div>
          <div className="mt-3 space-y-1">
            <Bone data-pd-skel-bone className="h-8 w-full rounded-xl" delay={660} />
            <Bone data-pd-skel-bone className="h-8 w-full rounded-xl" delay={700} />
          </div>
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#e5e7eb] bg-white px-2.5 py-2">
            <Bone data-pd-skel-bone className="size-9 shrink-0 rounded-full" delay={740} />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Bone data-pd-skel-bone className="h-3.5 w-24 rounded-md" delay={780} />
              <Bone data-pd-skel-bone className="h-3 w-20 rounded-md" delay={820} />
            </div>
            <Bone data-pd-skel-bone className="size-7 rounded-lg" delay={860} />
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-6 py-5 lg:px-8" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <div className="-mx-6 -mt-5 flex items-center justify-between border-b border-black/10 bg-[#fafafa] p-5 lg:-mx-8">
          <Bone data-pd-skel-bone className="h-5 w-28 rounded-md" delay={200} />
          <div className="flex items-center gap-3">
            <Bone data-pd-skel-bone className="h-7 w-36 rounded-full" delay={240} />
            <Bone data-pd-skel-bone className="h-10 w-28 rounded-[12px]" delay={280} />
          </div>
        </div>

        <div
          data-pd-skel-section
          data-pd-skel-animate
          className="mt-5 flex items-center justify-between gap-4 rounded-[20px] border border-black/10 bg-[#F4F4F4] p-5"
        >
          <div className="flex min-w-0 items-center gap-4">
            <Bone data-pd-skel-bone className="size-[52px] shrink-0 rounded-2xl" delay={320} solid />
            <div className="min-w-0 space-y-2">
              <Bone data-pd-skel-bone className="h-7 w-56 max-w-full rounded-lg" delay={360} solid />
              <Bone data-pd-skel-bone className="h-5 w-72 max-w-full rounded-md" delay={400} />
            </div>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <Bone data-pd-skel-bone className="h-10 w-32 rounded-[12px]" delay={440} solid accent />
            <Bone data-pd-skel-bone className="h-10 w-28 rounded-[12px]" delay={480} />
          </div>
        </div>

        <div data-pd-skel-section data-pd-skel-animate className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_364px]">
          <div className="space-y-5">
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Bone
                  key={index}
                  data-pd-skel-bone
                  className="h-[108px] min-w-0 flex-1 rounded-[12px]"
                  delay={520 + index * 50}
                  solid={index === 0}
                />
              ))}
            </div>
            <div className="rounded-[20px] border border-black/10 p-5">
              <div className="flex items-center justify-between">
                <Bone data-pd-skel-bone className="h-5 w-32 rounded-md" delay={720} />
                <Bone data-pd-skel-bone className="h-4 w-14 rounded-md" delay={760} accent />
              </div>
              <div className="mt-5 flex gap-3 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Bone
                    key={index}
                    data-pd-skel-bone
                    className="h-[210px] w-[210px] shrink-0 rounded-[14px]"
                    delay={800 + index * 60}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex h-[416px] flex-col gap-5 rounded-[20px] border border-black/10 bg-white p-5">
            <Bone data-pd-skel-bone className="h-5 w-36 rounded-md" delay={1040} />
            <div className="min-h-0 flex-1 space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Bone data-pd-skel-bone className="size-9 shrink-0 rounded-full" delay={1080 + index * 40} />
                  <div className="min-w-0 flex-1 space-y-1.5 pt-1">
                    <Bone data-pd-skel-bone className="h-3.5 w-full rounded-md" delay={1100 + index * 40} />
                    <Bone data-pd-skel-bone className="h-3 w-[80%] rounded-md" delay={1120 + index * 40} />
                  </div>
                </div>
              ))}
            </div>
            <Bone data-pd-skel-bone className="h-10 w-full rounded-xl" delay={1360} />
          </div>
        </div>

        <div
          data-pd-skel-section
          data-pd-skel-animate
          className="mt-5 overflow-hidden rounded-2xl border border-[#ededed] bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-[#ededed] px-4 py-3.5">
            <Bone data-pd-skel-bone className="h-10 w-44 rounded-[10px]" delay={1400} />
            <Bone data-pd-skel-bone className="h-10 w-48 rounded-[10px]" delay={1440} />
            <Bone data-pd-skel-bone className="ml-auto h-9 w-20 rounded-[12px]" delay={1480} />
          </div>
          <div className="space-y-0 p-0">
            <Bone data-pd-skel-bone className="h-11 w-full rounded-none" delay={1520} solid />
            {Array.from({ length: 6 }).map((_, index) => (
              <Bone
                key={index}
                data-pd-skel-row
                className="h-12 w-full rounded-none border-t border-black/5"
                delay={1560 + index * 35}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

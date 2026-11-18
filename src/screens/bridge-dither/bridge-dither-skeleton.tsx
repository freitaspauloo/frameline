"use client";

import type { CSSProperties } from "react";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

import { NAV_LINKS } from "./constants";
import "./bridge-dither-skeleton.css";

function Bone({
  className,
  delay = 0,
  strong = false,
  style,
}: {
  className?: string;
  delay?: number;
  strong?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("bone bone-enter", strong && "bone-strong", className)}
      style={{ "--delay": `${delay}ms`, ...style } as CSSProperties}
    />
  );
}

export function BridgeDitherSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  return (
    <ScreenStage embed={embed} background="#ffffff" className={className}>
      <section
        className={cn(
          GeistSans.className,
          "fl-oasis-skeleton relative h-full w-full overflow-hidden bg-white text-zinc-950 antialiased",
        )}
        aria-busy="true"
        aria-label="Loading Reticle hero"
      >
      <div className="dither-skel" aria-hidden>
        <div className="dither-skel-grid" />
        <div className="dither-skel-tint" />
        <div className="dither-skel-sweep" />
      </div>

      <div className="fade-top" aria-hidden />
      <div className="fade-bottom" aria-hidden />

      <div className="relative z-10 flex h-full w-full flex-col">
        <header className="relative z-20 px-4 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6">
          <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                <Bone className="size-4 rounded-full sm:size-[18px]" delay={0} />
                <Bone className="h-3.5 w-14 rounded-full sm:h-4 sm:w-16" delay={40} />
              </div>
              <div className="hidden items-center gap-5 md:flex lg:gap-6">
                {NAV_LINKS.map((label, index) => (
                  <Bone
                    key={label}
                    className="h-3 w-14 rounded-full lg:h-3.5 lg:w-16"
                    delay={80 + index * 40}
                  />
                ))}
              </div>
            </div>
            <Bone className="h-8 w-28 rounded-full sm:h-9 sm:w-32" delay={120} strong />
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-6 lg:px-10 lg:pb-10 lg:pt-8">
          <div className="space-y-3 sm:space-y-4">
            <Bone
              strong
              className="h-[clamp(2rem,7.5vw,5.5rem)] w-[min(100%,24ch)] rounded-md lg:h-[88px] lg:max-w-[26ch]"
              delay={100}
            />
            <Bone
              strong
              className="h-[clamp(2rem,7.5vw,5.5rem)] w-[min(72%,18ch)] rounded-md lg:h-[88px]"
              delay={140}
            />
          </div>
        </div>
      </div>
      </section>
    </ScreenStage>
  );
}

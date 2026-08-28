"use client";

import { GeistMono } from "geist/font/mono";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

import "./fifty-x-hero-skeleton.css";

const TEMPLATE_CARD_PEEK_PX = 38;

function Bone({
  className,
  delay = 0,
  solid = false,
}: {
  className?: string;
  delay?: number;
  solid?: boolean;
}) {
  return (
    <div
      className={cn("fx-skel-bone", solid && "fx-skel-bone--solid", className)}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export type FiftyXHeroSkeletonProps = {
  className?: string;
  embed?: boolean;
};

/** Loading skeleton for the FORGE.AI hero — mirrors nav, prompt card, template rail. */
export function FiftyXHeroSkeleton({ className, embed = false }: FiftyXHeroSkeletonProps) {
  const shell = (
    <section
      className={cn(
        GeistMono.className,
        "fl-fifty-x-skeleton relative flex w-full flex-col overflow-x-clip bg-[#000105] font-light text-white antialiased [font-synthesis:none]",
        embed ? "h-full min-h-0" : "min-h-dvh",
        className,
      )}
      aria-busy="true"
      aria-label="Loading hero"
    >
      <div className="fx-skel-bg-wrap" aria-hidden>
        <div className="fx-skel-bg-plate" />
        <div className="fx-skel-grain" />
      </div>

      <div className="fx-skel-fade" aria-hidden />

      <header className="relative z-10 mx-auto flex w-full max-w-[1342px] items-center justify-between px-6 pt-[42px] sm:px-10">
        <Bone className="fx-skel-nav-brand fx-skel-pill" delay={0} />
        <div className="flex h-[42px] items-center gap-4 sm:gap-6">
          <Bone className="fx-skel-nav-login fx-skel-bone--solid" delay={60} solid />
          <Bone className="fx-skel-nav-start" delay={100} />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1342px] flex-1 flex-col items-center justify-center px-6 sm:px-10">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-[21px]">
            <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 py-1">
              <Bone className="fx-skel-headline-text" delay={120} />
              <Bone className="fx-skel-headline-pill fx-skel-pill" delay={160} />
            </div>
            <Bone className="fx-skel-subtitle" delay={200} />
          </div>

          <div className="fx-skel-form relative mt-10 flex w-full flex-col gap-8">
            <Bone className="fx-skel-form-label" delay={240} />
            <div className="flex h-9 w-full shrink-0 items-center gap-2.5">
              <Bone className="fx-skel-chip-circle" delay={280} />
              <Bone className="fx-skel-chip" delay={310} />
              <Bone className="fx-skel-chip-sm" delay={340} />
              <span className="min-w-0 flex-1 basis-0" />
              <Bone className="fx-skel-icon-btn" delay={370} />
              <Bone className="fx-skel-icon-btn fx-skel-icon-btn--send" delay={400} solid />
            </div>
          </div>
        </div>
      </main>

      <section
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1342px] px-6 sm:px-10",
          embed ? "absolute inset-x-0 bottom-0" : "mt-auto",
        )}
      >
        <div className="flex flex-col gap-[33px] overflow-clip rounded-t-[32px] bg-[#262626] px-[37px] pt-[33px] pb-0">
          <div className="flex items-start justify-between gap-2 self-stretch">
            <div className="relative flex h-14 flex-1 flex-col gap-2">
              <Bone className="fx-skel-template-title" delay={430} />
              <Bone className="fx-skel-template-sub" delay={460} />
            </div>
            <Bone className="fx-skel-template-link" delay={490} />
          </div>
          <div className="overflow-hidden" style={{ height: TEMPLATE_CARD_PEEK_PX }}>
            <div className="grid grid-cols-2 gap-[33px] lg:grid-cols-4">
              <Bone className="fx-skel-template-card" delay={520} />
              <Bone className="fx-skel-template-card" delay={550} />
              <Bone className="fx-skel-template-card hidden lg:block" delay={580} />
              <Bone className="fx-skel-template-card hidden lg:block" delay={610} />
            </div>
          </div>
        </div>
      </section>
    </section>
  );

  if (embed) {
    return (
      <ScreenStage embed background="#000105" className={className}>
        {shell}
      </ScreenStage>
    );
  }

  return shell;
}

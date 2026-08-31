"use client";

import { GeistMono } from "geist/font/mono";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

import {
  FORGEAI_STAGE_HEIGHT,
  FORGEAI_STAGE_WIDTH,
} from "./forgeai-stage";
import {
  FORGEAI_BLUE,
  FORGEAI_LIME,
  FORGEAI_PINK,
  forgeAiAccentStyle,
  type ForgeAiAccent,
} from "./accents";
import "./fifty-x-hero-skeleton.css";

const DEFAULT_ACCENT = FORGEAI_BLUE;

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
  accent?: ForgeAiAccent;
};

/** Loading skeleton for the FORGE.AI hero — mirrors nav, prompt card, template rail. */
export function FiftyXHeroSkeleton({
  className,
  embed = false,
  accent = DEFAULT_ACCENT,
}: FiftyXHeroSkeletonProps) {
  const shell = (
    <section
      className={cn(
        GeistMono.className,
        "fl-fifty-x-skeleton relative flex w-full flex-col overflow-x-clip bg-[#000105] font-light text-white antialiased [font-synthesis:none]",
        accent.id !== "blue" && `fl-fifty-x-skeleton--${accent.id}`,
        embed
          ? "fl-fifty-x-skeleton--stage h-full min-h-0 overflow-hidden"
          : "min-h-[max(1080px,100dvh)]",
        className,
      )}
      style={forgeAiAccentStyle(accent)}
      aria-busy="true"
      aria-label="Loading hero"
    >
      <div className="fx-skel-bg-wrap" aria-hidden>
        <div className="fx-skel-bg-plate" />
        {accent.tint ? (
          <div className="fx-skel-bg-tint" style={{ backgroundColor: accent.tint }} />
        ) : null}
        <div className="fx-skel-grain" />
      </div>

      <div className="fx-skel-fade" aria-hidden />

      <header
        className="relative z-10 mx-auto flex w-full max-w-[1342px] shrink-0 items-center justify-between px-6 sm:px-10"
        style={{ paddingTop: "var(--fx-nav-pt)" }}
      >
        <Bone className="fx-skel-nav-brand fx-skel-pill" delay={0} />
        <div className="flex h-[42px] items-center gap-4 sm:gap-6">
          <Bone className="fx-skel-nav-login fx-skel-bone--solid" delay={60} solid />
          <Bone className="fx-skel-nav-start" delay={100} />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full min-h-0 max-w-[1342px] flex-1 flex-col items-center justify-center px-6 sm:px-10">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-[21px]">
            <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 py-1">
              <Bone className="fx-skel-headline-text" delay={120} />
              <Bone className="fx-skel-headline-pill fx-skel-pill" delay={160} />
            </div>
            <Bone className="fx-skel-subtitle" delay={200} />
          </div>

          <div
            className="fx-skel-form relative flex w-full flex-col gap-8"
            style={{ marginTop: "var(--fx-form-mt)" }}
          >
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

      <section className="relative z-10 mx-auto mt-auto w-full max-w-[1342px] shrink-0 px-6 sm:px-10">
        <div
          className="flex flex-col overflow-clip rounded-t-[32px] bg-[#262626] px-[37px]"
          style={{
            gap: "var(--fx-template-tray-gap)",
            paddingTop: "var(--fx-template-tray-pt)",
            paddingBottom: "var(--fx-template-tray-pb)",
          }}
        >
          <div className="flex items-start justify-between gap-2 self-stretch">
            <div className="relative flex h-14 flex-1 flex-col gap-2">
              <Bone className="fx-skel-template-title" delay={430} />
              <Bone className="fx-skel-template-sub" delay={460} />
            </div>
            <Bone className="fx-skel-template-link" delay={490} />
          </div>
          <div className="overflow-hidden" style={{ height: "var(--fx-template-card-h)" }}>
            <div className="grid grid-cols-4 gap-[33px]">
              <Bone className="fx-skel-template-card" delay={520} />
              <Bone className="fx-skel-template-card" delay={550} />
              <Bone className="fx-skel-template-card" delay={580} />
              <Bone className="fx-skel-template-card" delay={610} />
            </div>
          </div>
        </div>
      </section>
    </section>
  );

  if (embed) {
    return (
      <ScreenStage
        embed
        fit="width"
        background="#000105"
        className={className}
        width={FORGEAI_STAGE_WIDTH}
        height={FORGEAI_STAGE_HEIGHT}
      >
        {shell}
      </ScreenStage>
    );
  }

  return shell;
}

export function ForgeAiPinkSkeleton(props: Omit<FiftyXHeroSkeletonProps, "accent">) {
  return <FiftyXHeroSkeleton {...props} accent={FORGEAI_PINK} />;
}

export function ForgeAiLimeSkeleton(props: Omit<FiftyXHeroSkeletonProps, "accent">) {
  return <FiftyXHeroSkeleton {...props} accent={FORGEAI_LIME} />;
}

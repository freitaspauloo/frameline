"use client";

import * as React from "react";

import { HeroMacOSDock } from "@/components/hero-macos-dock";
import { HeroDither } from "@/components/motion/hero-dither";
import { cn } from "@/lib/utils";

const HERO_INK = "#3A58F0";
const HERO_PAPER = "#FFFFFF";

function TrafficLights() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span
        className="size-3 rounded-full"
        style={{
          background: "#FF5F57",
          boxShadow: "0 0 0 0.5px #E0443E",
        }}
      />
      <span
        className="size-3 rounded-full"
        style={{
          background: "#FEBC2E",
          boxShadow: "0 0 0 0.5px #D4A017",
        }}
      />
      <span
        className="size-3 rounded-full"
        style={{
          background: "#28C840",
          boxShadow: "0 0 0 0.5px #1AAB29",
        }}
      />
    </div>
  );
}

/**
 * macOS window shell for the homepage hero — traffic lights, white chrome,
 * ink dither filling the stage, dock pinned to the window bottom.
 */
export function HeroMacFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-full min-h-[min(52dvh,560px)] w-full max-w-7xl flex-col overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18),0_2px_0_rgba(255,255,255,0.6)_inset]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="relative z-30 flex h-11 shrink-0 items-center border-b border-black/8 bg-[#F5F5F5] px-4">
        <TrafficLights />
        <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium tracking-[-0.01em] text-black/45">
          Ink Dither
        </span>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
        <HeroDither colorBack={HERO_PAPER} colorFront={HERO_INK} />
        <HeroMacOSDock />
      </div>
    </div>
  );
}

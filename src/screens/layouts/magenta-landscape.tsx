"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import { ReticleBrand } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

export function MagentaLandscape({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#1a0414" embed={embed}>
      <GrainGradient
        colors={["#2a061c", "#d600bf", "#7a1048", "#140810"]}
        intensity={0.7}
        noise={0.42}
        shape="corners"
        softness={0.72}
        speed={0.28}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
      <header className="absolute inset-x-[8%] top-14 flex items-center justify-between">
        <ReticleBrand light />
        <button
          className="border border-white/20 bg-white/8 px-5 py-2.5 text-[12px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md"
          type="button"
        >
          Request Info
        </button>
      </header>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[28%] h-px bg-white/25"
      />
      <div className="absolute inset-x-[8%] bottom-[12%] max-w-[36rem] text-white">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
          Magenta landscape
        </p>
        <h1 className="mt-4 text-[64px] leading-[0.95] font-normal tracking-[-0.03em]">
          Yield across the horizon.
        </h1>
        <p className="mt-5 max-w-[40ch] text-[18px] leading-relaxed text-white/70">
          In-line defect inspection built for high-volume semiconductor
          manufacturing worldwide — models trained on real fab imagery.
        </p>
      </div>
    </ScreenStage>
  );
}

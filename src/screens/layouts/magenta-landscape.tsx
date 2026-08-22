"use client";

import { GrainGradient } from "@paper-design/shaders-react";

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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[28%] h-px bg-white/25"
      />
      <div className="absolute inset-x-[8%] bottom-[12%] max-w-[28rem] text-white">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
          Magenta landscape
        </p>
        <h1 className="mt-4 font-serif text-[64px] leading-[0.95] font-normal tracking-[-0.03em]">
          A field, not a flex.
        </h1>
        <p className="mt-5 max-w-[36ch] text-[18px] leading-relaxed text-white/70">
          Horizon line, grain, and one lockup. Drop it behind a hero and stop
          shipping the default dusk gradient.
        </p>
      </div>
    </ScreenStage>
  );
}

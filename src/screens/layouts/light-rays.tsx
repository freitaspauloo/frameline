"use client";

import { GodRays } from "@paper-design/shaders-react";

import { ScreenStage } from "@/screens/stage";

export function LightRays({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#050508" embed={embed}>
      <GodRays
        bloom={0.42}
        colorBack="#050508"
        colorBloom="#3A58F0"
        colors={["#2D6BFF", "#5B8CFF", "#E8F0FF", "#1A3A8F"]}
        density={0.32}
        intensity={0.8}
        midIntensity={0.48}
        midSize={0.24}
        scale={1}
        speed={0.55}
        spotty={0.26}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
      <div className="absolute inset-x-[10%] top-[38%] max-w-[34rem] text-white">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-white/50 uppercase">
          Light rays
        </p>
        <h1 className="mt-4 font-serif text-[68px] leading-[0.95] tracking-[-0.03em]">
          Light first.
        </h1>
        <p className="mt-5 max-w-[34ch] text-[18px] leading-relaxed text-white/65">
          God-ray bloom for heroes that need air, not a stock glow PNG.
        </p>
      </div>
    </ScreenStage>
  );
}

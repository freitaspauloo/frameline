"use client";

import { GodRays } from "@paper-design/shaders-react";

import { ReticleBrand } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

const STATS = [
  { value: "24/7", label: "Always-on" },
  { value: "98%", label: "Capture rate" },
  { value: "40M+", label: "Dies / quarter" },
] as const;

export function LightRays({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#050508" embed={embed}>
      <GodRays
        bloom={0.42}
        colorBack="#050508"
        colorBloom="#d600bf"
        colors={["#d600bf", "#7a1048", "#E8F0FF", "#2a061c"]}
        density={0.32}
        intensity={0.8}
        midIntensity={0.48}
        midSize={0.24}
        scale={1}
        speed={0.55}
        spotty={0.26}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
      <header className="absolute inset-x-[10%] top-14 flex items-center justify-between">
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
        className="pointer-events-none absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-[42%] rounded-full border border-white/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[360px] -translate-x-1/2 -translate-y-[42%] rounded-full border border-[#d600bf]/35"
      />
      <div className="absolute inset-x-[10%] bottom-[12%] max-w-[38rem] text-white">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-white/50 uppercase">
          Always-on wafer inspection
        </p>
        <h1 className="mt-4 text-[64px] leading-[0.95] tracking-[-0.03em]">
          The line never sleeps.
        </h1>
        <p className="mt-5 max-w-[38ch] text-[18px] leading-relaxed text-white/65">
          In-line models stay on the tool — classifying dies across nodes,
          shifts, and process steps without leaving the fab.
        </p>
        <dl className="mt-10 flex gap-12">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[28px] tracking-tight">{stat.value}</dt>
              <dd className="mt-1 text-[12px] tracking-[0.16em] text-white/45 uppercase">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </ScreenStage>
  );
}

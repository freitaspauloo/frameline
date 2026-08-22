"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import { ReticleBrand } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

const RAIL = [
  {
    n: "01",
    title: "Catch killer defects",
    body: "Models trained on real fab imagery across nodes, tools, and process steps.",
  },
  {
    n: "02",
    title: "Classify dies in-line",
    body: "Qualified on production imagery, not controlled laboratory samples.",
  },
  {
    n: "03",
    title: "Rank for review",
    body: "Each cycle is spent on the classifications that protect yield.",
  },
  {
    n: "04",
    title: "Protect yield at volume",
    body: "In-line inspection built for high-volume semiconductor manufacturing.",
  },
] as const;

export function FeatureRail({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#f7f6f3" embed={embed}>
      <div className="absolute inset-0 flex">
        <aside className="flex w-[42%] flex-col justify-between border-r border-black/10 px-14 py-14">
          <div>
            <ReticleBrand />
            <p className="mt-10 text-[11px] font-semibold tracking-[0.28em] text-black/40 uppercase">
              Protect yield
            </p>
            <h1 className="mt-4 text-[52px] leading-[1.02] tracking-[-0.03em] text-[#10121c]">
              Four beats that keep yield on the line.
            </h1>
          </div>
          <ol className="space-y-7">
            {RAIL.map((item) => (
              <li key={item.n} className="flex gap-5">
                <span className="w-8 text-[11px] font-semibold tracking-[0.18em] text-[#d600bf]">
                  {item.n}
                </span>
                <div>
                  <p className="text-[18px] font-medium text-[#10121c]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-black/50">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
        <div className="relative flex-1 bg-[#140810]">
          <GrainGradient
            colors={["#140810", "#d600bf", "#2a061c", "#000000"]}
            intensity={0.62}
            noise={0.38}
            shape="corners"
            softness={0.7}
            speed={0.22}
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
            }}
          />
          <div className="absolute inset-0 flex items-end p-12">
            <p className="max-w-[22ch] text-[28px] leading-snug text-white">
              Built to catch killer defects before they leave the line.
            </p>
          </div>
        </div>
      </div>
    </ScreenStage>
  );
}

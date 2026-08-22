"use client";

import { ReticleBrand } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

const TURNS = [
  {
    role: "You",
    text: "Rank today’s killer defects on lot 40M before they leave the line.",
  },
  {
    role: "Reticle",
    text: "14 dies flagged. 4 killers at ≥0.84, then particle and scratch. Review queue is ordered for yield.",
  },
] as const;

export function PromptBar({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#0c0d10" embed={embed}>
      <div className="absolute inset-0 flex flex-col">
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-12">
          <ReticleBrand light />
          <p className="text-[13px] text-white/35">Defect assistant · lot 40M</p>
        </header>
        <div className="flex-1 space-y-8 px-12 py-12">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-white/40 uppercase">
            Defect assistant
          </p>
          {TURNS.map((turn) => (
            <div key={turn.role} className="max-w-[42rem]">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#d600bf] uppercase">
                {turn.role}
              </p>
              <p className="mt-2 text-[22px] leading-snug text-white/90">
                {turn.text}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 px-12 py-8">
          <div className="flex h-[72px] items-center gap-4 border border-white/15 bg-white/[0.04] px-6">
            <span className="flex-1 text-[18px] text-white/35">
              Ask the defect assistant…
            </span>
            <span className="bg-[#d600bf] px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
              Send
            </span>
          </div>
        </div>
      </div>
    </ScreenStage>
  );
}

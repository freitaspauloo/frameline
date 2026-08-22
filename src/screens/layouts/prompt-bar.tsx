"use client";

import { ScreenStage } from "@/screens/stage";

const TURNS = [
  { role: "You", text: "Draft a hero that doesn’t look like every AI landing page." },
  {
    role: "Frameline",
    text: "Orb, feature cards, or light rays — pick a layout, then bind tokens.",
  },
] as const;

export function PromptBar({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#0c0d10" embed={embed}>
      <div className="absolute inset-0 flex flex-col">
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-12">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-white/45 uppercase">
            Prompt bar
          </p>
          <p className="text-[13px] text-white/35">Workspace · untitled</p>
        </header>
        <div className="flex-1 space-y-8 px-12 py-12">
          {TURNS.map((turn) => (
            <div key={turn.role} className="max-w-[40rem]">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#7b93ff] uppercase">
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
              Ask for a layout…
            </span>
            <span className="bg-[#3A58F0] px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
              Send
            </span>
          </div>
        </div>
      </div>
    </ScreenStage>
  );
}

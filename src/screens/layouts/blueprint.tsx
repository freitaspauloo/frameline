"use client";

import { ScreenStage } from "@/screens/stage";

export function Blueprint({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#071225" embed={embed}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,210,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(180,210,255,0.12) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-16 border border-[#7eb0ff]/35">
        <div className="absolute -top-3 left-8 bg-[#071225] px-3 text-[11px] tracking-[0.24em] text-[#7eb0ff] uppercase">
          Sheet A1 · Blueprint
        </div>
        <div className="absolute top-16 left-16 max-w-[28rem]">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#7eb0ff]/70 uppercase">
            Measured surface
          </p>
          <h1 className="mt-4 font-serif text-[64px] leading-[0.95] text-[#e8f1ff]">
            Draw the room before you ship it.
          </h1>
          <p className="mt-6 max-w-[38ch] text-[17px] leading-relaxed text-[#9cb6d8]">
            Hairline grid, callouts, and type that reads like a plate — not a
            landing-page mock.
          </p>
        </div>
        <div className="absolute right-16 bottom-16 space-y-3 text-right text-[12px] tracking-[0.16em] text-[#7eb0ff]/80 uppercase">
          <p>1920 × 1080</p>
          <p>Scale 1:1</p>
          <p>Rev 03</p>
        </div>
      </div>
    </ScreenStage>
  );
}

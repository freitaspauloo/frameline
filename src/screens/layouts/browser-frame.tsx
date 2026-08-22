"use client";

import { Dithering } from "@paper-design/shaders-react";

import { ScreenStage } from "@/screens/stage";

export function BrowserFrame({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#e8e8ea" embed={embed}>
      <div className="absolute inset-[72px] overflow-hidden rounded-[10px] border border-black/10 bg-white shadow-[0_40px_80px_rgba(16,18,28,0.18)]">
        <div className="flex h-[52px] items-center gap-4 border-b border-black/8 bg-[#f4f4f5] px-5">
          <div className="flex items-center gap-2" aria-hidden>
            <span className="size-3 rounded-full bg-[#ff5f57] shadow-[0_0_0_0.5px_#e0443e]" />
            <span className="size-3 rounded-full bg-[#febc2e] shadow-[0_0_0_0.5px_#d4a017]" />
            <span className="size-3 rounded-full bg-[#28c840] shadow-[0_0_0_0.5px_#1aab29]" />
          </div>
          <div className="flex h-8 min-w-0 flex-1 items-center rounded-md bg-white px-3 text-[13px] tracking-wide text-black/45">
            frameline.ai / browser-frame
          </div>
        </div>
        <div className="relative h-[calc(100%-52px)]">
          <Dithering
            colorBack="#ffffff"
            colorFront="#2d6bff"
            speed={0.22}
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
            }}
          />
          <div className="absolute inset-x-[8%] bottom-[10%] max-w-[26rem]">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#1a2a6b]/55 uppercase">
              Browser frame
            </p>
            <h1 className="mt-3 font-serif text-[52px] leading-[1.02] tracking-[-0.03em] text-[#10121c]">
              Product, in chrome.
            </h1>
          </div>
        </div>
      </div>
    </ScreenStage>
  );
}

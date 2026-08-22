"use client";

import { ScreenStage } from "@/screens/stage";

const RAIL = [
  { n: "01", title: "Install", body: "CLI or copy. Source lands in your repo." },
  { n: "02", title: "Theme", body: "Bind colors to tokens. No stock palette." },
  { n: "03", title: "Stage", body: "1920×1080 plate that scales to any frame." },
  { n: "04", title: "Ship", body: "One surface, not a demo graveyard." },
] as const;

export function FeatureRail({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#f7f6f3" embed={embed}>
      <div className="absolute inset-0 flex">
        <aside className="flex w-[38%] flex-col justify-between border-r border-black/10 px-14 py-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-black/40 uppercase">
              Feature rail
            </p>
            <h1 className="mt-5 font-serif text-[56px] leading-[1.02] tracking-[-0.03em] text-[#10121c]">
              Four beats.
              <br />
              One plate.
            </h1>
          </div>
          <ol className="space-y-8">
            {RAIL.map((item) => (
              <li key={item.n} className="flex gap-5">
                <span className="w-8 text-[11px] font-semibold tracking-[0.18em] text-[#3a58f0]">
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
        <div className="relative flex-1 bg-[#111318]">
          <div
            aria-hidden
            className="absolute inset-8 border border-white/10"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[11px] font-semibold tracking-[0.32em] text-white/40 uppercase">
              Live visual
            </p>
          </div>
        </div>
      </div>
    </ScreenStage>
  );
}

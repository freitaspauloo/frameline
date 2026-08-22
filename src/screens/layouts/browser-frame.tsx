"use client";

import { ReticleBrand } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

const DIES = [
  [0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1],
  [2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2],
  [1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
] as const;

const CLASSES = [
  { die: "4,7", kind: "Killer", score: "0.98", tone: "killer" },
  { die: "9,2", kind: "Particle", score: "0.91", tone: "warn" },
  { die: "1,11", kind: "Scratch", score: "0.87", tone: "warn" },
  { die: "7,3", kind: "Killer", score: "0.84", tone: "killer" },
  { die: "11,8", kind: "Residue", score: "0.79", tone: "ok" },
] as const;

const CELL = ["#d8dde8", "#d600bf", "#7a1048"] as const;

export function BrowserFrame({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#d8d6d2" embed={embed}>
      <div className="absolute inset-[56px] overflow-hidden rounded-[12px] border border-black/10 bg-[#f4f3f0] shadow-[0_40px_80px_rgba(16,18,28,0.18)]">
        <div className="flex h-[52px] items-center gap-4 border-b border-black/8 bg-[#eceae6] px-5">
          <div className="flex items-center gap-2" aria-hidden>
            <span className="size-3 rounded-full bg-[#ff5f57] shadow-[0_0_0_0.5px_#e0443e]" />
            <span className="size-3 rounded-full bg-[#febc2e] shadow-[0_0_0_0.5px_#d4a017]" />
            <span className="size-3 rounded-full bg-[#28c840] shadow-[0_0_0_0.5px_#1aab29]" />
          </div>
          <div className="flex h-8 min-w-0 flex-1 items-center rounded-md bg-white px-3 text-[13px] tracking-wide text-black/45">
            reticle.ai / inspect
          </div>
        </div>

        <div className="flex h-[calc(100%-52px)]">
          <aside className="flex w-[58%] flex-col border-r border-black/8 bg-[#f7f6f3] px-10 py-8">
            <div className="flex items-center justify-between">
              <ReticleBrand />
              <p className="text-[11px] font-semibold tracking-[0.22em] text-black/35 uppercase">
                Lot 40M · Layer M3
              </p>
            </div>
            <p className="mt-8 text-[11px] font-semibold tracking-[0.24em] text-black/40 uppercase">
              AI inspection interface
            </p>
            <h1 className="mt-3 text-[44px] leading-[1.02] tracking-[-0.03em] text-[#10121c]">
              Classify every die before it leaves the line.
            </h1>
            <div className="mt-8 grid grid-cols-12 gap-1.5">
              {DIES.flatMap((row, y) =>
                row.map((cell, x) => (
                  <span
                    key={`${x}-${y}`}
                    className="aspect-square rounded-[2px]"
                    style={{ background: CELL[cell] }}
                  />
                )),
              )}
            </div>
          </aside>

          <div className="flex flex-1 flex-col bg-white px-8 py-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-black/35 uppercase">
              Ranked review
            </p>
            <p className="mt-2 text-[18px] text-[#10121c]">
              Killer defects first. 14 flagged this lot.
            </p>
            <ol className="mt-8 space-y-3">
              {CLASSES.map((item) => (
                <li
                  key={item.die}
                  className="flex items-center justify-between border border-black/8 px-4 py-3"
                >
                  <div>
                    <p className="text-[13px] tracking-[0.12em] text-black/40 uppercase">
                      Die {item.die}
                    </p>
                    <p className="mt-1 text-[16px] text-[#10121c]">{item.kind}</p>
                  </div>
                  <span
                    className={
                      item.tone === "killer"
                        ? "text-[18px] font-medium text-[#d600bf]"
                        : "text-[18px] font-medium text-[#10121c]"
                    }
                  >
                    {item.score}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </ScreenStage>
  );
}

"use client";

import { ReticleBrand } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

const FACE = [
  "00111100",
  "01111110",
  "11100111",
  "11011011",
  "11011011",
  "11100111",
  "01111110",
  "00111100",
] as const;

function PixelFace({
  className,
  fill,
}: {
  className?: string;
  fill: string;
}) {
  return (
    <div className={`grid grid-cols-8 gap-[3px] ${className ?? ""}`}>
      {FACE.flatMap((row, y) =>
        row.split("").map((bit, x) => (
          <span
            key={`${x}-${y}`}
            className="aspect-square"
            style={{ background: bit === "1" ? fill : "transparent" }}
          />
        )),
      )}
    </div>
  );
}

export function Blueprint({ embed = false }: { embed?: boolean }) {
  return (
    <ScreenStage background="#070b16" embed={embed}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(214,0,191,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(214,0,191,0.18) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <header className="absolute inset-x-16 top-14 flex items-center justify-between">
        <ReticleBrand light />
        <p className="text-[11px] font-semibold tracking-[0.22em] text-white/40 uppercase">
          Die resolution · 8×8
        </p>
      </header>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative size-[420px]"
          style={{ perspective: "1200px" }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(18deg) rotateY(-28deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0 border border-[#d600bf]/40 bg-[#120818]/90 p-6"
              style={{ transform: "translateZ(120px)" }}
            >
              <PixelFace fill="#d600bf" />
            </div>
            <div
              className="absolute inset-y-0 right-0 w-[120px] border border-[#d600bf]/25 bg-[#2a061c]"
              style={{
                transform: "rotateY(90deg) translateZ(210px)",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-[120px] border border-white/10 bg-[#1a0a18]"
              style={{
                transform: "rotateX(90deg) translateZ(210px)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-16 bottom-16 max-w-[34rem] text-white">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-[#d600bf] uppercase">
          Pixel cube
        </p>
        <h1 className="mt-4 text-[60px] leading-[0.95] tracking-[-0.03em]">
          Every cell classified.
        </h1>
        <p className="mt-5 max-w-[38ch] text-[17px] leading-relaxed text-white/65">
          Die-level inspection at production volume — 40 million classified
          this quarter, before they leave the line.
        </p>
      </div>
    </ScreenStage>
  );
}

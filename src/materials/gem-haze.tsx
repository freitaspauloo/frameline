"use client";

import { GemSmoke } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type GemHazeProps = MaterialSurfaceProps & {
  colors?: string[];
  colorBack?: string;
  colorInner?: string;
  innerDistortion?: number;
  outerDistortion?: number;
  outerGlow?: number;
  innerGlow?: number;
  offset?: number;
  angle?: number;
  size?: number;
  scale?: number;
  speed?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#AF52DE", "#E8F0FF"];

/**
 * Gem haze mesh — glassy smoke field for heroes and framed cards.
 * (FlutedGlass needs a source image; GemSmoke is the catalog-safe stand-in.)
 */
export function GemHaze({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorBack = "#0A0A0A",
  colorInner = "#1A1A2E",
  innerDistortion = 0.75,
  outerDistortion = 0.55,
  outerGlow = 0.6,
  innerGlow = 0.9,
  offset = 0.05,
  angle = 15,
  size = 0.85,
  scale = 0.7,
  speed = 0.65,
  forceStatic = false,
}: GemHazeProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <GemSmoke
        angle={angle}
        colorBack={colorBack}
        colorInner={colorInner}
        colors={colors}
        innerDistortion={innerDistortion}
        innerGlow={innerGlow}
        offset={offset}
        outerDistortion={outerDistortion}
        outerGlow={outerGlow}
        scale={scale}
        shape="diamond"
        size={size}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

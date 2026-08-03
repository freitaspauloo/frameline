"use client";

import { Warp } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type EmberWarpProps = MaterialSurfaceProps & {
  colors?: string[];
  speed?: number;
  proportion?: number;
  softness?: number;
  distortion?: number;
  swirl?: number;
  shapeScale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#0A0A0A", "#C45C26", "#1A1210", "#E8A05C"];

/**
 * Ember warp mesh — heroes and sectional heat fields.
 */
export function EmberWarp({
  className,
  style,
  colors = DEFAULT_COLORS,
  speed = 0.7,
  proportion = 0.45,
  softness = 0.85,
  distortion = 0.3,
  swirl = 0.65,
  shapeScale = 0.12,
  forceStatic = false,
}: EmberWarpProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <Warp
        colors={colors}
        distortion={distortion}
        proportion={proportion}
        shape="checks"
        shapeScale={shapeScale}
        softness={softness}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        swirl={swirl}
      />
    </MaterialShell>
  );
}

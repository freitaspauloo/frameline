"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type GrainNightProps = MaterialSurfaceProps & {
  colors?: string[];
  speed?: number;
  softness?: number;
  intensity?: number;
  noise?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#0A0A0A", "#1A1A2E", "#2D4A6B", "#0D1520"];

/**
 * Grain night — dark night grain for auth shells and quiet cards.
 */
export function GrainNight({
  className,
  style,
  colors = DEFAULT_COLORS,
  speed = 0.25,
  softness = 0.8,
  intensity = 0.55,
  noise = 0.5,
  forceStatic = false,
}: GrainNightProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <GrainGradient
        colors={colors}
        intensity={intensity}
        noise={noise}
        shape="corners"
        softness={softness}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

"use client";

import { Spiral } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type SpiralInkProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorFront?: string;
  density?: number;
  distortion?: number;
  strokeWidth?: number;
  strokeTaper?: number;
  strokeCap?: number;
  noise?: number;
  noiseFrequency?: number;
  softness?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

/**
 * Spiral ink dither — twisting ink spiral for heroes and sections.
 */
export function SpiralInk({
  className,
  style,
  colorBack = "#0A0A0A",
  colorFront = "#2D6BFF",
  density = 0.85,
  distortion = 0.15,
  strokeWidth = 0.55,
  strokeTaper = 0.12,
  strokeCap = 0.4,
  noise = 0.2,
  noiseFrequency = 0.28,
  softness = 0.08,
  speed = 0.55,
  scale = 1,
  forceStatic = false,
}: SpiralInkProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <Spiral
        colorBack={colorBack}
        colorFront={colorFront}
        density={density}
        distortion={distortion}
        noise={noise}
        noiseFrequency={noiseFrequency}
        scale={scale}
        softness={softness}
        speed={speed}
        strokeCap={strokeCap}
        strokeTaper={strokeTaper}
        strokeWidth={strokeWidth}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

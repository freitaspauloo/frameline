"use client";

import { Waves } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type WaveRibbonProps = MaterialSurfaceProps & {
  colorFront?: string;
  colorBack?: string;
  scale?: number;
  shape?: number;
  frequency?: number;
  amplitude?: number;
  spacing?: number;
  proportion?: number;
  softness?: number;
  forceStatic?: boolean;
};

/**
 * Wave ribbon — tighter ribbon-like wave bands for sectional strips.
 */
export function WaveRibbon({
  className,
  style,
  colorFront = "#5B8CFF",
  colorBack = "#0A1628",
  scale = 1.4,
  shape = 0.6,
  frequency = 1.1,
  amplitude = 0.22,
  spacing = 0.55,
  proportion = 0.5,
  softness = 0.08,
  forceStatic = false,
}: WaveRibbonProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <Waves
        amplitude={amplitude}
        colorBack={colorBack}
        colorFront={colorFront}
        frequency={frequency}
        proportion={proportion}
        scale={scale}
        shape={shape}
        softness={softness}
        spacing={spacing}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

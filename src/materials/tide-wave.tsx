"use client";

import { Waves } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type TideWaveProps = MaterialSurfaceProps & {
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
 * Tide wave mesh — heroes and sectional bands.
 */
export function TideWave({
  className,
  style,
  colorFront = "#2D6BFF",
  colorBack = "#0B1C2D",
  scale = 0.7,
  shape = 1.2,
  frequency = 0.45,
  amplitude = 0.4,
  spacing = 1.1,
  proportion = 0.35,
  softness = 0.15,
  forceStatic = false,
}: TideWaveProps) {
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

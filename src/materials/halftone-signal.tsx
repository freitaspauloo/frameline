"use client";

import { HalftoneDots } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type HalftoneSignalProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorFront?: string;
  size?: number;
  radius?: number;
  contrast?: number;
  grainMixer?: number;
  grainOverlay?: number;
  speed?: number;
  forceStatic?: boolean;
};

/**
 * Halftone signal dither — sections and empty states.
 */
export function HalftoneSignal({
  className,
  style,
  colorBack = "#F4F1EA",
  colorFront = "#2D6BFF",
  size = 0.55,
  radius = 1.2,
  contrast = 0.45,
  grainMixer = 0.15,
  grainOverlay = 0.18,
  speed = 0.2,
  forceStatic = false,
}: HalftoneSignalProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <HalftoneDots
        colorBack={colorBack}
        colorFront={colorFront}
        contrast={contrast}
        grainMixer={grainMixer}
        grainOverlay={grainOverlay}
        grid="hex"
        radius={radius}
        size={size}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        type="gooey"
      />
    </MaterialShell>
  );
}

"use client";

import { HalftoneCmyk } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type CmykHalftoneProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorC?: string;
  colorM?: string;
  colorY?: string;
  colorK?: string;
  size?: number;
  contrast?: number;
  softness?: number;
  grainSize?: number;
  grainMixer?: number;
  grainOverlay?: number;
  gridNoise?: number;
  floodC?: number;
  floodM?: number;
  floodY?: number;
  floodK?: number;
  gainC?: number;
  gainM?: number;
  gainY?: number;
  gainK?: number;
  scale?: number;
  forceStatic?: boolean;
};

/**
 * CMYK halftone dither — sectional print fields and empty states.
 */
export function CmykHalftone({
  className,
  style,
  colorBack = "#FBFAF5",
  colorC = "#00B4FF",
  colorM = "#FC519F",
  colorY = "#FFD800",
  colorK = "#231F20",
  size = 0.28,
  contrast = 1,
  softness = 0.7,
  grainSize = 0.4,
  grainMixer = 0.05,
  grainOverlay = 0.08,
  gridNoise = 0.25,
  floodC = 0.2,
  floodM = 0.1,
  floodY = 0.05,
  floodK = 0.05,
  gainC = 0.35,
  gainM = 0.15,
  gainY = 0.2,
  gainK = 0.1,
  scale = 1,
  forceStatic = false,
}: CmykHalftoneProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorC, colorM, colorY]}
      forceStatic={forceStatic}
      style={style}
    >
      <HalftoneCmyk
        colorBack={colorBack}
        colorC={colorC}
        colorK={colorK}
        colorM={colorM}
        colorY={colorY}
        contrast={contrast}
        floodC={floodC}
        floodK={floodK}
        floodM={floodM}
        floodY={floodY}
        gainC={gainC}
        gainK={gainK}
        gainM={gainM}
        gainY={gainY}
        grainMixer={grainMixer}
        grainOverlay={grainOverlay}
        grainSize={grainSize}
        gridNoise={gridNoise}
        scale={scale}
        size={size}
        softness={softness}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        type="ink"
      />
    </MaterialShell>
  );
}

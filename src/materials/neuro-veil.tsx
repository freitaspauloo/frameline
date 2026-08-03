"use client";

import { NeuroNoise } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type NeuroVeilProps = MaterialSurfaceProps & {
  colorFront?: string;
  colorMid?: string;
  colorBack?: string;
  brightness?: number;
  contrast?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

/**
 * Neural veil grain — cards, sections, loading shells.
 */
export function NeuroVeil({
  className,
  style,
  colorFront = "#E8F0FF",
  colorMid = "#2D6BFF",
  colorBack = "#0A0A0A",
  brightness = 0.08,
  contrast = 0.35,
  speed = 0.6,
  scale = 1,
  forceStatic = false,
}: NeuroVeilProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorMid, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <NeuroNoise
        brightness={brightness}
        colorBack={colorBack}
        colorFront={colorFront}
        colorMid={colorMid}
        contrast={contrast}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

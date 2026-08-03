"use client";

import { DotOrbit } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type OrbitDotsProps = MaterialSurfaceProps & {
  colorBack?: string;
  colors?: string[];
  size?: number;
  sizeRange?: number;
  spreading?: number;
  stepsPerColor?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#5B8CFF", "#E8F0FF"];

/**
 * Orbit dots dither — quiet orbiting dots for loading, empty, and card surfaces.
 */
export function OrbitDots({
  className,
  style,
  colorBack = "#F7F5F0",
  colors = DEFAULT_COLORS,
  size = 0.55,
  sizeRange = 0.25,
  spreading = 0.85,
  stepsPerColor = 3,
  speed = 0.45,
  scale = 0.7,
  forceStatic = false,
}: OrbitDotsProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <DotOrbit
        colorBack={colorBack}
        colors={colors}
        scale={scale}
        size={size}
        sizeRange={sizeRange}
        speed={speed}
        spreading={spreading}
        stepsPerColor={stepsPerColor}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

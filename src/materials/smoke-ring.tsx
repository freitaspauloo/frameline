"use client";

import { SmokeRing as SmokeRingShader } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type SmokeRingProps = MaterialSurfaceProps & {
  colors?: string[];
  colorBack?: string;
  noiseScale?: number;
  noiseIterations?: number;
  radius?: number;
  thickness?: number;
  innerShape?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#E8E4DC", "#2D6BFF", "#C8BBA8"];

/**
 * Smoke ring grain — sections, auth shells, and card surfaces.
 */
export function SmokeRing({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorBack = "#0A0A0A",
  noiseScale = 2.4,
  noiseIterations = 6,
  radius = 0.32,
  thickness = 0.55,
  innerShape = 0.75,
  speed = 0.45,
  scale = 0.9,
  forceStatic = false,
}: SmokeRingProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <SmokeRingShader
        colorBack={colorBack}
        colors={colors}
        innerShape={innerShape}
        noiseIterations={noiseIterations}
        noiseScale={noiseScale}
        radius={radius}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        thickness={thickness}
      />
    </MaterialShell>
  );
}

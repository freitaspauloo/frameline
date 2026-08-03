"use client";

import { GodRays } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type HaloRaysProps = MaterialSurfaceProps & {
  colors?: string[];
  colorBack?: string;
  colorBloom?: string;
  density?: number;
  spotty?: number;
  midIntensity?: number;
  midSize?: number;
  intensity?: number;
  bloom?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#5B8CFF", "#E8F0FF", "#1A3A8F"];

/**
 * Halo rays mesh — heroes and sectional light fields.
 */
export function HaloRays({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorBack = "#0A0A0A",
  colorBloom = "#2D6BFF",
  density = 0.35,
  spotty = 0.28,
  midIntensity = 0.45,
  midSize = 0.22,
  intensity = 0.75,
  bloom = 0.35,
  speed = 0.65,
  scale = 1,
  forceStatic = false,
}: HaloRaysProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <GodRays
        bloom={bloom}
        colorBack={colorBack}
        colorBloom={colorBloom}
        colors={colors}
        density={density}
        intensity={intensity}
        midIntensity={midIntensity}
        midSize={midSize}
        scale={scale}
        speed={speed}
        spotty={spotty}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

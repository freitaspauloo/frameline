"use client";

import { PerlinNoise } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type PerlinMossProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorFront?: string;
  proportion?: number;
  softness?: number;
  octaveCount?: number;
  persistence?: number;
  lacunarity?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

/**
 * Perlin moss grain — organic noise field for cards, sections, and auth.
 */
export function PerlinMoss({
  className,
  style,
  colorBack = "#1A2E1A",
  colorFront = "#7CB87C",
  proportion = 0.55,
  softness = 0.35,
  octaveCount = 4,
  persistence = 0.7,
  lacunarity = 2.2,
  speed = 0.15,
  scale = 1.4,
  forceStatic = false,
}: PerlinMossProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFront, "#C8BBA8"]}
      forceStatic={forceStatic}
      style={style}
    >
      <PerlinNoise
        colorBack={colorBack}
        colorFront={colorFront}
        lacunarity={lacunarity}
        octaveCount={octaveCount}
        persistence={persistence}
        proportion={proportion}
        scale={scale}
        softness={softness}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

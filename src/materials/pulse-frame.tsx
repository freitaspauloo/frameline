"use client";

import { PulsingBorder } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type PulseFrameProps = MaterialSurfaceProps & {
  colorBack?: string;
  colors?: string[];
  roundness?: number;
  thickness?: number;
  softness?: number;
  intensity?: number;
  bloom?: number;
  spots?: number;
  spotSize?: number;
  pulse?: number;
  smoke?: number;
  smokeSize?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#5B8CFF", "#AF52DE"];

/**
 * Pulse frame mesh — glowing border contour for heroes and cards.
 */
export function PulseFrame({
  className,
  style,
  colorBack = "#0A0A0A",
  colors = DEFAULT_COLORS,
  roundness = 0.2,
  thickness = 0.12,
  softness = 0.7,
  intensity = 0.25,
  bloom = 0.3,
  spots = 4,
  spotSize = 0.45,
  pulse = 0.3,
  smoke = 0.25,
  smokeSize = 0.55,
  speed = 0.7,
  scale = 0.75,
  forceStatic = false,
}: PulseFrameProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <PulsingBorder
        aspectRatio="auto"
        bloom={bloom}
        colorBack={colorBack}
        colors={colors}
        intensity={intensity}
        pulse={pulse}
        roundness={roundness}
        scale={scale}
        smoke={smoke}
        smokeSize={smokeSize}
        softness={softness}
        speed={speed}
        spotSize={spotSize}
        spots={spots}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        thickness={thickness}
      />
    </MaterialShell>
  );
}

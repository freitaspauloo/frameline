"use client";

import { StaticRadialGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type RadialStillProps = MaterialSurfaceProps & {
  colorBack?: string;
  colors?: string[];
  radius?: number;
  focalDistance?: number;
  focalAngle?: number;
  falloff?: number;
  mixing?: number;
  distortion?: number;
  distortionShift?: number;
  distortionFreq?: number;
  grainMixer?: number;
  grainOverlay?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#5B8CFF", "#E8F0FF"];

/**
 * Radial still mesh — static radial field for heroes, sections, and auth.
 */
export function RadialStill({
  className,
  style,
  colorBack = "#0A0A0A",
  colors = DEFAULT_COLORS,
  radius = 0.9,
  focalDistance = 0.65,
  focalAngle = 40,
  falloff = 0.2,
  mixing = 0.55,
  distortion = 0.15,
  distortionShift = 0.1,
  distortionFreq = 10,
  grainMixer = 0.06,
  grainOverlay = 0.1,
  scale = 1,
  forceStatic = false,
}: RadialStillProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <StaticRadialGradient
        colorBack={colorBack}
        colors={colors}
        distortion={distortion}
        distortionFreq={distortionFreq}
        distortionShift={distortionShift}
        falloff={falloff}
        focalAngle={focalAngle}
        focalDistance={focalDistance}
        grainMixer={grainMixer}
        grainOverlay={grainOverlay}
        mixing={mixing}
        radius={radius}
        scale={scale}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

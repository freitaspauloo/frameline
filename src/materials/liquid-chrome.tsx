"use client";

import { LiquidMetal } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type LiquidChromeProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorTint?: string;
  distortion?: number;
  repetition?: number;
  shiftRed?: number;
  shiftBlue?: number;
  contour?: number;
  softness?: number;
  angle?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

/**
 * Liquid chrome mesh — heroes and sectional metal fields.
 */
export function LiquidChrome({
  className,
  style,
  colorBack = "#1A1A1C",
  colorTint = "#2D6BFF",
  distortion = 0.12,
  repetition = 2.2,
  shiftRed = 0.25,
  shiftBlue = 0.35,
  contour = 0.35,
  softness = 0.15,
  angle = 70,
  speed = 0.8,
  scale = 0.85,
  forceStatic = false,
}: LiquidChromeProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorTint, "#C8C8CA"]}
      forceStatic={forceStatic}
      style={style}
    >
      <LiquidMetal
        angle={angle}
        colorBack={colorBack}
        colorTint={colorTint}
        contour={contour}
        distortion={distortion}
        repetition={repetition}
        scale={scale}
        shape="none"
        shiftBlue={shiftBlue}
        shiftRed={shiftRed}
        softness={softness}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}

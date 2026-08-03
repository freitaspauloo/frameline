"use client";

import { Swirl } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type InkSwirlProps = MaterialSurfaceProps & {
  colorBack?: string;
  colors?: string[];
  speed?: number;
  bandCount?: number;
  twist?: number;
  center?: number;
  softness?: number;
  noise?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#5B8CFF", "#1A3A8F"];

/**
 * Ink swirl dither — heroes and sectional brand moments.
 */
export function InkSwirl({
  className,
  style,
  colorBack = "#0A0A0A",
  colors = DEFAULT_COLORS,
  speed = 0.32,
  bandCount = 4,
  twist = 0.45,
  center = 0.2,
  softness = 0.2,
  noise = 0.15,
  forceStatic = false,
}: InkSwirlProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <Swirl
        bandCount={bandCount}
        center={center}
        colorBack={colorBack}
        colors={colors}
        noise={noise}
        softness={softness}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        twist={twist}
      />
    </MaterialShell>
  );
}

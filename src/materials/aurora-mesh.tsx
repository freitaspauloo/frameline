"use client";

import { MeshGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type AuroraMeshProps = MaterialSurfaceProps & {
  colors?: string[];
  speed?: number;
  distortion?: number;
  swirl?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#E3FFFE", "#C5F0FF", "#FF008D", "#B700FF"];

/**
 * Soft aurora mesh — hero / marketing surfaces.
 * Token tip: pass brand colors via `colors` from CSS variables resolved in the parent.
 */
export function AuroraMesh({
  className,
  style,
  colors = DEFAULT_COLORS,
  speed = 0.47,
  distortion = 0.8,
  swirl = 0.5,
  scale = 0.69,
  forceStatic = false,
}: AuroraMeshProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <MeshGradient
        colors={colors}
        distortion={distortion}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        swirl={swirl}
      />
    </MaterialShell>
  );
}

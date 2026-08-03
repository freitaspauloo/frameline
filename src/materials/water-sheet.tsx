"use client";

import { Water } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type WaterSheetProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorHighlight?: string;
  highlights?: number;
  layering?: number;
  edges?: number;
  waves?: number;
  caustic?: number;
  size?: number;
  scale?: number;
  speed?: number;
  forceStatic?: boolean;
};

/**
 * Water sheet mesh — heroes and sectional caustic bands.
 */
export function WaterSheet({
  className,
  style,
  colorBack = "#1A4A6B",
  colorHighlight = "#E8F4FF",
  highlights = 0.12,
  layering = 0.55,
  edges = 0.75,
  waves = 0.35,
  caustic = 0.18,
  size = 1.1,
  scale = 0.85,
  speed = 0.7,
  forceStatic = false,
}: WaterSheetProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorHighlight, "#2D6BFF"]}
      forceStatic={forceStatic}
      style={style}
    >
      <Water
        caustic={caustic}
        colorBack={colorBack}
        colorHighlight={colorHighlight}
        edges={edges}
        highlights={highlights}
        layering={layering}
        scale={scale}
        size={size}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        waves={waves}
      />
    </MaterialShell>
  );
}

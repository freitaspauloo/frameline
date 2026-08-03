"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type FogLayerProps = MaterialSurfaceProps & {
  colors?: string[];
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#E8E4DC", "#C8BBA8", "#F7F5F0", "#D4C4A8"];

/**
 * Layered soft CSS gradients for fog — CSS-only, no WebGL.
 */
export function FogLayer({
  className,
  style,
  colors = DEFAULT_COLORS,
  opacity = 0.95,
  speed = 0.4,
  forceStatic = false,
}: FogLayerProps) {
  const [a = "#E8E4DC", b = "#C8BBA8", c = "#F7F5F0", d = "#D4C4A8"] = colors;
  const duration = Math.max(0.01, 16 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[a, b, c, d]}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundImage: [
            `radial-gradient(ellipse 80% 60% at 20% 40%, ${a} 0%, transparent 70%)`,
            `radial-gradient(ellipse 70% 50% at 80% 60%, ${b} 0%, transparent 65%)`,
            `radial-gradient(ellipse 90% 70% at 50% 80%, ${c} 0%, transparent 60%)`,
            `linear-gradient(180deg, ${d}33, ${a}88)`,
          ].join(", "),
          backgroundSize: "160% 160%, 160% 160%, 160% 160%, 100% 100%",
          animation: `fl-fog-layer ${duration}s ease-in-out infinite`,
        }}
      />
    </MaterialShell>
  );
}

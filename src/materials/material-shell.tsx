"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useHasMounted, usePrefersReducedMotion } from "./hooks";

type MaterialShellProps = {
  className?: string;
  style?: CSSProperties;
  fallbackColors: string[];
  children: ReactNode;
  /** Force static fallback (e.g. export preview). */
  forceStatic?: boolean;
};

/**
 * Client-only shell: waits for mount (avoids WebGL hydration issues),
 * respects prefers-reduced-motion with a CSS gradient fallback.
 */
export function MaterialShell({
  className,
  style,
  fallbackColors,
  children,
  forceStatic = false,
}: MaterialShellProps) {
  const mounted = useHasMounted();
  const reducedMotion = usePrefersReducedMotion();
  const showStatic = forceStatic || !mounted || reducedMotion;

  const fallback = {
    backgroundImage: `linear-gradient(135deg, ${fallbackColors.join(", ")})`,
  } as const;

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={style}
    >
      {showStatic ? (
        <div aria-hidden className="absolute inset-0" style={fallback} />
      ) : (
        children
      )}
    </div>
  );
}

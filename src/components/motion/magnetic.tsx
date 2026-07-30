"use client";

import * as React from "react";
import gsap from "gsap";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Cursor magnetism for primary CTAs. The pull starts outside the hit area and
 * falls off with distance, so the control leans toward the pointer before hover.
 */
export function Magnetic({
  children,
  className,
  reach = 96,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  /** Extra pixels beyond the element edge where the pull begins. */
  reach?: number;
  strength?: number;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const el = rootRef.current;
    if (reduced || !el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const radius = Math.max(rect.width, rect.height) / 2 + reach;
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        xTo(0);
        yTo(0);
        return;
      }

      const falloff = 1 - distance / radius;
      xTo(dx * strength * falloff);
      yTo(dy * strength * falloff);
    };

    const onLeaveWindow = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reach, reduced, strength]);

  return (
    <div
      ref={rootRef}
      className={cn("inline-flex will-change-transform", className)}
    >
      {children}
    </div>
  );
}

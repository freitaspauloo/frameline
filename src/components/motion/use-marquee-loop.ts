"use client";

import type * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";

gsap.registerPlugin(useGSAP);

/**
 * Seamless horizontal drift for a track that renders its children twice.
 *
 * One loop travels exactly half the track, so the second copy lands where the
 * first started and the seam is invisible. Speed is expressed in px/second so
 * strips of different widths read at the same pace. Returns the reduced-motion
 * flag so callers can render a static, manually scrollable row instead.
 */
export function useMarqueeLoop({
  hostRef,
  hoverTimeScale = 0,
  speed = 44,
  trackRef,
}: {
  hostRef: React.RefObject<HTMLElement | null>;
  /** timeScale while the pointer rests over the host — 0 parks the row. */
  hoverTimeScale?: number;
  /** Pixels travelled per second. */
  speed?: number;
  trackRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const host = hostRef.current;
      const track = trackRef.current;
      if (reduced || !host || !track) return;

      let tween: gsap.core.Tween | null = null;

      const build = () => {
        tween?.kill();
        gsap.set(track, { x: 0 });

        const half = track.getBoundingClientRect().width / 2;
        if (half < 1) return;

        tween = gsap.to(track, {
          x: -half,
          duration: half / speed,
          ease: "none",
          repeat: -1,
        });
      };

      build();

      /* Re-measure when the host reflows (resize, font swap, zoom). */
      const resize = new ResizeObserver(() => build());
      resize.observe(host);

      const ease = (value: number) => {
        if (!tween) return;
        gsap.to(tween, { timeScale: value, duration: 0.45, overwrite: true });
      };
      const onEnter = () => ease(hoverTimeScale);
      const onLeave = () => ease(1);

      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);

      return () => {
        resize.disconnect();
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
        tween?.kill();
      };
    },
    { dependencies: [hoverTimeScale, reduced, speed] },
  );

  return reduced;
}

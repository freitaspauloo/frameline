"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ACCENT = "#3A58F0";

/**
 * A hairline that inks itself in left-to-right as its section arrives, then
 * dries off and hands the edge back to the static border underneath.
 * Must sit inside a `relative` container, flush with that border.
 */
export function InkRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 -top-px z-20 h-px origin-left",
        className,
      )}
      data-ink-rule
      style={{ backgroundColor: ACCENT }}
    />
  );
}

/**
 * Page-level reveal controller.
 *
 * Batches every `[data-reveal]` element so items that cross the line together
 * (grid cells, header stacks) stagger as one group, and drives the ink-draw
 * pass over `[data-ink-rule]`. One setup for the whole document — no per-node
 * observers, no React state.
 */
export function FramelineReveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const scope = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (reduced || !root) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      if (items.length > 0) {
        gsap.set(items, { opacity: 0, y: 18 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.055,
              overwrite: true,
            });
          },
        });
      }

      const rules = gsap.utils.toArray<HTMLElement>("[data-ink-rule]", root);
      if (rules.length > 0) {
        gsap.set(rules, { scaleX: 0, opacity: 1, transformOrigin: "left" });
        ScrollTrigger.batch(rules, {
          start: "top 95%",
          once: true,
          onEnter: (batch) => {
            gsap
              .timeline()
              .to(batch, {
                scaleX: 1,
                duration: 0.95,
                ease: "power2.out",
                stagger: 0.07,
              })
              .to(
                batch,
                {
                  opacity: 0,
                  duration: 0.55,
                  ease: "power1.out",
                  stagger: 0.07,
                },
                "-=0.3",
              );
          },
        });
      }
    },
    { dependencies: [reduced], scope },
  );

  return (
    <div ref={scope} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/** Staggered on-load entrance for `[data-intro-step]` children. */
export function IntroStagger({
  children,
  delay = 0.5,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const scope = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (reduced || !root) return;

      const steps = gsap.utils.toArray<HTMLElement>("[data-intro-step]", root);
      if (steps.length === 0) return;

      gsap.fromTo(
        steps,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          delay,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.11,
        },
      );
    },
    { dependencies: [delay, reduced], scope },
  );

  return (
    <div ref={scope} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

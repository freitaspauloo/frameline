"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** `document.body` only exists once we are past the server render. */
const noopSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Accent ink that fills both content rails as the page is read, with
 * rail-cross markers riding the leading edge.
 *
 * Portalled to the body: the shell paints its rails in a layer above the
 * content stacking context, so ink rendered inline would sit underneath them.
 */
export function RailProgress({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const scope = React.useRef<HTMLDivElement>(null);
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    onClient,
    onServer,
  );

  useGSAP(
    () => {
      const root = scope.current;
      if (reduced || !root) return;

      const lines = gsap.utils.toArray<HTMLElement>("[data-rail-line]", root);
      const marks = gsap.utils.toArray<HTMLElement>("[data-rail-mark]", root);
      if (lines.length === 0) return;

      gsap.set(lines, { scaleY: 0, transformOrigin: "top" });
      const setScale = gsap.quickSetter(lines, "scaleY");
      const setTop = gsap.quickSetter(marks, "top", "%");

      const live = { p: 0 };
      gsap.to(live, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
        onUpdate: () => {
          setScale(live.p);
          setTop(live.p * 100);
        },
      });
    },
    { dependencies: [mounted, reduced], scope },
  );

  if (reduced || !mounted) return null;

  return createPortal(
    <div
      ref={scope}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-7xl -translate-x-1/2",
        className,
      )}
    >
      <span
        className="absolute inset-y-0 left-0 w-px origin-top bg-[#3A58F0]/75"
        data-rail-line
        style={{ transform: "scaleY(0)" }}
      />
      <span
        className="absolute inset-y-0 right-0 w-px origin-top bg-[#3A58F0]/75"
        data-rail-line
        style={{ transform: "scaleY(0)" }}
      />
      <span
        className="absolute left-0 size-[5px] -translate-x-1/2 -translate-y-1/2 bg-[#3A58F0]"
        data-rail-mark
        style={{ top: 0 }}
      />
      <span
        className="absolute right-0 size-[5px] translate-x-1/2 -translate-y-1/2 bg-[#3A58F0]"
        data-rail-mark
        style={{ top: 0 }}
      />
    </div>,
    document.body,
  );
}

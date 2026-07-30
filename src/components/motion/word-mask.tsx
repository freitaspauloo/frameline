"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Display type that sets itself: each word rides up from behind its own
 * baseline mask. Renders as plain text without JS or under reduced motion.
 */
export function WordMask({
  className,
  delay = 0.2,
  onView = false,
  text,
}: {
  className?: string;
  delay?: number;
  /** Wait for the line to scroll into view instead of playing on load. */
  onView?: boolean;
  text: string;
}) {
  const reduced = useReducedMotion();
  const scope = React.useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const root = scope.current;
      if (reduced || !root) return;

      const parts = gsap.utils.toArray<HTMLElement>("[data-word]", root);
      if (parts.length === 0) return;

      gsap.fromTo(
        parts,
        { yPercent: 118 },
        {
          yPercent: 0,
          delay: onView ? 0 : delay,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.075,
          scrollTrigger: onView
            ? { trigger: root, start: "top 85%", once: true }
            : undefined,
        },
      );
    },
    { dependencies: [delay, onView, reduced], scope },
  );

  return (
    <span ref={scope} className={cn("inline", className)}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          {/* Padding keeps ascenders and descenders clear of the mask edge. */}
          <span className="inline-block -mt-[0.12em] -mb-[0.18em] overflow-hidden pt-[0.12em] pb-[0.18em] align-bottom">
            <span className="inline-block will-change-transform" data-word>
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

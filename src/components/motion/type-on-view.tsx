"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Monospace string that types itself out the first time it is scrolled into view. */
export function TypeOnView({
  caretClassName,
  charsPerSecond = 38,
  className,
  text,
}: {
  caretClassName?: string;
  charsPerSecond?: number;
  className?: string;
  text: string;
}) {
  const reduced = useReducedMotion();
  const textRef = React.useRef<HTMLSpanElement>(null);
  const caretRef = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      const caret = caretRef.current;
      if (reduced || !el) return;

      el.textContent = "";
      if (caret) gsap.set(caret, { opacity: 0 });

      const live = { i: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const blink = caret
            ? gsap.to(caret, {
                opacity: 0.1,
                duration: 0.45,
                ease: "none",
                repeat: -1,
                yoyo: true,
              })
            : null;
          if (caret) gsap.set(caret, { opacity: 1 });

          gsap.to(live, {
            i: text.length,
            duration: text.length / charsPerSecond,
            ease: "none",
            onUpdate: () => {
              el.textContent = text.slice(0, Math.round(live.i));
            },
            onComplete: () => {
              el.textContent = text;
              blink?.kill();
              if (caret) {
                gsap.to(caret, { opacity: 0.35, duration: 0.3 });
              }
            },
          });
        },
      });
    },
    { dependencies: [charsPerSecond, reduced, text] },
  );

  return (
    <span className={cn("inline", className)}>
      <span ref={textRef}>{text}</span>
      <span
        ref={caretRef}
        aria-hidden
        className={cn(
          "ml-[0.15em] inline-block h-[1.05em] w-[0.5ch] translate-y-[0.15em] bg-current opacity-35",
          caretClassName,
        )}
      />
    </span>
  );
}

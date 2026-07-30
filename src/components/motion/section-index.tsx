"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { framelineScrollTo } from "@/components/motion/frameline-lenis";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type SectionIndexEntry = { id: string; label: string };

/** Ladder height in px — the whole document compressed into one column. */
const LADDER = 232;

/**
 * Ledger index — the signature.
 *
 * Every section becomes a hairline tick placed at its *true* position in the
 * document, so the column is a scale drawing of the page rather than an evenly
 * spaced dot nav: long sections get wide gaps, short ones cluster. An accent
 * needle rides the ticks against real scroll progress, the current tick
 * extends and names itself, and any tick can be clicked to travel there.
 *
 * All of it is written straight to the DOM from one scrubbed GSAP tween.
 */
export function SectionIndex({
  className,
  sections,
}: {
  className?: string;
  sections: readonly SectionIndexEntry[];
}) {
  const reduced = useReducedMotion();
  const scope = React.useRef<HTMLElement>(null);
  const ladderRef = React.useRef<HTMLDivElement>(null);
  const needleRef = React.useRef<HTMLSpanElement>(null);
  const counterRef = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const ladder = ladderRef.current;
      const needle = needleRef.current;
      if (!ladder || !needle) return;

      const ticks = gsap.utils.toArray<HTMLElement>("[data-ledger-tick]", ladder);
      if (ticks.length === 0) return;

      let anchors: number[] = [];
      let active = -1;

      const measure = () => {
        const max = ScrollTrigger.maxScroll(window) || 1;
        anchors = ticks.map((tick) => {
          const id = tick.dataset.target;
          const section = id ? document.getElementById(id) : null;
          if (!section) return 0;
          const top = section.getBoundingClientRect().top + window.scrollY;
          return gsap.utils.clamp(0, 1, top / max);
        });
        ticks.forEach((tick, i) => {
          tick.style.top = `${anchors[i] * LADDER}px`;
        });
      };

      const paint = (progress: number) => {
        needle.style.transform = `translateY(${progress * LADDER}px)`;

        let next = 0;
        for (let i = 0; i < anchors.length; i += 1) {
          if (progress >= anchors[i] - 0.002) next = i;
        }
        if (next === active) return;
        active = next;

        ticks.forEach((tick, i) => {
          tick.dataset.active = i === next ? "true" : "false";
        });

        const counter = counterRef.current;
        if (!counter) return;
        counter.textContent = String(next + 1).padStart(2, "0");
        if (!reduced) {
          gsap.fromTo(
            counter,
            { y: 5, opacity: 0.3 },
            { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" },
          );
        }
      };

      measure();

      const live = { p: 0 };
      gsap.to(live, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 0.4,
          onRefresh: measure,
        },
        onUpdate: () => paint(live.p),
      });

      paint(0);
    },
    { dependencies: [reduced, sections], scope },
  );

  return (
    <nav
      ref={scope}
      aria-label="Section index"
      className={cn(
        /* Parked below the navbar and pushed into the outer gutter so ticks and
           labels never cross the content rail. Desktop-only by design. */
        "group fixed top-28 right-[max(1.25rem,calc((100vw-80rem)/2-5.5rem))] z-40 hidden xl:block",
        className,
      )}
    >
      <div ref={ladderRef} className="relative" style={{ height: LADDER }}>
        <span
          ref={needleRef}
          aria-hidden
          className="absolute top-0 right-0 block h-px w-7 bg-[#3A58F0]"
        />

        {sections.map((section) => (
          <button
            key={section.id}
            className="group/tick absolute right-0 flex -translate-y-1/2 cursor-pointer items-center gap-2.5 outline-none"
            data-ledger-tick
            data-target={section.id}
            onClick={() => framelineScrollTo(`#${section.id}`)}
            type="button"
          >
            <span className="font-mono text-[10px] tracking-widest whitespace-nowrap text-muted-foreground uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-55 group-focus-visible/tick:opacity-100 group-data-[active=true]/tick:text-foreground group-data-[active=true]/tick:opacity-100">
              {section.label}
            </span>
            <span className="block h-px w-2.5 bg-border transition-all duration-300 ease-[var(--ease-emil)] group-hover/tick:w-5 group-hover/tick:bg-foreground group-data-[active=true]/tick:w-5 group-data-[active=true]/tick:bg-foreground" />
          </button>
        ))}
      </div>

      <p
        aria-hidden
        className="mt-5 text-right font-mono text-[10px] tracking-widest text-muted-foreground tabular-nums"
      >
        <span ref={counterRef} className="inline-block text-foreground">
          01
        </span>
        <span className="text-border"> / </span>
        {String(sections.length).padStart(2, "0")}
      </p>
    </nav>
  );
}

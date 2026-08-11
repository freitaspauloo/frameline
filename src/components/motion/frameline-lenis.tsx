"use client";

import * as React from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/** Navbar height — anchored sections stop just below it. */
const ANCHOR_OFFSET = -64;

let activeLenis: Lenis | null = null;

/** Scroll through Lenis when it is running, natively otherwise. */
export function framelineScrollTo(target: string | HTMLElement) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { duration: 1.15, offset: ANCHOR_OFFSET });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ block: "start" });
}

/**
 * Smooth scroll + ScrollTrigger sync for Frameline marketing pages.
 * Skips Lenis entirely when reduced-motion is on.
 */
export function FramelineLenis({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;

    const html = document.documentElement;
    /* globals.css sets `scroll-behavior: smooth`, which fights Lenis. */
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      autoRaf: false,
      allowNestedScroll: true,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });
    activeLenis = lenis;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    /* Route in-page anchors through Lenis so CTAs glide instead of jumping. */
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const section = document.querySelector(hash);
      if (!(section instanceof HTMLElement)) return;

      event.preventDefault();
      lenis.scrollTo(section, { duration: 1.15, offset: ANCHOR_OFFSET });
    };
    document.addEventListener("click", onClick);

    /* Measure after children have laid out their own triggers. */
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(ticker);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.refresh();
      lenis.destroy();
      activeLenis = null;
      html.style.scrollBehavior = previousBehavior;
    };
  }, [reduced]);

  return children;
}

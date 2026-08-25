"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Inter } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ReticleMark } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";
import { cn } from "@/lib/utils";

import { DitherField } from "./dither-field";
import { BRIDGE_SRC, HEADLINE_LINES, NAV_LINKS } from "./constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const PROGRESSIVE_WHITE_STEPS = [
  { alpha: 0.72, from: "0%", to: "38%" },
  { alpha: 0.45, from: "8%", to: "52%" },
  { alpha: 0.28, from: "20%", to: "68%" },
  { alpha: 0.14, from: "36%", to: "84%" },
  { alpha: 0.06, from: "55%", to: "100%" },
] as const;

function ProgressiveBlurEdge({
  edge,
  className,
}: {
  edge: "top" | "bottom";
  className?: string;
}) {
  const dir = edge === "top" ? "to bottom" : "to top";

  return (
    <div
      className={cn(
        "oasis-edge pointer-events-none absolute inset-x-0 z-0 w-full",
        edge === "top" ? "top-0" : "bottom-0",
        className,
      )}
      aria-hidden
    >
      {PROGRESSIVE_WHITE_STEPS.map((step) => (
        <div
          key={`${edge}-${step.alpha}`}
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(255,255,255,${step.alpha})`,
            maskImage: `linear-gradient(${dir}, black ${step.from}, transparent ${step.to})`,
            WebkitMaskImage: `linear-gradient(${dir}, black ${step.from}, transparent ${step.to})`,
          }}
        />
      ))}
    </div>
  );
}

export type BridgeDitherProps = {
  className?: string;
  embed?: boolean;
};

/** Bridge Dither — warm dither art hero with progressive blur edges and GSAP entrance. */
export function BridgeDither({ className, embed = false }: BridgeDitherProps) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [artReady, setArtReady] = useState(false);

  const handleArtReady = useCallback(() => {
    setArtReady(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      setArtReady(true);
      return;
    }
    const fallback = window.setTimeout(() => setArtReady(true), 900);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !artReady) return;

      if (reduced) {
        gsap.set(
          [
            ".oasis-dither",
            ".oasis-edge",
            ".oasis-brand",
            ".oasis-brand-mark",
            ".oasis-nav-link",
            ".oasis-header-cta",
            ".oasis-headline-word-inner",
          ],
          { autoAlpha: 1, y: 0, yPercent: 0, scale: 1, rotation: 0, clearProps: "transform" },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(".oasis-dither", { scale: 1.07, autoAlpha: 0, transformOrigin: "50% 85%" });
        gsap.set(".oasis-edge", { autoAlpha: 0 });
        gsap.set(".oasis-brand", { autoAlpha: 0, y: -14 });
        gsap.set(".oasis-brand-mark", { scale: 0.5, rotation: -120, transformOrigin: "center center" });
        gsap.set(".oasis-nav-link", { autoAlpha: 0, y: -10 });
        gsap.set(".oasis-header-cta", { autoAlpha: 0, y: -10, scale: 0.92 });
        gsap.set(".oasis-headline-word-inner", { yPercent: 115, autoAlpha: 0 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(".oasis-dither", { scale: 1, autoAlpha: 1, duration: 1.35, ease: "power2.out" }, 0.1)
          .to(".oasis-edge", { autoAlpha: 1, duration: 0.85, stagger: 0.07 }, 0.15)
          .to(".oasis-brand-mark", { scale: 1, rotation: 0, duration: 0.75, ease: "back.out(2)" }, 0.2)
          .to(".oasis-brand", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.28)
          .to(".oasis-nav-link", { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.055 }, 0.34)
          .to(
            ".oasis-header-cta",
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" },
            0.48,
          )
          .to(
            ".oasis-headline-word-inner",
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.72,
              stagger: 0.055,
              ease: "power4.out",
            },
            0.38,
          );
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [artReady, reduced] },
  );

  return (
    <ScreenStage embed={embed} background="#ffffff" className={className}>
      <section
        ref={scope}
        className={cn(
          inter.className,
          "relative h-full w-full overflow-hidden bg-white text-zinc-950 antialiased",
        )}
      >
        <div className="oasis-dither absolute inset-0 z-0">
          <DitherField
            src={BRIDGE_SRC}
            cellSize={3}
            disturbRadius={40}
            className="z-0"
            onReady={handleArtReady}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col">
          <ProgressiveBlurEdge
            edge="top"
            className="h-[min(68vh,34rem)] sm:h-[min(62vh,36rem)] lg:h-[min(58vh,40rem)]"
          />
          <ProgressiveBlurEdge
            edge="bottom"
            className="h-[min(16vh,7rem)] sm:h-[min(14vh,6rem)] lg:h-[min(12vh,5.5rem)]"
          />

          <header className="pointer-events-auto relative z-20">
            <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6">
              <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-8">
                <a
                  href="#top"
                  className="oasis-brand inline-flex shrink-0 items-center gap-2 sm:gap-2.5"
                >
                  <ReticleMark className="oasis-brand-mark size-4 sm:size-[18px]" color="#18181b" />
                  <span className="text-[14px] font-semibold tracking-[-0.02em] text-zinc-950 sm:text-[15px]">
                    Reticle
                  </span>
                </a>

                <nav className="hidden items-center gap-5 md:flex lg:gap-6" aria-label="Primary">
                  {NAV_LINKS.map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase()}`}
                      className="oasis-nav-link text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 lg:text-[13px]"
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </div>

              <a
                href="#request"
                className="oasis-header-cta inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 px-3.5 text-[12px] font-medium text-white transition-colors hover:bg-zinc-800 sm:h-9 sm:px-4 sm:text-[13px]"
              >
                Request Info
              </a>
            </div>
          </header>

          <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-6 lg:px-10 lg:pb-10 lg:pt-8">
            <h1
              className={cn(
                GeistPixelSquare.className,
                "oasis-headline relative z-10 max-w-[22ch] text-[clamp(2rem,7.5vw,5.5rem)] leading-[1.12] tracking-[-0.04em] text-zinc-950 sm:max-w-[24ch] sm:leading-[1.15] sm:tracking-[-0.05em] lg:max-w-[26ch] lg:text-[88px] lg:tracking-[-6px]",
              )}
            >
              {HEADLINE_LINES.map((line, lineIndex) => {
                const words = line.split(" ");
                return (
                  <span key={line} className="block">
                    {words.map((word, index) => (
                      <span
                        key={`${lineIndex}-${word}-${index}`}
                        className="oasis-headline-word inline-block overflow-hidden align-top"
                      >
                        <span className="oasis-headline-word-inner inline-block">
                          {word}
                          {index < words.length - 1 ? "\u00A0" : ""}
                        </span>
                      </span>
                    ))}
                  </span>
                );
              })}
            </h1>
        </div>
      </div>
      </section>
    </ScreenStage>
  );
}

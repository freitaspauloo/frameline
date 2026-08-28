"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { useRef } from "react";
import type { CSSProperties } from "react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

import "./health-ai-skeleton.css";

const CANVAS = "#eef6fc";

function Bone({
  className = "",
  delay = 0,
  lime = false,
  block = false,
}: {
  className?: string;
  delay?: number;
  lime?: boolean;
  block?: boolean;
}) {
  return (
    <div
      className={cn(
        "ha-skel-bone",
        lime && "ha-skel-bone--lime",
        block && "ha-skel-bone--block",
        className,
      )}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export type HealthAiSkeletonProps = {
  className?: string;
  embed?: boolean;
  fillViewport?: boolean;
};

/** Loading skeleton for the Pulse hero — mirrors nav, image card, and bottom lockup. */
export function HealthAiSkeleton({
  className,
  embed = false,
  fillViewport = false,
}: HealthAiSkeletonProps) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (reduced) {
        gsap.set(
          [
            ".ha-skel-brand",
            ".ha-skel-nav-right",
            ".ha-skel-link",
            ".ha-skel-nav-action",
            ".ha-skel-hero",
            ".ha-skel-headline .ha-skel-bone",
            ".ha-skel-copy .ha-skel-bone",
            ".ha-skel-cta",
          ],
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            clipPath: "inset(0 0% 0 0)",
            filter: "blur(0px)",
            clearProps: "transform,filter,clipPath",
          },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(".ha-skel-brand", { autoAlpha: 0, x: -18, filter: "blur(6px)" });
        gsap.set(".ha-skel-nav-right", { autoAlpha: 0, x: 22, filter: "blur(4px)" });
        gsap.set(".ha-skel-link", { autoAlpha: 0, y: 8 });
        gsap.set(".ha-skel-nav-action", { autoAlpha: 0, scale: 0.9, y: 6 });
        gsap.set(".ha-skel-hero", { scale: 0.99, transformOrigin: "50% 62%" });
        gsap.set(".ha-skel-hero-frame", { clipPath: "inset(0 100% 0 0 round 20px)" });
        gsap.set(".ha-skel-headline .ha-skel-bone", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".ha-skel-headline .ha-skel-bone", { y: 12 });
        gsap.set(".ha-skel-body-block", { autoAlpha: 0, y: 18, filter: "blur(6px)" });
        gsap.set(".ha-skel-copy .ha-skel-bone", { autoAlpha: 0, y: 10 });
        gsap.set(".ha-skel-cta", { autoAlpha: 0, y: 12, scale: 0.94 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(".ha-skel-hero", { scale: 1, duration: 1.1, ease: "expo.out" }, 0)
          .to(
            ".ha-skel-hero-frame",
            { clipPath: "inset(0 0% 0 0 round 20px)", duration: 0.95, ease: "power4.inOut" },
            0.04,
          )
          .to(".ha-skel-brand", { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.72 }, 0.08)
          .to(
            ".ha-skel-nav-right",
            { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.78, ease: "expo.out" },
            0.12,
          )
          .to(
            ".ha-skel-link",
            { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.055, ease: "back.out(1.35)" },
            0.2,
          )
          .to(
            ".ha-skel-nav-action",
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "back.out(1.5)" },
            0.28,
          )
          .to(
            ".ha-skel-headline .ha-skel-bone",
            { clipPath: "inset(0 0% 0 0)", duration: 0.82, stagger: 0.1, ease: "power4.inOut" },
            0.16,
          )
          .to(
            ".ha-skel-headline .ha-skel-bone",
            { y: 0, duration: 0.88, stagger: 0.1, ease: "expo.out" },
            0.16,
          )
          .to(".ha-skel-body-block", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.65 }, 0.38)
          .to(
            ".ha-skel-copy .ha-skel-bone",
            { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.06, ease: "power2.out" },
            0.44,
          )
          .to(
            ".ha-skel-cta",
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, ease: "back.out(1.55)" },
            0.66,
          )
          .eventCallback("onComplete", () => {
            gsap.set(".ha-skel-hero-frame", { clearProps: "clipPath" });
            gsap.set(".ha-skel-headline .ha-skel-bone", { clearProps: "transform,clipPath" });
          });
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [reduced] },
  );

  const page = (
    <section
      ref={scope}
      className={cn(
        "fl-health-ai-skeleton",
        GeistMono.className,
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden uppercase antialiased",
        className,
      )}
      aria-busy="true"
      aria-label="Loading Pulse hero"
    >
      <div className="ha-skel-root">
        <div className="ha-skel-shell">
          <header className="ha-skel-nav">
            <div className="ha-skel-brand">
              <Bone className="bone-brand" delay={0} block />
            </div>

            <div className="ha-skel-nav-right">
              <div className="ha-skel-links">
                <div className="ha-skel-link">
                  <Bone className="bone-nav-link bone-nav-link--wide" delay={60} block />
                  <Bone className="bone-badge" delay={90} />
                </div>
                <div className="ha-skel-link">
                  <Bone className="bone-nav-link" delay={120} block />
                </div>
                <div className="ha-skel-link">
                  <Bone className="bone-nav-link" delay={150} block />
                </div>
                <div className="ha-skel-link">
                  <Bone className="bone-nav-link bone-nav-link--wide" delay={180} block />
                </div>
              </div>

              <div className="ha-skel-nav-action">
                <Bone className="bone-account" delay={140} />
              </div>
              <div className="ha-skel-nav-action">
                <Bone className="bone-join" delay={180} lime />
              </div>
            </div>
          </header>

          <div className="ha-skel-hero">
            <div className="ha-skel-hero-frame h-full w-full">
              <div className="ha-skel-hero-plate" aria-hidden />
            </div>
          </div>

          <div className="ha-skel-lockup">
            <div
              className={cn(
                GeistSans.className,
                "ha-skel-headline min-w-0 w-full font-light normal-case",
              )}
            >
              <Bone className="bone-headline-1 ha-skel-bone" delay={100} block />
              <Bone className="bone-headline-2 ha-skel-bone" delay={130} block />
            </div>

            <div className="ha-skel-body ha-skel-body-block">
              <div className="ha-skel-copy">
                <Bone className="bone-copy bone-copy-1" delay={160} />
                <Bone className="bone-copy bone-copy-2" delay={190} />
                <Bone className="bone-copy bone-copy-3" delay={220} />
                <Bone className="bone-copy bone-copy-4" delay={250} />
              </div>
              <div className="ha-skel-cta">
                <Bone className="bone-cta" delay={280} lime />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (fillViewport) {
    return (
      <div className="h-dvh w-full overflow-hidden" style={{ background: CANVAS }}>
        {page}
      </div>
    );
  }

  return (
    <ScreenStage embed={embed} background={CANVAS} className={className}>
      {page}
    </ScreenStage>
  );
}

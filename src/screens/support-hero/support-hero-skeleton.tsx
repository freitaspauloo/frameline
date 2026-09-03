"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

import {
  addSupportTintEntranceToTimeline,
  createSupportTintLoop,
  initSupportTintEntrance,
  querySupportTints,
  setSupportTintsStatic,
} from "./tint-motion";
import "./support-hero-skeleton.css";

function Bone({
  className = "",
  delay = 0,
  accent = false,
  block = false,
}: {
  className?: string;
  delay?: number;
  accent?: boolean;
  block?: boolean;
}) {
  return (
    <div
      className={cn(
        "bone sh-skel-bone",
        accent && "sh-skel-bone--accent",
        block && "sh-skel-bone--block",
        className,
      )}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export function SupportHeroSkeleton({ className }: { className?: string }) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (reduced) {
        gsap.set(
          [
            ".sh-skel-bg-art",
            "[data-sh-tint-pink]",
            "[data-sh-tint-cyan]",
            "[data-sh-tint-lime]",
            ".sh-skel-bg-blur",
            ".sh-skel-bg-fade",
            ".sh-skel-nav",
            ".sh-skel-brand",
            ".sh-skel-nav-link",
            ".sh-skel-nav-cta",
            ".sh-skel-badge",
            ".sh-skel-headline .sh-skel-bone",
            ".sh-skel-copy .sh-skel-bone",
            ".sh-skel-action",
            ".sh-skel-dash",
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
        const tints = querySupportTints(root);
        if (tints) setSupportTintsStatic(tints);
        setReady(true);
        return;
      }

      const ctx = gsap.context((context) => {
        const tints = querySupportTints(root);

        gsap.set(".sh-skel-bg-art", { autoAlpha: 0, scale: 1.06 });
        if (tints) initSupportTintEntrance(tints);
        gsap.set([".sh-skel-bg-blur", ".sh-skel-bg-fade"], { autoAlpha: 0 });
        gsap.set(".sh-skel-nav", { autoAlpha: 0, y: -16, filter: "blur(6px)" });
        gsap.set(".sh-skel-brand", { autoAlpha: 0, x: -12 });
        gsap.set(".sh-skel-nav-link", { autoAlpha: 0, y: 8 });
        gsap.set(".sh-skel-nav-cta", { autoAlpha: 0, scale: 0.92, y: 6 });
        gsap.set(".sh-skel-badge", { autoAlpha: 0, y: 16, filter: "blur(4px)" });
        gsap.set(".sh-skel-headline .sh-skel-bone", { clipPath: "inset(0 100% 0 0)", y: 20 });
        gsap.set(".sh-skel-copy .sh-skel-bone", { autoAlpha: 0, y: 10 });
        gsap.set(".sh-skel-action", { autoAlpha: 0, y: 14, scale: 0.96 });
        gsap.set(".sh-skel-dash", {
          autoAlpha: 0,
          y: 48,
          scale: 0.97,
          clipPath: "inset(18% 0 100% 0 round 15px)",
        });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(".sh-skel-bg-art", { autoAlpha: 1, scale: 1, duration: 1.25, ease: "expo.out" }, 0);
        if (tints) addSupportTintEntranceToTimeline(tl, tints, 0.06);
        tl.to([".sh-skel-bg-blur", ".sh-skel-bg-fade"], { autoAlpha: 1, duration: 0.85, stagger: 0.07 }, 0.1)
          .to(".sh-skel-nav", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.82 }, 0.08)
          .to(".sh-skel-brand", { autoAlpha: 1, x: 0, duration: 0.62 }, 0.16)
          .to(
            ".sh-skel-nav-link",
            { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.05, ease: "back.out(1.35)" },
            0.22,
          )
          .to(
            ".sh-skel-nav-cta",
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.55)" },
            0.34,
          )
          .to(".sh-skel-badge", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.72 }, 0.3)
          .to(
            ".sh-skel-headline .sh-skel-bone",
            { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.05, ease: "power4.inOut" },
            0.34,
          )
          .to(
            ".sh-skel-copy .sh-skel-bone",
            { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.06, ease: "power2.out" },
            0.44,
          )
          .to(
            ".sh-skel-action",
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, stagger: 0.08, ease: "back.out(1.45)" },
            0.52,
          )
          .to(
            ".sh-skel-dash",
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0 0% 0 round 15px)",
              duration: 1.1,
              ease: "power4.inOut",
            },
            0.58,
          )
          .eventCallback("onComplete", () => {
            gsap.set([".sh-skel-headline .sh-skel-bone", ".sh-skel-dash"], { clearProps: "clipPath" });
            if (tints) context.add(() => createSupportTintLoop(tints));
            setReady(true);
          });
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      ref={scope}
      className={cn(
        "fl-support-skeleton relative min-h-dvh w-full overflow-hidden bg-black",
        ready && "sh-skel-ready",
        GeistSans.className,
        className,
      )}
      aria-busy="true"
      aria-label="Loading hero"
    >
      <div className="sh-skel-root min-h-dvh">
        <div className="sh-skel-bg" aria-hidden>
          <div className="sh-skel-bg-art" />
          <div
            data-sh-tint-pink
            className="sh-skel-bg-tint sh-skel-bg-tint-pink absolute inset-0"
          />
          <div
            data-sh-tint-cyan
            className="sh-skel-bg-tint sh-skel-bg-tint-cyan absolute inset-0"
          />
          <div
            data-sh-tint-lime
            className="sh-skel-bg-tint sh-skel-bg-tint-lime absolute inset-0"
          />
          <div className="sh-skel-bg-blur" />
          <div className="sh-skel-bg-fade" />
        </div>

        <header className="sh-skel-header">
          <div className="sh-skel-nav">
            <div className="sh-skel-brand">
              <Bone className="bone-brand" delay={0} block />
            </div>
            <div className="sh-skel-nav-links">
              <div className="sh-skel-nav-link">
                <Bone className="bone-nav-link" delay={60} block />
              </div>
              <div className="sh-skel-nav-link">
                <Bone className="bone-nav-link" delay={90} block />
              </div>
              <div className="sh-skel-nav-link">
                <Bone className="bone-nav-link" delay={120} block />
              </div>
              <div className="sh-skel-nav-link">
                <Bone className="bone-nav-link" delay={150} block />
              </div>
              <div className="sh-skel-nav-link">
                <Bone className="bone-nav-link" delay={180} block />
              </div>
            </div>
            <div className="sh-skel-nav-cta">
              <Bone className="bone-nav-cta" delay={210} accent />
            </div>
          </div>
        </header>

        <div className="sh-skel-body">
          <div className="sh-skel-badge">
            <Bone className="bone-badge" delay={80} />
          </div>
          <div className="sh-skel-headline">
            <Bone className="bone-headline" delay={120} block />
          </div>
          <div className="sh-skel-copy">
            <Bone className="bone-copy" delay={160} />
            <Bone className="bone-copy-2" delay={190} />
          </div>
          <div className="sh-skel-actions">
            <div className="sh-skel-action">
              <Bone className="bone-cta-primary" delay={220} accent />
            </div>
            <div className="sh-skel-action">
              <Bone className="bone-cta-ghost" delay={250} />
            </div>
          </div>
        </div>

        <div className="sh-skel-dash-wrap">
          <div className="sh-skel-dash">
            <Bone className="bone-dash" delay={280} block />
          </div>
        </div>
      </div>
    </section>
  );
}

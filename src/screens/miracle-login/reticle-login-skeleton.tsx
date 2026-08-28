"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { CSSProperties } from "react";
import { GeistSans } from "geist/font/sans";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

import "./reticle-login-skeleton.css";

function Bone({
  className,
  delay = 0,
  style,
  line = false,
}: {
  className?: string;
  delay?: number;
  style?: CSSProperties;
  line?: boolean;
}) {
  return (
    <div
      className={cn("bone rl-skel-bone", line && "bone-line", className)}
      style={{ "--delay": `${delay}ms`, ...style } as CSSProperties}
    />
  );
}

export function ReticleLoginSkeleton({
  className,
  embed = false,
  variant = "magenta",
}: {
  className?: string;
  embed?: boolean;
  variant?: "magenta" | "cyan";
}) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (reduced) {
        gsap.set(
          [
            ".rl-skel-art-panel",
            ".rl-skel-art-frame",
            ".rl-skel-brand",
            ".rl-skel-content",
            ".rl-skel-footer",
            ".rl-skel-bone",
          ],
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            clipPath: "none",
            clearProps: "transform,clipPath",
          },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(".rl-skel-art-panel", { x: 48, autoAlpha: 0 });
        gsap.set(".rl-skel-art-frame", { clipPath: "inset(8% 8% 8% 8% round 5px)" });
        gsap.set(".rl-skel-brand .rl-skel-bone", { autoAlpha: 0, y: 12 });
        gsap.set(".rl-skel-content", { autoAlpha: 0, y: 18 });
        gsap.set(".rl-skel-content .rl-skel-bone", { autoAlpha: 0, y: 12 });
        gsap.set(".rl-skel-footer .rl-skel-bone", { autoAlpha: 0, y: 10 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(".rl-skel-art-panel", { x: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out" }, 0)
          .to(
            ".rl-skel-art-frame",
            { clipPath: "inset(0% 0% 0% 0% round 5px)", duration: 1.15, ease: "power4.inOut" },
            0.04,
          )
          .to(".rl-skel-brand .rl-skel-bone", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.18)
          .to(".rl-skel-content", { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.28)
          .to(
            ".rl-skel-content .rl-skel-bone",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.05,
              ease: "power2.out",
            },
            0.36,
          )
          .to(
            ".rl-skel-footer .rl-skel-bone",
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 },
            0.92,
          )
          .eventCallback("onComplete", () => {
            gsap.set(".rl-skel-art-frame", { clearProps: "clipPath" });
            gsap.set([".rl-skel-content", ".rl-skel-bone"], { clearProps: "transform" });
          });
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <ScreenStage embed={embed} background="#10121c" className={className}>
      <section
        ref={scope}
        className={cn(
          GeistSans.className,
          "fl-reticle-login-skeleton flex h-full w-full bg-[#10121c] font-normal text-white antialiased",
          variant === "cyan" && "fl-reticle-login-skeleton--cyan",
        )}
        aria-busy="true"
        aria-label="Loading Reticle sign in"
      >
      <div className="relative flex h-full w-full items-stretch overflow-hidden">
        {/* Left — form bones */}
        <div className="rl-skel-left relative flex min-h-0 w-full min-w-0 flex-1 flex-col md:w-1/2 md:flex-none lg:w-1/2">
          <div className="rl-skel-brand flex shrink-0 justify-center pt-8 sm:pt-10 lg:pt-[62px]">
            <Bone className="h-6 w-[6.5rem] rounded-md" delay={0} />
          </div>

          <div className="rl-skel-content flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
            <div className="w-full max-w-[340px]">
              <div className="flex flex-col items-center text-center">
                <Bone className="h-9 w-28 rounded-md" delay={60} />
                <Bone className="mt-3 h-3.5 w-[min(100%,260px)] rounded-full" delay={100} />
                <Bone className="mt-2 h-3.5 w-[min(88%,220px)] rounded-full" delay={130} />
              </div>

              <div className="mt-9">
                <Bone className="h-12 w-full rounded-[5px]" delay={160} />
                <Bone className="mx-auto mt-3.5 h-3 w-48 rounded-full" delay={200} />
              </div>

              <div className="my-7 flex items-center gap-3">
                <Bone line className="h-px flex-1 rounded-none" delay={220} />
                <Bone className="h-2.5 w-6 rounded-full" delay={240} />
                <Bone line className="h-px flex-1 rounded-none" delay={220} />
              </div>

              <div className="space-y-2.5">
                <Bone className="h-12 w-full rounded-[5px]" delay={260} />
                <Bone className="h-12 w-full rounded-[5px]" delay={300} />
              </div>
            </div>
          </div>

          <div className="rl-skel-footer flex items-center justify-between px-7 pb-6 pt-2 sm:px-10 lg:px-12">
            <Bone className="h-3 w-24 rounded-full" delay={340} />
            <Bone className="h-3 w-20 rounded-full" delay={360} />
          </div>
        </div>

        {/* Right — art panel skeleton */}
        <div className="rl-skel-art-panel relative hidden w-1/2 shrink-0 self-stretch pt-2.5 pr-2.5 pb-2.5 md:block lg:pt-[15px] lg:pr-[15px] lg:pb-[15px]">
          <div className="rl-skel-art-frame relative h-full w-full overflow-hidden rounded-[5px]">
            <div className="rl-skel-art absolute inset-0 rounded-[5px]" aria-hidden />
            <div className="rl-skel-tint absolute inset-0 rounded-[5px]" aria-hidden />
          </div>
        </div>
      </div>
      </section>
    </ScreenStage>
  );
}

/** Cyan-accent loading skeleton — pairs with Miracle Login Cyan. */
export function ReticleLoginCyanSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  return <ReticleLoginSkeleton className={className} embed={embed} variant="cyan" />;
}

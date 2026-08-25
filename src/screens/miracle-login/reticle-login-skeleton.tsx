"use client";

import type { CSSProperties } from "react";
import { GeistSans } from "geist/font/sans";

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
      className={cn("bone", line && "bone-line", className)}
      style={{ "--delay": `${delay}ms`, ...style } as CSSProperties}
    />
  );
}

export function ReticleLoginSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  return (
    <ScreenStage embed={embed} background="#10121c" className={className}>
      <section
        className={cn(
          GeistSans.className,
          "fl-reticle-login-skeleton flex h-full w-full bg-[#10121c] font-normal text-white antialiased",
        )}
        aria-busy="true"
        aria-label="Loading Reticle sign in"
      >
      <div className="relative flex h-full w-full items-stretch overflow-hidden">
        {/* Left — form bones */}
        <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col md:w-1/2 md:flex-none lg:w-1/2">
          <div className="flex shrink-0 justify-center pt-8 sm:pt-10 lg:pt-[62px]">
            <Bone className="h-6 w-[6.5rem] rounded-md" delay={0} />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
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

          <div className="flex items-center justify-between px-7 pb-6 pt-2 sm:px-10 lg:px-12">
            <Bone className="h-3 w-24 rounded-full" delay={340} />
            <Bone className="h-3 w-20 rounded-full" delay={360} />
          </div>
        </div>

        {/* Right — art panel skeleton */}
        <div className="relative hidden w-1/2 shrink-0 self-stretch pt-2.5 pr-2.5 pb-2.5 md:block lg:pt-[15px] lg:pr-[15px] lg:pb-[15px]">
          <div className="relative h-full w-full overflow-hidden rounded-[5px]">
            <div className="rl-skel-art absolute inset-0 rounded-[5px]" aria-hidden />
            <div className="rl-skel-tint absolute inset-0 rounded-[5px]" aria-hidden />
          </div>
        </div>
      </div>
      </section>
    </ScreenStage>
  );
}

"use client";

import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./dark-pill-hero-skeleton.css";

function Bone({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`bone ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export function DarkPillHeroSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  return (
    <div
      className={cn(
        "fl-dark-pill-skeleton relative min-h-dvh w-full overflow-hidden bg-[#010003]",
        GeistSans.className,
        className,
      )}
    >
      <div
        className={cn("dph-skel-root", embed ? "dph-skel-embed min-h-dvh" : "min-h-dvh")}
        aria-busy="true"
        aria-label="Loading hero"
      >
        <div className="dph-skel-bg" aria-hidden>
          <div className="dph-skel-bg-art" />
          <div className="dph-skel-bg-tint" />
          <div className="dph-skel-bg-fade" />
        </div>

        <header className="dph-skel-header">
          <div className="flex min-w-0 items-center gap-4 sm:gap-8 lg:gap-10">
            <div className="dph-skel-brand-row">
              <Bone className="bone-brand-mark" delay={0} />
              <Bone className="bone-brand-name" delay={40} />
            </div>
            <div className="dph-skel-nav-pills">
              <Bone className="bone-nav-pill" delay={80} />
              <Bone className="bone-nav-pill" delay={110} />
              <Bone className="bone-nav-pill" delay={140} />
              <Bone className="bone-nav-pill" delay={170} />
            </div>
          </div>
          <div className="dph-skel-nav-ctas">
            <Bone className="bone-nav-login" delay={120} />
            <Bone className="bone-nav-cta" delay={160} />
          </div>
        </header>

        <div className="dph-skel-body">
          <Bone className="bone-headline" delay={100} />
          <Bone className="bone-copy" delay={140} />
          <Bone className="bone-copy-2" delay={170} />
          <Bone className="bone-copy-3" delay={200} />
          <div className="dph-skel-actions">
            <Bone className="bone-cta-ghost" delay={220} />
            <Bone className="bone-cta-primary" delay={250} />
          </div>
          <div className="dph-skel-trust">
            <Bone className="bone-trust-label" delay={280} />
            <div className="dph-skel-logos">
              <Bone className="bone-logo" delay={310} />
              <Bone className="bone-logo" delay={340} />
              <Bone className="bone-logo" delay={370} />
              <Bone className="bone-logo" delay={400} />
              <Bone className="bone-logo" delay={430} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

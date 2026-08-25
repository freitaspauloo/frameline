"use client";

import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./ascii-hero-skeleton.css";

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

export function ReticleAsciiHeroSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  return (
    <div
      className={cn(
        "fl-ascii-hero-skeleton min-h-dvh w-full",
        GeistSans.className,
        className,
      )}
    >
      <div
        className={cn("ah-skel-root", embed ? "ah-skel-embed" : "ah-skel-full")}
        aria-busy="true"
        aria-label="Loading hero"
      >
        <div className="ah-skel-bg" aria-hidden>
          <div className="ah-skel-bg-art" />
          <div className="ah-skel-bg-tint" />
          <div className="ah-skel-bg-noise" />
          <div className="ah-skel-bg-rose" />
          <div className="ah-skel-bg-fade" />
        </div>

        <header className="ah-skel-header">
          <div className="ah-skel-header-inner">
            <Bone className="bone-brand" delay={0} />
            <div className="ah-skel-nav-links">
              <Bone className="bone-nav-link" delay={60} />
              <Bone className="bone-nav-link" delay={90} />
              <Bone className="bone-nav-link" delay={120} />
              <Bone className="bone-nav-link" delay={150} />
            </div>
            <Bone className="bone-nav-cta" delay={180} />
          </div>
        </header>

        <div className="ah-skel-body">
          <div className="ah-skel-copy">
            <Bone className="bone-badge" delay={80} />
            <Bone className="bone-headline" delay={120} />
            <Bone className="bone-sub" delay={160} />
            <div className="ah-skel-actions">
              <Bone className="bone-cta" delay={200} />
              <Bone className="bone-cta-secondary" delay={240} />
            </div>
            <Bone className="bone-marquee-label" delay={280} />
            <Bone className="bone-marquee" delay={320} />
          </div>
          <div className="ah-skel-visual" aria-hidden />
        </div>
      </div>
    </div>
  );
}

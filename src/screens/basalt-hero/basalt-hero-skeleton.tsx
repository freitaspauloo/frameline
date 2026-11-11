"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./basalt-hero-skeleton.css";

function Bone({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div className={cn("bone", className)} style={{ "--delay": `${delay}ms` } as CSSProperties} />
  );
}

export function BasaltHeroSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  return (
    <div
      className={cn("fl-basalt-skeleton", embed ? "h-full min-h-0" : "min-h-dvh", className)}
      aria-busy="true"
      aria-label="Loading hero"
    >
      <div className="bhs-glow" aria-hidden />

      <div className="bhs-nav-wrap">
        <div className="bhs-nav">
          <div className="bhs-row">
            <Bone className="bone-mark" />
            <Bone className="bone-wordmark" delay={40} />
          </div>
          <div className="bhs-row bhs-links">
            {[0, 1, 2, 3, 4].map((i) => (
              <Bone key={i} className="bone-link" delay={80 + i * 30} />
            ))}
          </div>
          <div className="bhs-row bhs-actions">
            <Bone className="bone-login" delay={200} />
            <Bone className="bone-nav-cta" delay={230} />
          </div>
        </div>
      </div>

      <div className="bhs-main">
        <Bone className="bone-eyebrow" delay={60} />
        <Bone className="bone-title bone-title--1" delay={100} />
        <Bone className="bone-title bone-title--2" delay={140} />
        <Bone className="bone-sub bone-sub--1" delay={180} />
        <Bone className="bone-sub bone-sub--2" delay={210} />
        <div className="bhs-ctas">
          <Bone className="bone-key" delay={240} />
          <Bone className="bone-key" delay={270} />
        </div>
        <Bone className="bone-caption" delay={300} />

        <div className="bhs-palette">
          <div className="bhs-palette-input">
            <Bone className="bone-search" delay={320} />
            <Bone className="bone-query" delay={340} />
            <Bone className="bone-mode" delay={360} />
          </div>
          <div className="bhs-palette-body">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn("bhs-result", i === 0 && "bhs-result--active")}>
                <Bone className="bone-tile" delay={380 + i * 40} />
                <Bone className="bone-label" delay={400 + i * 40} />
                <Bone className="bone-kbd" delay={420 + i * 40} />
              </div>
            ))}
          </div>
          <div className="bhs-palette-footer">
            <Bone className="bone-hints" delay={560} />
            <Bone className="bone-brand" delay={580} />
          </div>
        </div>

        <Bone className="bone-ghost" delay={600} />
      </div>

      <div className="bhs-badge">
        <Bone className="bone-badge-logo" delay={620} />
        <div className="bhs-badge-text">
          <Bone className="bone-badge-kicker" delay={640} />
          <Bone className="bone-badge-title" delay={660} />
        </div>
      </div>
    </div>
  );
}

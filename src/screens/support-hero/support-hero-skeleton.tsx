"use client";

import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./support-hero-skeleton.css";

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

export function SupportHeroSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fl-support-skeleton relative min-h-dvh w-full overflow-hidden bg-black",
        GeistSans.className,
        className,
      )}
    >
      <div className="sh-skel-root min-h-dvh" aria-busy="true" aria-label="Loading hero">
        <div className="sh-skel-bg" aria-hidden>
          <div className="sh-skel-bg-art" />
          <div className="sh-skel-bg-tint" />
          <div className="sh-skel-bg-blur" />
          <div className="sh-skel-bg-fade" />
        </div>

        <header className="sh-skel-header">
          <div className="sh-skel-nav">
            <Bone className="bone-brand" delay={0} />
            <div className="sh-skel-nav-links">
              <Bone className="bone-nav-link" delay={60} />
              <Bone className="bone-nav-link" delay={90} />
              <Bone className="bone-nav-link" delay={120} />
              <Bone className="bone-nav-link" delay={150} />
              <Bone className="bone-nav-link" delay={180} />
            </div>
            <Bone className="bone-nav-cta" delay={210} />
          </div>
        </header>

        <div className="sh-skel-body">
          <Bone className="bone-badge" delay={80} />
          <Bone className="bone-headline" delay={120} />
          <Bone className="bone-copy" delay={160} />
          <Bone className="bone-copy-2" delay={190} />
          <div className="sh-skel-actions">
            <Bone className="bone-cta-primary" delay={220} />
            <Bone className="bone-cta-ghost" delay={250} />
          </div>
        </div>

        <div className="sh-skel-dash-wrap">
          <Bone className="bone-dash" delay={280} />
        </div>
      </div>
    </div>
  );
}

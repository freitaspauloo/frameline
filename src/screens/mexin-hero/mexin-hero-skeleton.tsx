"use client";

import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./mexin-hero-skeleton.css";

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

export function MexinHeroSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mx-hero-skeleton", GeistSans.className, className)}>
      <div
        className="mx-skel-root"
        aria-busy="true"
        aria-label="Loading hero"
      >
        <div className="mx-skel-bg" aria-hidden>
          <div className="mx-skel-bg-art" />
          <div className="mx-skel-bg-tint" />
          <div className="mx-skel-bg-blur" />
          <div className="mx-skel-bg-fade" />
        </div>

        <header className="mx-skel-header">
          <div className="mx-skel-nav">
            <Bone className="bone-brand" delay={0} />
            <div className="mx-skel-nav-links">
              <Bone className="bone-nav-link" delay={60} />
              <Bone className="bone-nav-link" delay={90} />
              <Bone className="bone-nav-link" delay={120} />
              <Bone className="bone-nav-link" delay={150} />
            </div>
            <Bone className="bone-nav-cta" delay={180} />
          </div>
        </header>

        <div className="mx-skel-body">
          <Bone className="bone-badge" delay={80} />
          <Bone className="bone-headline" delay={120} />
          <div className="mx-skel-actions">
            <Bone className="bone-cta" delay={160} />
            <Bone className="bone-link" delay={200} />
          </div>
          <div className="mx-skel-logos">
            <Bone className="bone-logo" delay={220} />
            <Bone className="bone-logo" delay={250} />
            <Bone className="bone-logo" delay={280} />
            <Bone className="bone-logo" delay={310} />
            <Bone className="bone-logo" delay={340} />
          </div>
        </div>
      </div>
    </div>
  );
}

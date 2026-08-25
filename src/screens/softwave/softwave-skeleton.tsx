"use client";

import { useEffect, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./softwave-skeleton.css";

function Bone({
  className = "",
  delay = 0,
  solid = false,
}: {
  className?: string;
  delay?: number;
  solid?: boolean;
}) {
  return (
    <div
      className={cn("sw-skel-bone", solid && "sw-skel-bone-solid", className)}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export function SoftwaveSkeleton({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  useEffect(() => {
    const nodes = [document.documentElement, document.body];
    nodes.forEach((node) => node.classList.add("softwave-skeleton-active"));
    return () => {
      nodes.forEach((node) => node.classList.remove("softwave-skeleton-active"));
    };
  }, []);

  return (
    <div
      className={cn(
        "fl-softwave-skeleton",
        embed && "fl-softwave-skeleton-embed",
        className,
      )}
      aria-busy="true"
      aria-label="Loading Softwave hero"
    >
      <div className="sw-skel-bg" aria-hidden>
        <div className="sw-skel-bg-scrim" />
      </div>

      <div className="sw-skel-content">
        <header className="sw-skel-header">
          <Bone className="bone-nav" delay={0} />
        </header>

        <div className="sw-skel-copy">
          <Bone className="bone-headline" delay={80} />
          <Bone className="bone-headline-2" delay={110} />
          <Bone className="bone-lede" delay={140} />
          <Bone className="bone-lede-2" delay={170} />
        </div>

        <div className="sw-skel-actions">
          <Bone className="bone-cta-ghost" delay={200} />
          <Bone className="bone-cta-primary" delay={230} solid />
        </div>

        <div className="sw-skel-trust">
          <Bone className="bone-trust-label" delay={260} />
          <div className="sw-skel-logos">
            <Bone className="bone-logo" delay={280} />
            <Bone className="bone-logo" delay={300} />
            <Bone className="bone-logo" delay={320} />
            <Bone className="bone-logo" delay={340} />
          </div>
        </div>
      </div>
    </div>
  );
}

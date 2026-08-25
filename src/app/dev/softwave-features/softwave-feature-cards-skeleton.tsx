"use client";

import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { SOFTWAVE_FEATURE_CARDS } from "./constants";
import "./softwave-feature-cards-skeleton.css";

function Bone({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <div
      className={`swfc-skel-bone ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

/** Skeleton for Softwave feature cards — dev preview only. */
export function SoftwaveFeatureCardsSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn("swfc-skeleton-root", GeistSans.className, className)}
      aria-busy="true"
      aria-label="Loading Softwave feature cards"
    >
      <div className="swfc-skeleton-grid">
        {SOFTWAVE_FEATURE_CARDS.map((card, index) => (
          <div
            key={card.number}
            className="swfc-skeleton-card"
            aria-hidden
          >
            <Bone className="swfc-skel-number" delay={index * 80} />
            <div className="swfc-skel-copy">
              <Bone className="swfc-skel-line-1" delay={80 + index * 80} />
              <Bone className="swfc-skel-line-2" delay={120 + index * 80} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

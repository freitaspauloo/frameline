"use client";

import { Albert_Sans } from "next/font/google";
import type { CSSProperties } from "react";

import { ScreenStage } from "@/screens/stage";

import "./yield-skeleton.css";

const albert = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

function Bone({
  className = "",
  delay = 0,
  style,
}: {
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`bone ${className}`}
      style={{ "--delay": `${delay}ms`, ...style } as CSSProperties}
    />
  );
}

export function YieldSkeleton({ embed = false }: { embed?: boolean }) {
  return (
    <div className={`fl-yield-skeleton ${albert.className}`}>
      <ScreenStage embed={embed}>
        <div className="orb" aria-hidden="true">
          <div className="orb-skel">
            <div className="orb-skel-core" />
            <div className="orb-skel-ring" />
            <div className="orb-skel-sweep" />
          </div>
        </div>

        <header className="header">
          <div className="brand">
            <Bone className="bone-logo" delay={0} />
            <Bone className="bone-brand" delay={40} />
            <div className="brand-rule bone-rule" />
            <Bone className="bone-tag" delay={80} />
          </div>
          <nav className="nav">
            <div className="nav-links">
              <Bone className="bone-nav" delay={60} />
              <Bone className="bone-nav" delay={90} />
              <Bone className="bone-nav" delay={120} />
            </div>
            <div className="nav-end">
              <Bone className="bone-help" delay={140} />
              <Bone className="bone-cta" delay={160} />
            </div>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-inner">
            <Bone className="bone-headline" delay={80} />
            <Bone className="bone-pill" delay={40} />
            <div className="bone-body">
              <Bone className="bone-line bone-line-full" delay={120} />
              <Bone className="bone-line bone-line-full" delay={150} />
              <Bone className="bone-line bone-line-short" delay={180} />
            </div>
          </div>
        </main>

        <footer className="footer">
          <div className="footer-copy">
            <Bone className="bone-footer-row" delay={200} />
            <Bone className="bone-footer-sub" delay={230} />
          </div>
          <div className="stats">
            <div className="stat">
              <Bone className="bone-stat-num" delay={220} />
              <Bone className="bone-stat-label" delay={250} />
            </div>
            <div className="stat">
              <Bone className="bone-stat-num" delay={240} />
              <Bone className="bone-stat-label" delay={270} />
            </div>
            <div className="stat">
              <Bone className="bone-stat-num" delay={260} />
              <Bone className="bone-stat-label" delay={290} />
            </div>
          </div>
        </footer>
      </ScreenStage>
    </div>
  );
}

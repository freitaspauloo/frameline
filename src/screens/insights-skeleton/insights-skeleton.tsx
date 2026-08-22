"use client";

import { Fragment, type CSSProperties } from "react";

import { ScreenStage } from "@/screens/stage";

import "./insights-skeleton.css";

function Bone({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`bone ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

function GridLine({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <span className="ins-stroke" />
    </div>
  );
}

export function InsightsSkeletonScreen({ embed = false }: { embed?: boolean }) {
  return (
    <div className="fl-insights-skeleton">
    <ScreenStage width={1920} height={1200} background="#FFFFFF" className="insights-stage ins-skel" embed={embed}>
      <div className="ins-root">
        <div className="ins-frame">
          <div className="ins-copy">
            <div className="ins-header">
              <Bone className="ins-skel-eyebrow" delay={40} />
              <Bone className="ins-skel-headline" delay={80} />
              <Bone className="ins-skel-headline-short" delay={110} />
            </div>
            <GridLine className="ins-rule" />

            <div className="ins-list">
              <div className="ins-highlight">
                <span className="ins-highlight-bar" aria-hidden="true" />
              </div>
              {[0, 1, 2, 3, 4].map((i) => (
                <Fragment key={i}>
                  <div className="ins-row">
                    <span className="ins-accent" />
                    <span className="ins-row-copy">
                      <Bone className="ins-skel-row-title" delay={140 + i * 40} />
                      <Bone className="ins-skel-row-line" delay={170 + i * 40} />
                      <Bone className="ins-skel-row-line-short" delay={200 + i * 40} />
                    </span>
                  </div>
                  {i < 4 ? <GridLine className="ins-rule" /> : null}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="ins-visual">
            <div className="ins-card">
              <div className="ins-card-header">
                <Bone className="ins-skel-card-title" delay={200} />
                <Bone className="ins-skel-card-sub" delay={240} />
              </div>
              <div className="ins-metrics">
                <div className="ins-metric-row">
                  <div className="ins-metric ins-metric-a">
                    <Bone className="ins-skel-icon" delay={280} />
                    <Bone className="ins-skel-value" delay={300} />
                    <Bone className="ins-skel-label" delay={320} />
                    <Bone className="ins-skel-desc" delay={340} />
                  </div>
                  <div className="ins-metric ins-metric-b">
                    <Bone className="ins-skel-icon" delay={300} />
                    <Bone className="ins-skel-value" delay={320} />
                    <Bone className="ins-skel-label" delay={340} />
                    <Bone className="ins-skel-desc-wide" delay={360} />
                  </div>
                </div>
                <div className="ins-metric-row">
                  <div className="ins-metric ins-metric-a">
                    <Bone className="ins-skel-icon" delay={360} />
                    <Bone className="ins-skel-value" delay={380} />
                    <Bone className="ins-skel-label" delay={400} />
                    <Bone className="ins-skel-desc" delay={420} />
                  </div>
                  <div className="ins-metric ins-metric-b">
                    <Bone className="ins-skel-icon" delay={380} />
                    <Bone className="ins-skel-value" delay={400} />
                    <Bone className="ins-skel-label" delay={420} />
                    <Bone className="ins-skel-desc-wide" delay={440} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GridLine className="ins-vline" style={{ left: 278, top: 0 }} />
        <GridLine className="ins-vline" style={{ left: 1640, top: 0 }} />
        <GridLine className="ins-hline" style={{ top: 186 }} />
        <GridLine className="ins-hline" style={{ top: 1014 }} />
      </div>
    </ScreenStage>
    </div>
  );
}

"use client";

import type { CSSProperties } from "react";

import { ScreenStage } from "@/screens/stage";

import "./features-skeleton.css";

const V_LINES = [0, 144, 160, 319, 640, 720, 879, 1200, 1280, 1439, 1760, 1776, 1919];
const H_LINES = [120, 160, 640, 880];
const LEFTS = [160, 720, 1280];

function Bone({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`bone ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export function FeaturesSkeleton({ embed = false }: { embed?: boolean }) {
  return (
    <div className="fl-features-skeleton">
      <ScreenStage
        background="#FFFFFF"
        className="features-stage feat-skel"
        embed={embed}
        height={1088}
      >
        <div className="feat-grid-v" aria-hidden="true">
          {V_LINES.map((left) => (
            <div key={left} className="feat-vline" style={{ left }} />
          ))}
        </div>

        <div className="feat-grid-h">
          {H_LINES.map((top) => (
            <div key={top} className="feat-hline" style={{ top }} />
          ))}
          {LEFTS.map((left, i) => (
            <div key={left} className="feat-label" style={{ left, top: 121 }}>
              <Bone className="feat-skel-label" delay={40 + i * 40} />
            </div>
          ))}
        </div>

        {LEFTS.map((left, i) => (
          <article key={left} className="feat-card" style={{ left }}>
            <div className="feat-visual">
              <Bone className="feat-skel-visual" delay={80 + i * 40} />
              <Bone className="feat-skel-stat" delay={120 + i * 40} />
            </div>
            <div className="feat-copy">
              <Bone className="feat-skel-title" delay={160 + i * 40} />
              <Bone className="feat-skel-line" delay={200 + i * 40} />
              <Bone className="feat-skel-line" delay={230 + i * 40} />
              <Bone className="feat-skel-line-short" delay={260 + i * 40} />
            </div>
          </article>
        ))}
      </ScreenStage>
    </div>
  );
}

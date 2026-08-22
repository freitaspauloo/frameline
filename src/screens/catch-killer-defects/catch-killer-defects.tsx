"use client";

import { FlutedGlass } from "@paper-design/shaders-react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { ScreenStage } from "@/screens/stage";

import "./catch-killer-defects.css";

const V_LINES = [0, 144, 160, 319, 640, 720, 879, 1200, 1280, 1439, 1760, 1776, 1919];
const H_LINES = [120, 160, 640, 880];

type FeatureCard = {
  left: number;
  label: string;
  stat: string;
  statClass: string;
  title: string;
  body: string;
  visual: "glass" | "image";
  src?: string;
  fill?: { width: number; height: number; left: number; top: number };
  statStyle?: { left: string; top: number };
};

const CARDS: FeatureCard[] = [
  {
    left: 160,
    label: "Dies Classified Daily",
    stat: "98%",
    statClass: "feat-stat feat-stat-1",
    title: "Catch Killer Defects",
    body: "Inspection models trained on real fab imagery\nacross nodes, tools, and process steps.\nClassified before they leave the line.",
    visual: "glass",
  },
  {
    left: 720,
    label: "Defect Capture Rate",
    stat: "40M",
    statClass: "feat-stat",
    title: "Built for Yield",
    body: "In-line inspection for high-volume manufacturing,\nwith models qualified on production imagery\nrather than controlled laboratory samples.",
    visual: "image",
    src: "/screens/catch-killer-defects/card-2.png",
    fill: { width: 541, height: 677, left: 535, top: 663 },
    statStyle: { left: "calc(50% + 93.448px)", top: 26 },
  },
  {
    left: 1280,
    label: "Faster Review Cycles",
    stat: "6.2x",
    statClass: "feat-stat",
    title: "Faster Than Review",
    body: "Defects arrive ranked for engineering review,\nso each cycle is spent on the classifications\nthat protect yield at production volume.",
    visual: "image",
    src: "/screens/catch-killer-defects/card-3.png",
    fill: { width: 500, height: 625, left: 492, top: 607 },
    statStyle: { left: "calc(50% + 89.948px)", top: 26 },
  },
];

function Visual({ card }: { card: FeatureCard }) {
  if (card.visual === "glass") {
    return (
      <div className="feat-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src="/screens/catch-killer-defects/card-1-dither.png" />
        <div className="feat-glass-clip">
          <FlutedGlass
            size={0.89}
            shape="lines"
            angle={0}
            distortionShape="lens"
            distortion={0.5}
            shift={0.35}
            blur={0}
            edges={0}
            stretch={0}
            image="/screens/catch-killer-defects/card-1-glass.webp"
            scale={0.39}
            fit="contain"
            highlights={0}
            shadows={0}
            colorBack="#00000000"
            colorHighlight="#FFFFFF"
            colorShadow="#000000"
            style={{
              width: 1600,
              height: 2000,
              rotate: "180deg",
              flexShrink: 0,
              background: "transparent",
            }}
          />
        </div>
        <div
          className={card.statClass}
          style={{ left: "calc(50% + 93.448px)", top: 26 }}
        >
          {card.stat}
        </div>
      </div>
    );
  }

  return (
    <div className="feat-visual">
      <div
        className="feat-fill"
        style={{
          width: card.fill?.width,
          height: card.fill?.height,
          left: card.fill?.left,
          top: card.fill?.top,
          backgroundImage: `url(${card.src})`,
        }}
      />
      <div className={card.statClass} style={card.statStyle}>
        {card.stat}
      </div>
    </div>
  );
}

export function CatchKillerDefects({ embed = false }: { embed?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const labels = gsap.utils.toArray(".feat-label");
      const labelText = gsap.utils.toArray(".feat-label span");
      const visuals = gsap.utils.toArray(".feat-visual");
      const copies = gsap.utils.toArray(".feat-copy");
      const stats = gsap.utils.toArray(".feat-stat");

      if (reduced) return;

      gsap.set(labels, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(labelText, { autoAlpha: 0, x: -6 });
      gsap.set(visuals, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(copies, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(stats, { autoAlpha: 0, y: 18 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(labels, { clipPath: "inset(0 0% 0 0)", duration: 0.7, stagger: 0.1 }, 0)
        .to(labelText, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.1 }, 0.18)
        .to(visuals, { clipPath: "inset(0% 0 0 0)", duration: 1.15, stagger: 0.13 }, 0.16)
        .to(copies, { clipPath: "inset(0 0 0% 0)", duration: 0.95, stagger: 0.13 }, 0.48)
        .to(stats, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.13 }, 0.72);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fl-catch-killer-defects">
      <ScreenStage
        background="#FFFFFF"
        className="features-stage"
        embed={embed}
        height={1088}
      >
        <div className="feat-root" ref={rootRef}>
          <div className="feat-grid-v" aria-hidden="true">
            {V_LINES.map((left) => (
              <div key={left} className="feat-vline" style={{ left }} />
            ))}
          </div>

          <div className="feat-grid-h">
            {H_LINES.map((top) => (
              <div key={top} className="feat-hline" style={{ top }} />
            ))}
            {CARDS.map((card) => (
              <div
                key={card.label}
                className="feat-label"
                style={{ left: card.left, top: 121 }}
              >
                <span>{card.label}</span>
              </div>
            ))}
          </div>

          {CARDS.map((card) => (
            <article
              key={card.title}
              className="feat-card"
              style={{ left: card.left }}
            >
              <Visual card={card} />
              <div className="feat-copy">
                <div className="feat-title">{card.title}</div>
                <div className="feat-body">{card.body}</div>
              </div>
            </article>
          ))}
        </div>
      </ScreenStage>
    </div>
  );
}

"use client";

import { Albert_Sans } from "next/font/google";

import { ScreenStage } from "@/screens/stage";

import { HeroOrb } from "./hero-orb";
import "./built-for-yield.css";

const albert = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

function LogoMark() {
  const lines = Array.from({ length: 24 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 24) * Math.PI * 2;
    const cx = 18.5;
    const cy = 18;
    const inner = 6.6;
    const outer = 16.4;
    return {
      x1: cx + Math.cos(a) * inner,
      y1: cy + Math.sin(a) * inner,
      x2: cx + Math.cos(a) * outer,
      y2: cy + Math.sin(a) * outer,
    };
  });

  return (
    <svg className="logo" viewBox="0 0 37 36" aria-hidden="true">
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#D600BF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function BuiltForYield({ embed = false }: { embed?: boolean }) {
  return (
    <div className={`fl-built-for-yield ${albert.className}`}>
      <ScreenStage embed={embed}>
        <div className="orb">
          <HeroOrb />
        </div>

        <header className="header">
          <div className="brand">
            <LogoMark />
            <div className="brand-name">Reticle</div>
            <div className="brand-rule" />
            <div className="brand-tag">Fab-native</div>
          </div>
          <nav className="nav">
            <div className="nav-links">
              <a href="#portfolio">Portfolio</a>
              <a href="#company">Company</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="nav-end">
              <a className="help" href="#help">
                Help
              </a>
              <button className="cta" type="button">
                Request Info
              </button>
            </div>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-inner">
            <h1 className="headline">Built for Yield</h1>
            <div className="pill">
              We have classified 40 million dies this quarter
            </div>
            <p className="body">
              Built to catch killer defects before they leave the line, with
              inspection models trained on real fab imagery across nodes, tools,
              and process steps.
            </p>
          </div>
        </main>

        <footer className="footer">
          <div className="footer-copy">
            <div className="footer-row">
              <span className="on">In-line</span>
              <span className="off">defect inspection built for</span>
              <span className="on">high-volume</span>
            </div>
            <div className="off">semiconductor manufacturing worldwide.</div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="stat-num">
                <span className="stat-value">98</span>
                <span className="stat-unit">%</span>
              </div>
              <div className="stat-label">Defect Capture Rate</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <span className="stat-value">6.2</span>
                <span className="stat-unit">x</span>
              </div>
              <div className="stat-label">Faster Review Cycles</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <span className="stat-value">40M</span>
                <span className="stat-unit">+</span>
              </div>
              <div className="stat-label">Dies Classified Daily</div>
            </div>
          </div>
        </footer>
      </ScreenStage>
    </div>
  );
}

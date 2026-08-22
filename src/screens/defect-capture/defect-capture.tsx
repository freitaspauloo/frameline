"use client";

import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";

import { ScreenStage } from "@/screens/stage";

import "./defect-capture.css";

const ITEMS = [
  {
    title: "Defect Capture",
    body: "Inspection models trained on real fab imagery across nodes, tools, and process steps.",
    cardTitle: "Defect Capture Overview",
    cardSub: "Killer defects caught before they leave the line.",
    focus: 0,
  },
  {
    title: "Production-Qualified Models",
    body: "Every classification is qualified on production imagery rather than controlled laboratory samples.",
    cardTitle: "Production Overview",
    cardSub: "Qualified on production imagery, not laboratory samples.",
    focus: 1,
  },
  {
    title: "Ranked Review",
    body: "Defects arrive ranked for engineering review, so each cycle is spent on classifications that protect yield.",
    cardTitle: "Yield Inspection Overview",
    cardSub: "In-line assessment powered by fab-native inspection models.",
    focus: 2,
  },
  {
    title: "Line-Level Assessment",
    body: "Reassess yield on the line over time with classified dies and measurable capture data.",
    cardTitle: "Line-Level Overview",
    cardSub: "Reassess yield on the line with classified dies.",
    focus: 3,
  },
  {
    title: "Classification Preview",
    body: "Review ranked defects before they leave the line, with models built for production volume.",
    cardTitle: "Classification Overview",
    cardSub: "Ranked defects reviewed before they leave the line.",
    focus: 2,
  },
];

const METRICS = [
  {
    value: "98%",
    label: "Defect Capture Rate",
    desc: "Killer defects caught before they leave the line.",
    wide: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.2" stroke="#FFFFFF" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="1.6" fill="#FFFFFF" />
        <path d="M9 1.5V4.2M9 13.8V16.5M1.5 9H4.2M13.8 9H16.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "40M+",
    label: "Dies Classified Daily",
    desc: "Classified across high-volume manufacturing.",
    wide: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="5.4" height="5.4" stroke="#FFFFFF" strokeWidth="1.4" />
        <rect x="10.6" y="2" width="5.4" height="5.4" stroke="#FFFFFF" strokeWidth="1.4" />
        <rect x="2" y="10.6" width="5.4" height="5.4" stroke="#FFFFFF" strokeWidth="1.4" />
        <rect x="10.6" y="10.6" width="5.4" height="5.4" stroke="#FFFFFF" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    value: "6.2x",
    label: "Faster Review Cycles",
    desc: "Each cycle spent on classifications that protect yield.",
    wide: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12a9 9 0 1 1-3.22-6.88"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M21 3v6h-6"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "In-line",
    label: "High-volume Manufacturing",
    desc: "Semiconductor manufacturing worldwide.",
    wide: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 12.5L9 15.2L15 12.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9L9 11.7L15 9" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 5.5L9 8.2L15 5.5L9 2.8L3 5.5Z" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const EASE = "expo.out";
const SOFT = "power2.inOut";

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

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DefectCapture({ embed = false }: { embed?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const topTo = useRef<((value: number) => void) | null>(null);
  const heightTo = useRef<((value: number) => void) | null>(null);
  const cardTween = useRef<{ kill: () => void } | null>(null);
  const entered = useRef(false);
  const selectedRef = useRef(2);
  const [selected, setSelected] = useState(2);
  const item = ITEMS[selected];

  const focusMetrics = (index: number, immediate = false) => {
    const metrics = rootRef.current?.querySelectorAll(".ins-metric");
    if (!metrics?.length) return;
    const focus = ITEMS[index].focus;
    const opacity = (i: number) => (i === focus ? 1 : 0.34);
    if (immediate || prefersReduced()) {
      gsap.set(metrics, { autoAlpha: opacity });
      return;
    }
    gsap.to(metrics, { autoAlpha: opacity, duration: 0.65, ease: SOFT, overwrite: "auto" });
  };

  const placeHighlight = (index: number) => {
    const highlight = highlightRef.current;
    const row = rowRefs.current[index];
    if (!highlight || !row) return;
    gsap.set(highlight, { top: row.offsetTop, height: row.offsetHeight, autoAlpha: 1 });
  };

  const moveHighlight = (index: number, immediate = false) => {
    const highlight = highlightRef.current;
    const row = rowRefs.current[index];
    if (!highlight || !row) return;

    const top = row.offsetTop;
    const height = row.offsetHeight;

    if (immediate || prefersReduced() || !topTo.current) {
      gsap.set(highlight, { top, height, autoAlpha: 1 });
      return;
    }

    gsap.set(highlight, { autoAlpha: 1 });
    topTo.current?.(top);
    heightTo.current?.(height);
  };

  const select = (index: number) => {
    if (!entered.current) return;
    moveHighlight(index);
    focusMetrics(index);
    if (index === selectedRef.current) return;
    selectedRef.current = index;
    setSelected(index);
  };

  useLayoutEffect(() => {
    const highlight = highlightRef.current;
    if (!highlight) return;
    topTo.current = gsap.quickTo(highlight, "top", {
      duration: 0.62,
      ease: "power3.inOut",
      overwrite: true,
    });
    heightTo.current = gsap.quickTo(highlight, "height", {
      duration: 0.62,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, []);

  useLayoutEffect(() => {
    if (!entered.current) {
      placeHighlight(selected);
    }
  }, [selected]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header || !entered.current) return;

    cardTween.current?.kill();
    if (prefersReduced()) {
      gsap.set(header, { autoAlpha: 1, y: 0 });
      return;
    }

    cardTween.current = gsap.fromTo(
      header,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out", overwrite: true },
    );
  }, [selected]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray(".ins-vline, .ins-hline, .ins-rule");
      const rows = gsap.utils.toArray(".ins-row");
      const metrics = gsap.utils.toArray(".ins-metric");

      if (prefersReduced()) {
        entered.current = true;
        moveHighlight(2, true);
        focusMetrics(2, true);
        return;
      }

      gsap.set(lines, { autoAlpha: 0 });
      gsap.set(".ins-eyebrow", { autoAlpha: 0, y: -6 });
      gsap.set(".ins-headline-clip", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(rows, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".ins-highlight", { autoAlpha: 0 });
      gsap.set(".ins-visual", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".ins-card", { autoAlpha: 0, y: 16 });
      gsap.set(metrics, { autoAlpha: 0, y: 10 });

      gsap
        .timeline({
          defaults: { ease: EASE },
          onComplete: () => {
            gsap.set(".ins-headline-clip, .ins-visual, .ins-row", { clipPath: "none" });
            entered.current = true;
            moveHighlight(selectedRef.current, true);
            focusMetrics(selectedRef.current, false);
          },
        })
        .to(lines, { autoAlpha: 1, duration: 0.7, stagger: 0.04 }, 0)
        .to(".ins-eyebrow", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.1)
        .to(".ins-headline-clip", { clipPath: "inset(0 0% 0 0)", duration: 0.9 }, 0.14)
        .to(rows, { clipPath: "inset(0 0% 0 0)", duration: 0.7, stagger: 0.08 }, 0.28)
        .to(".ins-highlight", { autoAlpha: 1, duration: 0.55, ease: SOFT }, 0.62)
        .to(".ins-visual", { clipPath: "inset(0 0% 0 0)", duration: 1.1 }, 0.16)
        .to(".ins-card", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.48)
        .to(
          metrics,
          {
            autoAlpha: (i) => (i === ITEMS[2].focus ? 1 : 0.34),
            y: 0,
            duration: 0.55,
            stagger: 0.06,
          },
          0.62,
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fl-defect-capture">
    <ScreenStage width={1920} height={1200} background="#FFFFFF" className="insights-stage" embed={embed}>
      <div ref={rootRef} className="ins-root">
        <div className="ins-frame">
          <div className="ins-copy">
            <div className="ins-header">
              <div className="ins-eyebrow">In-line Yield Inspection</div>
              <div className="ins-headline-clip">
                <div className="ins-headline">
                  <span className="ins-headline-line">Yield insights backed by</span>
                  <span className="ins-headline-line">production models.</span>
                </div>
              </div>
            </div>
            <GridLine className="ins-rule" />

            <div className="ins-list" role="listbox" aria-label="Yield capabilities">
              <div className="ins-highlight" ref={highlightRef}>
                <span className="ins-highlight-bar" aria-hidden="true" />
              </div>
              {ITEMS.map((row, i) => (
                <Fragment key={row.title}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected === i}
                    className="ins-row"
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                  >
                    <span className="ins-accent" />
                    <span className="ins-row-copy">
                      <span className="ins-row-title">{row.title}</span>
                      <span className="ins-row-body">{row.body}</span>
                    </span>
                  </button>
                  {i < ITEMS.length - 1 ? <GridLine className="ins-rule" /> : null}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="ins-visual">
            <div className="ins-fill" />
            <div className="ins-card">
              <div className="ins-card-header" ref={headerRef}>
                <div className="ins-card-title">{item.cardTitle}</div>
                <div className="ins-card-sub">{item.cardSub}</div>
              </div>
              <div className="ins-metrics">
                <div className="ins-metric-row">
                  {METRICS.slice(0, 2).map((metric) => (
                    <div key={metric.label} className={`ins-metric ${metric.wide ? "ins-metric-b" : "ins-metric-a"}`}>
                      <div className="ins-icon">{metric.icon}</div>
                      <div className="ins-metric-value">{metric.value}</div>
                      <div className="ins-metric-label">{metric.label}</div>
                      <div className="ins-metric-desc">{metric.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="ins-metric-row">
                  {METRICS.slice(2).map((metric) => (
                    <div key={metric.label} className={`ins-metric ${metric.wide ? "ins-metric-b" : "ins-metric-a"}`}>
                      <div className="ins-icon">{metric.icon}</div>
                      <div className="ins-metric-value">{metric.value}</div>
                      <div className="ins-metric-label">{metric.label}</div>
                      <div className="ins-metric-desc">{metric.desc}</div>
                    </div>
                  ))}
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

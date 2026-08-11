"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DockApp {
  id: string;
  name: string;
  icon: string;
}

interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

type DockConfig = {
  baseIconSize: number;
  maxScale: number;
  effectWidth: number;
};

const DEFAULT_CONFIG: DockConfig = {
  baseIconSize: 64,
  maxScale: 1.6,
  effectWidth: 240,
};

const MIN_SCALE = 1;

function getSpacing(baseIconSize: number) {
  return Math.max(4, baseIconSize * 0.08);
}

function getPadding(baseIconSize: number) {
  return Math.max(8, baseIconSize * 0.12);
}

function calculatePositions(
  scales: number[],
  baseIconSize: number,
  baseSpacing: number,
) {
  let currentX = 0;
  return scales.map((scale) => {
    const scaledWidth = baseIconSize * scale;
    const centerX = currentX + scaledWidth / 2;
    currentX += scaledWidth + baseSpacing;
    return centerX;
  });
}

function contentWidthFor(
  scales: number[],
  positions: number[],
  baseIconSize: number,
) {
  if (positions.length === 0) return 0;
  return Math.max(
    ...positions.map((pos, index) => pos + (baseIconSize * scales[index]) / 2),
  );
}

function getResponsiveConfig(): DockConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;

  const smallerDimension = Math.min(window.innerWidth, window.innerHeight);

  if (smallerDimension < 480) {
    return {
      baseIconSize: Math.max(40, smallerDimension * 0.08),
      maxScale: 1.4,
      effectWidth: smallerDimension * 0.4,
    };
  }
  if (smallerDimension < 768) {
    return {
      baseIconSize: Math.max(48, smallerDimension * 0.07),
      maxScale: 1.5,
      effectWidth: smallerDimension * 0.35,
    };
  }
  if (smallerDimension < 1024) {
    return {
      baseIconSize: Math.max(56, smallerDimension * 0.06),
      maxScale: 1.6,
      effectWidth: smallerDimension * 0.3,
    };
  }
  return {
    baseIconSize: Math.max(64, Math.min(80, smallerDimension * 0.05)),
    maxScale: 1.8,
    effectWidth: 300,
  };
}

function restingLayout(appCount: number, config: DockConfig) {
  const scales = Array.from({ length: appCount }, () => MIN_SCALE);
  const spacing = getSpacing(config.baseIconSize);
  const positions = calculatePositions(scales, config.baseIconSize, spacing);
  return { scales, positions };
}

const MacOSDock: React.FC<MacOSDockProps> = ({
  apps,
  onAppClick,
  openApps = [],
  className = "",
}) => {
  // Always start from DEFAULT_CONFIG so SSR + first client paint match.
  // Real viewport sizing is applied after mount (no empty-position flash).
  const [config, setConfig] = useState<DockConfig>(DEFAULT_CONFIG);
  const [{ scales: currentScales, positions: currentPositions }, setLayout] =
    useState(() => restingLayout(apps.length, DEFAULT_CONFIG));
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef(0);
  const scalesRef = useRef(currentScales);
  const positionsRef = useRef(currentPositions);
  const mouseXRef = useRef<number | null>(null);
  const configRef = useRef(config);
  const appsRef = useRef(apps);

  const { baseIconSize } = config;
  const padding = getPadding(baseIconSize);

  useEffect(() => {
    scalesRef.current = currentScales;
  }, [currentScales]);

  useEffect(() => {
    positionsRef.current = currentPositions;
  }, [currentPositions]);

  useEffect(() => {
    mouseXRef.current = mouseX;
  }, [mouseX]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    appsRef.current = apps;
  }, [apps]);

  // Mount: measure viewport, snap to resting layout, then reveal.
  useEffect(() => {
    const next = getResponsiveConfig();
    setConfig(next);
    const layout = restingLayout(appsRef.current.length, next);
    scalesRef.current = layout.scales;
    positionsRef.current = layout.positions;
    setLayout(layout);
    setReady(true);

    const handleResize = () => {
      const resized = getResponsiveConfig();
      setConfig(resized);
      const layout = restingLayout(appsRef.current.length, resized);
      scalesRef.current = layout.scales;
      positionsRef.current = layout.positions;
      setLayout(layout);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const layout = restingLayout(apps.length, configRef.current);
    scalesRef.current = layout.scales;
    positionsRef.current = layout.positions;
    setLayout(layout);
  }, [apps]);

  const calculateTargetMagnification = useCallback(
    (mousePosition: number | null, cfg: DockConfig, count: number) => {
      if (mousePosition === null) {
        return Array.from({ length: count }, () => MIN_SCALE);
      }

      const spacing = getSpacing(cfg.baseIconSize);

      return Array.from({ length: count }, (_, index) => {
        const normalIconCenter =
          index * (cfg.baseIconSize + spacing) + cfg.baseIconSize / 2;
        const minX = mousePosition - cfg.effectWidth / 2;
        const maxX = mousePosition + cfg.effectWidth / 2;

        if (normalIconCenter < minX || normalIconCenter > maxX) {
          return MIN_SCALE;
        }

        const theta =
          ((normalIconCenter - minX) / cfg.effectWidth) * 2 * Math.PI;
        const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
        const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;

        return MIN_SCALE + scaleFactor * (cfg.maxScale - MIN_SCALE);
      });
    },
    [],
  );

  useEffect(() => {
    if (!ready) return;

    const tick = () => {
      const cfg = configRef.current;
      const spacing = getSpacing(cfg.baseIconSize);
      const mx = mouseXRef.current;
      const targetScales = calculateTargetMagnification(
        mx,
        cfg,
        appsRef.current.length,
      );
      const targetPositions = calculatePositions(
        targetScales,
        cfg.baseIconSize,
        spacing,
      );
      const lerpFactor = mx !== null ? 0.2 : 0.12;

      const nextScales = scalesRef.current.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + diff * lerpFactor;
      });
      const nextPositions = positionsRef.current.map((currentPos, index) => {
        const diff = targetPositions[index] - currentPos;
        return currentPos + diff * lerpFactor;
      });

      scalesRef.current = nextScales;
      positionsRef.current = nextPositions;
      setLayout({ scales: nextScales, positions: nextPositions });

      const scalesNeedUpdate = nextScales.some(
        (scale, index) => Math.abs(scale - targetScales[index]) > 0.002,
      );
      const positionsNeedUpdate = nextPositions.some(
        (pos, index) => Math.abs(pos - targetPositions[index]) > 0.1,
      );

      if (scalesNeedUpdate || positionsNeedUpdate || mx !== null) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = undefined;
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mouseX, ready, calculateTargetMagnification, config, apps.length]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMoveTime.current < 16) return;
      lastMouseMoveTime.current = now;

      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left - padding);
      }
    },
    [padding],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element: HTMLElement) => {
    const bounceHeight = Math.max(-8, -baseIconSize * 0.15);
    element.style.transition = "transform 0.2s ease-out";
    element.style.transform = `translateY(${bounceHeight}px)`;

    setTimeout(() => {
      element.style.transform = "translateY(0px)";
    }, 200);
  };

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index]) {
      createBounceAnimation(iconRefs.current[index]!);
    }
    onAppClick(appId);
  };

  const contentWidth = contentWidthFor(
    currentScales,
    currentPositions,
    baseIconSize,
  );

  return (
    <div
      className={cn(
        "backdrop-blur-md transition-opacity duration-200",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={dockRef}
      style={{
        width: `${contentWidth + padding * 2}px`,
        background: "rgba(45, 45, 45, 0.75)",
        borderRadius: `${Math.max(12, baseIconSize * 0.4)}px`,
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: `
          0 ${Math.max(4, baseIconSize * 0.1)}px ${Math.max(16, baseIconSize * 0.4)}px rgba(0, 0, 0, 0.4),
          0 ${Math.max(2, baseIconSize * 0.05)}px ${Math.max(8, baseIconSize * 0.2)}px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `,
        padding: `${padding}px`,
      }}
    >
      <div
        className="relative"
        style={{
          height: `${baseIconSize}px`,
          width: "100%",
        }}
      >
        {apps.map((app, index) => {
          const scale = currentScales[index] ?? MIN_SCALE;
          const position = currentPositions[index] ?? 0;
          const scaledSize = baseIconSize * scale;

          return (
            <div
              className="absolute flex cursor-pointer flex-col items-center justify-end"
              key={app.id}
              onClick={() => handleAppClick(app.id, index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleAppClick(app.id, index);
                }
              }}
              ref={(el) => {
                iconRefs.current[index] = el;
              }}
              role="button"
              tabIndex={0}
              style={{
                left: `${position - scaledSize / 2}px`,
                bottom: "0px",
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
                transformOrigin: "bottom center",
                zIndex: Math.round(scale * 10),
              }}
              title={app.name}
            >
              <div className="size-full p-[9%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={app.name}
                  className="size-full object-contain"
                  height={scaledSize}
                  src={app.icon}
                  draggable={false}
                  style={{
                    filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseIconSize * 0.05) : Math.max(1, baseIconSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseIconSize * 0.1) : Math.max(2, baseIconSize * 0.06)}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`,
                  }}
                  width={scaledSize}
                />
              </div>

              {openApps.includes(app.id) && (
                <div
                  className="absolute"
                  style={{
                    bottom: `${Math.max(-2, -baseIconSize * 0.05)}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${Math.max(3, baseIconSize * 0.06)}px`,
                    height: `${Math.max(3, baseIconSize * 0.06)}px`,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { MacOSDock, type DockApp, type MacOSDockProps };

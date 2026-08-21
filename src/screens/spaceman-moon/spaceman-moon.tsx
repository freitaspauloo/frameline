"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import styles from "./spaceman-moon.module.css";

const HERO_VIDEO = "/screens/spaceman-moon/hero.mp4";
const HERO_POSTER = "/screens/spaceman-moon/poster.png";
const VIDEO_PLAYBACK_RATE = 0.55;
const VIDEO_FADE_SECONDS = 1.5;

const NAV_LINKS = [
  { label: "Mission", href: "#mission" },
  { label: "Surface", href: "#surface" },
  { label: "Contact", href: "#contact" },
] as const;

const BRANDS = ["Apollo", "Orion", "Artemis", "Voyager"] as const;

type FeaturePin = {
  id: string;
  label: string;
  icon: "orbit" | "signal" | "sparkles" | "mail";
  side: "left" | "right";
  x: string;
  delay: string;
  size: "short" | "tall";
};

const FEATURE_PINS: FeaturePin[] = [
  {
    id: "descent",
    label: "Soft lunar descent",
    icon: "orbit",
    side: "left",
    x: "5.5%",
    delay: styles["nudge-d6"],
    size: "short",
  },
  {
    id: "horizon",
    label: "Track the far horizon",
    icon: "signal",
    side: "left",
    x: "21%",
    delay: styles["nudge-d7"],
    size: "tall",
  },
  {
    id: "signal",
    label: "Hold the uplink",
    icon: "sparkles",
    side: "right",
    x: "21%",
    delay: styles["nudge-d8"],
    size: "tall",
  },
  {
    id: "return",
    label: "Safe return window",
    icon: "mail",
    side: "right",
    x: "5.5%",
    delay: styles["nudge-d9"],
    size: "short",
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function onPinPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
  const node = event.currentTarget;
  const rect = node.getBoundingClientRect();
  if (rect.height <= 0) return;
  const t = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  node.style.setProperty("--cursor-lift", `${Math.round((1 - t) * 18)}px`);
}

function onPinPointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty("--cursor-lift", "0px");
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function createTickEngine() {
  let ctx: AudioContext | null = null;
  let noise: AudioBuffer | null = null;
  let lastPlayAt = -1;

  const AudioCtx =
    typeof window === "undefined"
      ? null
      : window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

  function ensure() {
    if (!AudioCtx) return null;
    if (!ctx) {
      ctx = new AudioCtx();
      const frames = Math.max(1, Math.floor(ctx.sampleRate * 0.04));
      noise = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < frames; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (frames * 0.1));
      }
    }
    return ctx;
  }

  return {
    play() {
      if (prefersReducedMotion()) return;
      const audio = ensure();
      if (!audio || !noise) return;
      const now = audio.currentTime;
      if (now - lastPlayAt < 0.12) return;
      lastPlayAt = now;
      void audio.resume();
      const src = audio.createBufferSource();
      src.buffer = noise;
      const filter = audio.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2900;
      filter.Q.value = 10;
      const gain = audio.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      src.start(now);
    },
    unlock() {
      const audio = ensure();
      if (!audio) return;
      void audio.resume();
    },
    dispose() {
      void ctx?.close();
      ctx = null;
      noise = null;
    },
  };
}

export type SpacemanMoonProps = {
  className?: string;
  /** Fill a fixed-height stage instead of min-height: 100dvh */
  embed?: boolean;
};

/**
 * Spaceman on the Moon — full-bleed cinematic hero (video, magenta blend, glass pins).
 * Demo brand: Lunar. Buyers swap copy and assets.
 */
export function SpacemanMoon({ className, embed = false }: SpacemanMoonProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPhaseRef = useRef<"idle" | "in" | "play" | "out">("idle");
  const hoverPauseRef = useRef(false);
  const pillHoverCountRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof createTickEngine> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(0);

  useEffect(() => {
    const nodes = [document.documentElement, document.body];
    nodes.forEach((node) => node.classList.add("spaceman-moon-active"));
    const prevTitle = document.title;
    document.title = "Lunar — Spaceman on the Moon";

    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "font";
    preload.type = "font/woff2";
    preload.crossOrigin = "anonymous";
    preload.href = "/fonts/manrope-latin.woff2";
    document.head.appendChild(preload);

    const frame = requestAnimationFrame(() => setMotionReady(true));
    return () => {
      cancelAnimationFrame(frame);
      nodes.forEach((node) => node.classList.remove("spaceman-moon-active"));
      document.title = prevTitle;
      preload.remove();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      video.pause();
      setVideoOpacity(1);
      return;
    }

    video.loop = false;
    video.playbackRate = VIDEO_PLAYBACK_RATE;

    const fadeIn = () => {
      videoPhaseRef.current = "in";
      setVideoOpacity(1);
    };

    const revealWhenFramed = () => {
      if (videoPhaseRef.current !== "idle") return;

      const show = () => {
        if (videoPhaseRef.current !== "idle") return;
        fadeIn();
      };

      if (typeof video.requestVideoFrameCallback === "function") {
        video.requestVideoFrameCallback(() => {
          requestAnimationFrame(show);
        });
        return;
      }

      requestAnimationFrame(() => requestAnimationFrame(show));
    };

    const play = () => {
      if (hoverPauseRef.current) return;
      video.playbackRate = VIDEO_PLAYBACK_RATE;
      video.play().catch(() => {});
    };

    const onPlaying = () => {
      revealWhenFramed();
    };

    const onTimeUpdate = () => {
      if (videoPhaseRef.current !== "play") return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration < VIDEO_FADE_SECONDS + 0.5)
        return;
      if (video.currentTime < VIDEO_FADE_SECONDS + 0.35) return;

      const remainingWall =
        (duration - video.currentTime) / Math.max(video.playbackRate, 0.1);
      if (remainingWall <= VIDEO_FADE_SECONDS) {
        videoPhaseRef.current = "out";
        setVideoOpacity(0);
      }
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "opacity") return;
      if (event.target !== video) return;

      if (videoPhaseRef.current === "out") {
        video.currentTime = 0.08;
        video.playbackRate = VIDEO_PLAYBACK_RATE;
        if (!hoverPauseRef.current) video.play().catch(() => {});
        requestAnimationFrame(() => fadeIn());
        return;
      }

      if (videoPhaseRef.current === "in") {
        videoPhaseRef.current = "play";
      }
    };

    play();
    if (!video.paused && video.readyState >= 2) revealWhenFramed();
    video.addEventListener("canplay", play);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("transitionend", onTransitionEnd);

    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("transitionend", onTransitionEnd);
    };
  }, []);

  useEffect(() => {
    tickRef.current = createTickEngine();
    return () => {
      tickRef.current?.dispose();
      tickRef.current = null;
    };
  }, []);

  function playTick() {
    tickRef.current?.play();
  }

  function onButtonEnter(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    playTick();
  }

  function onPillEnter(event: ReactPointerEvent<HTMLElement>) {
    pillHoverCountRef.current += 1;
    hoverPauseRef.current = true;
    videoRef.current?.pause();
    if (event.pointerType === "mouse") playTick();
  }

  function onPillLeave() {
    pillHoverCountRef.current = Math.max(0, pillHoverCountRef.current - 1);
    if (pillHoverCountRef.current > 0) return;
    hoverPauseRef.current = false;
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;
    video.playbackRate = VIDEO_PLAYBACK_RATE;
    video.play().catch(() => {});
  }

  return (
    <section
      id="top"
      className={cn(
        styles.nudge,
        embed && styles.nudgeEmbed,
        motionReady && styles["nudge-motion-ready"],
        className,
      )}
      onPointerDown={() => tickRef.current?.unlock()}
    >
      <div className={styles["nudge-media"]} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles["nudge-poster"]}
          src={HERO_POSTER}
          alt=""
        />
        <video
          ref={videoRef}
          className={styles["nudge-video"]}
          style={{ opacity: videoOpacity }}
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className={styles["nudge-pink-tint"]} />
        <div className={cn(styles["nudge-glow"], styles["nudge-d1"])} />
        <div
          className={cn(
            styles["nudge-vignette"],
            styles["nudge-fade"],
            styles["nudge-d1"],
          )}
        />
      </div>

      <header className={styles["nudge-header"]}>
        <div
          className={cn(
            styles["nudge-nav-bar"],
            styles["nudge-enter-soft"],
            styles["nudge-d0"],
          )}
        >
          <a
            href="#top"
            className={cn(
              styles["nudge-brand"],
              styles["nudge-enter-soft"],
              styles["nudge-d0"],
            )}
          >
            <LogoMark className={styles["nudge-mark"]} />
            Lunar
          </a>

          <nav className={styles["nudge-nav-desktop"]} aria-label="Primary">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  styles["nudge-enter-soft"],
                  styles["nudge-link"],
                  index === 0
                    ? styles["nudge-d1"]
                    : index === 1
                      ? styles["nudge-d2"]
                      : styles["nudge-d3"],
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles["nudge-nav-end"]}>
            <a
              href="#start"
              className={cn(
                styles["nudge-btn"],
                styles["nudge-btn-nav"],
                styles["nudge-glass-pill"],
                styles["nudge-enter-soft"],
                styles["nudge-d3"],
              )}
              onPointerEnter={onButtonEnter}
              onClick={playTick}
            >
              Join mission
            </a>
            <button
              type="button"
              className={cn(
                styles["nudge-menu-btn"],
                styles["nudge-glass-pill"],
                styles["nudge-enter-soft"],
                styles["nudge-d2"],
              )}
              aria-expanded={menuOpen}
              aria-controls="spaceman-moon-mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onPointerEnter={onButtonEnter}
              onClick={() => {
                playTick();
                setMenuOpen((open) => !open);
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div
          id="spaceman-moon-mobile-nav"
          className={styles["nudge-mobile-panel"]}
          data-open={menuOpen ? "true" : "false"}
        >
          <div className={styles["nudge-mobile-panel-inner"]}>
            <nav
              className={cn(styles["nudge-mobile-nav"], styles["nudge-glass"])}
              aria-label="Mobile"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className={styles["nudge-copy"]}>
        <h1 className={cn(styles["nudge-enter"], styles["nudge-d3"])}>
          Spaceman on the moon.
        </h1>
        <p className={cn(styles["nudge-enter"], styles["nudge-d4"])}>
          A cinematic full-bleed hero — magenta moon, slow video, glass pins.
          Drop it in and make it yours.
        </p>

        <div className={styles["nudge-actions"]}>
          <a
            href="#mission"
            className={cn(
              styles["nudge-btn"],
              styles["nudge-btn-hero"],
              styles["nudge-glass-pill"],
              styles["nudge-enter-soft"],
              styles["nudge-d5"],
            )}
            onPointerEnter={onButtonEnter}
            onClick={playTick}
          >
            See the surface
          </a>
          <a
            id="start"
            href="#start"
            className={cn(
              styles["nudge-btn"],
              styles["nudge-btn-primary"],
              styles["nudge-enter-soft"],
              styles["nudge-d6"],
            )}
            onPointerEnter={onButtonEnter}
            onClick={playTick}
          >
            Join mission
            <ArrowUpRight className={styles["nudge-arrow"]} />
          </a>
        </div>

        <p
          className={cn(
            styles["nudge-trusted"],
            styles["nudge-enter-soft"],
            styles["nudge-d7"],
          )}
        >
          Trusted by
        </p>
        <ul className={styles["nudge-brands"]} aria-label="Trusted by">
          {BRANDS.map((name) => (
            <li key={name} className={styles["nudge-logo"]}>
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles["nudge-pins"]} aria-label="Product features">
        {FEATURE_PINS.map((pin) => (
          <div
            key={pin.id}
            className={cn(
              styles["nudge-pin"],
              pin.size === "tall"
                ? styles["nudge-pin-tall"]
                : styles["nudge-pin-short"],
              pin.delay,
            )}
            style={
              {
                [pin.side]: pin.x,
              } as CSSProperties
            }
            onPointerMove={onPinPointerMove}
            onPointerLeave={onPinPointerLeave}
          >
            <a
              href={`#${pin.id}`}
              className={cn(
                styles["nudge-pin-chip"],
                styles["nudge-glass-pill"],
              )}
              onPointerEnter={onPillEnter}
              onPointerLeave={onPillLeave}
              onClick={playTick}
            >
              <FeatureIcon name={pin.icon} />
              {pin.label}
            </a>
            <div className={cn(styles["nudge-line"], pin.delay)} />
          </div>
        ))}
      </div>

      <div className={styles["nudge-mobile-chips"]}>
        {FEATURE_PINS.map((pin) => (
          <a
            key={pin.id}
            href={`#${pin.id}`}
            className={cn(
              styles["nudge-mobile-chip"],
              styles["nudge-glass-pill"],
              styles["nudge-enter-soft"],
              pin.delay,
            )}
            onPointerEnter={onPillEnter}
            onPointerLeave={onPillLeave}
            onClick={playTick}
          >
            <FeatureIcon name={pin.icon} />
            {pin.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function LogoMark({ className }: { className?: string }) {
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
    <svg className={className} viewBox="0 0 37 36" aria-hidden>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#D600BF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function FeatureIcon({ name }: { name: FeaturePin["icon"] }) {
  if (name === "orbit") return <OrbitIcon />;
  if (name === "signal") return <SignalIcon />;
  if (name === "sparkles") return <SparklesIcon />;
  return <MailIcon />;
}

function OrbitIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={styles["nudge-icon"]}
    >
      <path
        d="M12.4118 10.4467V7C12.4118 6.29276 12.1309 5.61448 11.6308 5.11438C11.1307 4.61428 10.4524 4.33333 9.74516 4.33333H6.13183C6.03243 4.05181 5.87126 3.79612 5.66015 3.58501C5.44904 3.3739 5.19335 3.21274 4.91183 3.11333V0.666667C4.91183 0.489856 4.84159 0.320286 4.71657 0.195262C4.59154 0.0702379 4.42197 0 4.24516 0C4.06835 0 3.89878 0.0702379 3.77376 0.195262C3.64873 0.320286 3.57849 0.489856 3.57849 0.666667V3.11333C3.18783 3.25076 2.84947 3.50607 2.61011 3.84401C2.37074 4.18196 2.24219 4.58587 2.24219 5C2.24219 5.41413 2.37074 5.81804 2.61011 6.15599C2.84947 6.49393 3.18783 6.74924 3.57849 6.88667V15.3333C3.57849 15.5101 3.64873 15.6797 3.77376 15.8047C3.89878 15.9298 4.06835 16 4.24516 16C4.42197 16 4.59154 15.9298 4.71657 15.8047C4.84159 15.6797 4.91183 15.5101 4.91183 15.3333V6.88667C5.19335 6.78726 5.44904 6.6261 5.66015 6.41499C5.87126 6.20388 6.03243 5.94819 6.13183 5.66667H9.74516C10.0988 5.66667 10.4379 5.80714 10.688 6.05719C10.938 6.30724 11.0785 6.64638 11.0785 7V10.4467C10.6337 10.6039 10.2588 10.9134 10.0201 11.3203C9.78135 11.7273 9.69418 12.2055 9.77396 12.6705C9.85374 13.1355 10.0953 13.5573 10.4561 13.8614C10.8168 14.1655 11.2734 14.3323 11.7452 14.3323C12.217 14.3323 12.6736 14.1655 13.0343 13.8614C13.395 13.5573 13.6366 13.1355 13.7164 12.6705C13.7961 12.2055 13.709 11.7273 13.4702 11.3203C13.2315 10.9134 12.8566 10.6039 12.4118 10.4467Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={styles["nudge-icon"]}
    >
      <path
        d="M2.17906 13.1272L4.00231 2.78691C4.03646 2.59287 4.1085 2.40745 4.21432 2.24126C4.32013 2.07506 4.45766 1.93134 4.61903 1.8183C4.7804 1.70526 4.96246 1.62513 5.15481 1.58246C5.34716 1.5398 5.54603 1.53545 5.74006 1.56966L14.6036 3.13341C14.9953 3.20255 15.3436 3.42447 15.5717 3.75035C15.7998 4.07624 15.8892 4.4794 15.8201 4.87116L13.9968 15.2114C13.9627 15.4055 13.8906 15.5909 13.7848 15.7571C13.679 15.9233 13.5415 16.067 13.3801 16.18C13.2187 16.2931 13.0367 16.3732 12.8443 16.4159C12.652 16.4585 12.4531 16.4629 12.2591 16.4287L3.39556 14.8649C3.00381 14.7958 2.65557 14.5739 2.42743 14.248C2.1993 13.9221 2.10996 13.5189 2.17906 13.1272Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.698 4.78125L12.6073 5.823M6.17675 7.7355L12.086 8.778M5.65625 10.6898L9.34925 11.3415"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={styles["nudge-icon"]}
    >
      <path
        d="M6 11.25C9.65625 11.25 11.25 9.71175 11.25 6C11.25 9.71175 12.8325 11.25 16.5 11.25C12.8325 11.25 11.25 12.8325 11.25 16.5C11.25 12.8325 9.65625 11.25 6 11.25ZM1.5 4.875C3.8505 4.875 4.875 3.8865 4.875 1.5C4.875 3.8865 5.89275 4.875 8.25 4.875C5.89275 4.875 4.875 5.89275 4.875 8.25C4.875 5.89275 3.8505 4.875 1.5 4.875Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={styles["nudge-icon"]}
    >
      <path
        d="M12.8865 2.625H5.01147C3.35462 2.625 2.01147 3.96815 2.01147 5.625V12.375C2.01147 14.0319 3.35462 15.375 5.01147 15.375H12.8865C14.5433 15.375 15.8865 14.0319 15.8865 12.375V5.625C15.8865 3.96815 14.5433 2.625 12.8865 2.625Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.04663 5.69531L7.45038 8.79281C7.90321 9.05558 8.41746 9.19397 8.94101 9.19397C9.46455 9.19397 9.9788 9.05558 10.4316 8.79281L15.8504 5.69531"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={styles["nudge-icon"]}
    >
      <path
        d="M3 5h10M3 8h10M3 11h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={styles["nudge-icon"]}
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistMono } from "geist/font/mono";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

import "./fifty-x-hero.css";

const HERO_BG = "/screens/fifty-x-hero/hero-bg.png";
const HERO_BG_VIDEO = "/screens/fifty-x-hero/hero-bg.mp4";
const HERO_BG_REMOTE =
  "https://app.paper.design/file-assets/01M08YKZXH384A258MHEFVW6GK/01M124TG2C4Q2CMVNA23RGEAMT.png";

const BRAND_BLUE = "#1500BF";
const BRAND_NAME = "FORGE.AI";

/** Frameline screen posters as template previews (Paper card row) */
const TEMPLATE_PREVIEWS = [
  { slug: "softwave", title: "Softwave Hero", poster: "/screens/softwave/poster.png" },
  { slug: "mexin-hero", title: "Mexin Hero", poster: "/screens/mexin-hero/poster.png" },
  { slug: "bridge-dither", title: "Bridge Dither", poster: "/screens/bridge-dither/poster.png" },
  { slug: "dark-pill-hero", title: "Dark Pill Hero", poster: "/screens/dark-pill-hero/poster.png" },
] as const;

/** ~15% of Paper card height (250px) visible above the fold */
const TEMPLATE_CARD_PEEK_PX = 38;

/** Paper Q9-0 — view-all chevron uses same glyph rotated 90deg (QU-0 / QV-0) */
const PAPER_ARROW_UP_SVG = "/screens/fifty-x-hero/arrow-up.svg";
const PAPER_CHEVRON_POINTS =
  "18.875 11.375 18.875 12 18.25 12 18.25 12.625 17.625 12.625 17.625 12 17 12 17 11.375 16.375 11.375 16.375 10.75 15.75 10.75 15.75 10.125 15.125 10.125 15.125 9.5 14.5 9.5 14.5 8.875 13.875 8.875 13.875 8.25 13.25 8.25 13.25 7.625 12.625 7.625 12.625 18.875 11.375 18.875 11.375 7.625 10.75 7.625 10.75 8.25 10.125 8.25 10.125 8.875 9.5 8.875 9.5 9.5 8.875 9.5 8.875 10.125 8.25 10.125 8.25 10.75 7.625 10.75 7.625 11.375 7 11.375 7 12 6.375 12 6.375 12.625 5.75 12.625 5.75 12 5.125 12 5.125 11.375 5.75 11.375 5.75 10.75 6.375 10.75 6.375 10.125 7 10.125 7 9.5 7.625 9.5 7.625 8.875 8.25 8.875 8.25 8.25 8.875 8.25 8.875 7.625 9.5 7.625 9.5 7 10.125 7 10.125 6.375 10.75 6.375 10.75 5.75 11.375 5.75 11.375 5.125 12.625 5.125 12.625 5.75 13.25 5.75 13.25 6.375 13.875 6.375 13.875 7 14.5 7 14.5 7.625 15.125 7.625 15.125 8.25 15.75 8.25 15.75 8.875 16.375 8.875 16.375 9.5 17 9.5 17 10.125 17.625 10.125 17.625 10.75 18.25 10.75 18.25 11.375 18.875 11.375";

type ModelProvider = "claude" | "openai" | "google";

type ModelOption = {
  id: string;
  label: string;
  provider: ModelProvider;
};

const MODEL_OPTIONS: ModelOption[] = [
  { id: "claude-opus-5", label: "Claude Opus 5", provider: "claude" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5", provider: "claude" },
  { id: "gpt-5-6-sol", label: "GPT-5.6 Sol", provider: "openai" },
  { id: "gpt-5-6-terra", label: "GPT-5.6 Terra", provider: "openai" },
  { id: "gemini-3-7-flash", label: "Gemini 3.7 Flash", provider: "google" },
];

type AppPlatform = "ios" | "android" | "web";

type AppOption = {
  id: string;
  label: string;
  platform: AppPlatform;
};

const APP_OPTIONS: AppOption[] = [
  { id: "ios", label: "iOS App", platform: "ios" },
  { id: "android", label: "Android App", platform: "android" },
  { id: "web", label: "Web App", platform: "web" },
];

const PROMPT_MESSAGES = [
  "What comes to your mind?",
  "Describe the app you want to build…",
  "What should we make together?",
  "Tell me about your product idea…",
  "What's your next project?",
] as const;

const PROMPT_CYCLE_MS = 6000;

type AttachmentAction = "image" | "file" | "photo";

const ATTACHMENT_OPTIONS: { id: AttachmentAction; label: string }[] = [
  { id: "image", label: "Attach image" },
  { id: "file", label: "Upload file" },
  { id: "photo", label: "Take photo" },
];

export type FiftyXHeroProps = {
  className?: string;
  embed?: boolean;
};

/**
 * forge.ai landing hero — from Paper frame NA-0.
 * Blue gradient field, prompt input, template rail.
 */
export function FiftyXHero({ className, embed = false }: FiftyXHeroProps) {
  const scope = useRef<HTMLElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [useVideoBg, setUseVideoBg] = useState(true);
  const [bgSrc, setBgSrc] = useState(HERO_BG);
  const [artReady, setArtReady] = useState(false);

  const handleArtLoad = useCallback(() => {
    setArtReady(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      setUseVideoBg(false);
      setArtReady(true);
      return;
    }
    const fallback = window.setTimeout(() => setArtReady(true), 700);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  /** Ping-pong loop: play forward → rewind → repeat (seamless vs hard cut) */
  useEffect(() => {
    if (reduced || !useVideoBg) return;

    const video = bgVideoRef.current;
    if (!video) return;

    let rafId = 0;
    let lastTs = 0;

    const stopReverse = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastTs = 0;
    };

    const reverseFrame = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      video.currentTime = Math.max(0, video.currentTime - dt);
      if (video.currentTime <= 0.001) {
        video.currentTime = 0;
        stopReverse();
        void video.play();
        return;
      }
      rafId = requestAnimationFrame(reverseFrame);
    };

    const onEnded = () => {
      video.pause();
      rafId = requestAnimationFrame(reverseFrame);
    };

    video.loop = false;
    video.addEventListener("ended", onEnded);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void video.play();
    }

    return () => {
      stopReverse();
      video.removeEventListener("ended", onEnded);
    };
  }, [reduced, useVideoBg]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !artReady) return;

      if (reduced) {
        gsap.set(
          [
            ".fx-bg-wrap",
            ".fx-fade",
            ".fx-nav",
            ".fx-nav-btn",
            ".fx-headline-row",
            ".fx-headline-pill",
            ".fx-subtitle",
            ".fx-form",
            ".fx-form-label",
            ".fx-toolbar-item",
            ".fx-templates",
            ".fx-template-cards",
            ".fx-template-head",
            ".fx-template-card",
          ],
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            clipPath: "none",
            filter: "none",
            clearProps: "transform,filter,clipPath",
          },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(".fx-bg-wrap", { autoAlpha: 0, scale: 1.04, transformOrigin: "50% 80%" });
        gsap.set(".fx-fade", { autoAlpha: 0 });
        gsap.set(".fx-nav", { autoAlpha: 0, y: -16, filter: "blur(8px)" });
        gsap.set(".fx-nav-btn", { autoAlpha: 0, y: -10, scale: 0.96 });
        gsap.set(".fx-headline-row", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".fx-headline-pill", { autoAlpha: 0, scale: 0.88, x: -12 });
        gsap.set(".fx-subtitle", { autoAlpha: 0, y: 14, filter: "blur(6px)" });
        gsap.set(".fx-form", { autoAlpha: 0, y: 28, scale: 0.97 });
        gsap.set(".fx-form-label", { autoAlpha: 0, y: 8 });
        gsap.set(".fx-toolbar-item", { autoAlpha: 0, y: 10, scale: 0.94 });
        gsap.set(".fx-templates", { autoAlpha: 0, y: 36 });
        gsap.set(".fx-template-cards", { autoAlpha: 0, y: 12 });
        gsap.set(".fx-template-head", { autoAlpha: 0, y: 12 });
        gsap.set(".fx-template-card", { autoAlpha: 0, y: 24, scale: 0.96 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(
            ".fx-bg-wrap",
            { autoAlpha: 1, scale: 1, duration: 1.35, ease: "expo.out" },
            0,
          )
          .to(".fx-fade", { autoAlpha: 1, duration: 0.85 }, 0.08)
          .to(".fx-nav", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.65 }, 0.12)
          .to(".fx-nav-btn", { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07 }, 0.22)
          .to(
            ".fx-headline-row",
            { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power4.inOut" },
            0.34,
          )
          .to(
            ".fx-headline-pill",
            { autoAlpha: 1, scale: 1, x: 0, duration: 0.62, ease: "back.out(1.5)" },
            0.46,
          )
          .to(".fx-subtitle", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, 0.52)
          .to(".fx-form", { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, ease: "power2.out" }, 0.58)
          .to(".fx-form-label", { autoAlpha: 1, y: 0, duration: 0.45 }, 0.68)
          .to(
            ".fx-toolbar-item",
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.42,
              stagger: 0.06,
              ease: "back.out(1.4)",
            },
            0.72,
          )
          .to(".fx-templates", { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" }, 0.82)
          .to(".fx-template-head", { autoAlpha: 1, y: 0, duration: 0.5 }, 0.9)
          .to(".fx-template-cards", { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.96)
          .to(
            ".fx-template-card",
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.96,
          )
          .eventCallback("onComplete", () => {
            gsap.set(".fx-headline-row", { clearProps: "clipPath" });
            gsap.set([".fx-nav", ".fx-subtitle"], { clearProps: "filter" });
          });
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [artReady, reduced] },
  );

  const shell = (
    <section
      ref={scope}
      className={cn(
        GeistMono.className,
        "fl-fifty-x-hero relative flex w-full flex-col overflow-x-clip bg-[#000105] font-light text-white antialiased [font-synthesis:none]",
        embed ? "h-full min-h-0" : "min-h-dvh",
        className,
      )}
    >
      <div className="fx-bg-wrap" aria-hidden>
        {useVideoBg ? (
          <video
            ref={bgVideoRef}
            src={HERO_BG_VIDEO}
            className="fx-bg-plate"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={HERO_BG}
            onLoadedData={handleArtLoad}
            onError={() => {
              setUseVideoBg(false);
            }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- rotated hero plate fallback */
          <img
            src={bgSrc}
            alt=""
            className="fx-bg-plate"
            onLoad={handleArtLoad}
            onError={() => {
              if (bgSrc !== HERO_BG_REMOTE) setBgSrc(HERO_BG_REMOTE);
            }}
          />
        )}
        <div className="fx-bg-grain" aria-hidden />
      </div>

      <div
        className="fx-fade pointer-events-none absolute inset-x-0 top-0 h-[45%]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #000000 -0.01%, rgba(0, 0, 0, 0) 78.33%)",
        }}
        aria-hidden
      />

      <header className="fx-nav relative z-10 mx-auto flex w-full max-w-[1342px] items-center justify-between px-6 pt-[42px] sm:px-10">
        <div className="fx-pill fx-pill--brand fx-pill--ghost flex h-[35px] items-center rounded-full border border-white px-4">
          <span className="text-lg leading-[22px] text-white">{BRAND_NAME}</span>
        </div>
        <div className="flex h-[42px] items-center gap-4 sm:gap-6">
          <a
            href="#login"
            className="fx-nav-btn fx-pill fx-pill--login flex h-[35px] items-center rounded-full px-4 text-lg uppercase leading-[22px]"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            log in
          </a>
          <a
            href="#start"
            className="fx-nav-btn fx-pill fx-pill--start flex h-[35px] items-center rounded-full bg-white px-4 text-lg uppercase leading-[22px]"
            style={{ color: BRAND_BLUE }}
          >
            get started
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1342px] flex-1 flex-col items-center justify-center px-6 sm:px-10">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-[21px]">
            <div className="fx-headline-row flex flex-wrap items-center justify-center gap-x-1 overflow-visible py-1">
              <h1 className="fx-headline whitespace-pre text-center uppercase text-[36px] font-light leading-[1.15]">
                build something with{" "}
              </h1>
              <div className="fx-headline-pill fx-pill fx-pill--brand fx-pill--ghost inline-flex shrink-0 items-center rounded-full border border-white px-[23px] py-2">
                <span className="text-[32px] leading-none">{BRAND_NAME}</span>
              </div>
            </div>
            <p className="fx-subtitle text-center text-lg leading-6 text-white/50">
              Build apps and products by chatting with AI
            </p>
          </div>

          <form
            className="fx-form relative mt-10 flex w-full max-w-[760px] flex-col gap-8 rounded-2xl border border-white/20 bg-[#181818] py-6 pl-6 pr-5 pb-[18px] shadow-[inset_0_0_27px_-12px_#3567ffb8,3px_3px_14px_#3567ff4d,0_0_12px_#0000000a]"
            onSubmit={(event) => event.preventDefault()}
          >
          <PromptTypewriterLabel />
          <div className="flex h-9 w-full shrink-0 items-center gap-2.5">
            <AttachmentDropdown />
            <ModelSelectDropdown />
            <AppSelectDropdown />
            <span className="min-w-0 flex-1 basis-0" />
            <button
              type="button"
              className="fx-toolbar-item fx-icon-btn inline-flex size-9 shrink-0 items-center justify-center rounded-full outline outline-1 outline-[#2D2D2D]"
              aria-label="Voice input"
            >
              <MicIcon />
            </button>
            <button
              type="submit"
              className="fx-toolbar-item fx-icon-btn fx-icon-btn--send inline-flex size-9 shrink-0 items-center justify-center rounded-full outline outline-1 outline-[#2D2D2D]"
              aria-label="Send prompt"
            >
              <ArrowUpIcon />
            </button>
          </div>
          <input id="forgeai-prompt" type="text" className="sr-only" tabIndex={-1} />
        </form>
        </div>
      </main>

      <section
        className={cn(
          "fx-templates z-10 mx-auto w-full max-w-[1342px] px-6 sm:px-10",
          embed ? "absolute inset-x-0 bottom-0" : "mt-auto",
        )}
      >
        <div className="flex flex-col gap-[33px] overflow-clip rounded-t-[32px] bg-[#262626] px-[37px] pt-[33px] pb-0">
          <div className="fx-template-head flex items-start justify-between gap-2 self-stretch">
            <div className="relative h-14 flex-1">
              <h2 className="absolute left-0 top-0 uppercase text-xl leading-6">
                Discover Templates
              </h2>
              <p className="absolute left-0 top-8 text-base leading-6 text-white/35">
                Start your next project with a template
              </p>
            </div>
            <a
              href="#templates"
              className="fx-link inline-flex shrink-0 items-center justify-center gap-3 uppercase text-xl leading-6"
            >
              View all
              <ChevronIcon className="fx-chevron" />
            </a>
          </div>
          <div
            className="fx-template-cards overflow-hidden"
            style={{ height: TEMPLATE_CARD_PEEK_PX }}
          >
            <div className="grid grid-cols-2 gap-[33px] lg:grid-cols-4">
              {TEMPLATE_PREVIEWS.map((template) => (
                <a
                  key={template.slug}
                  href={`/screens/${template.slug}`}
                  className="fx-template-card relative block h-[250px] w-full overflow-clip rounded-[32px] border-0"
                  aria-label={template.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- catalog poster plate */}
                  <img
                    src={template.poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    draggable={false}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );

  if (embed) {
    return (
      <ScreenStage embed background="#000105" className={className}>
        {shell}
      </ScreenStage>
    );
  }

  return shell;
}

function PixelSvg({
  width,
  height,
  viewBox,
  children,
  className,
  style,
}: {
  width: number;
  height: number;
  viewBox: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      aria-hidden
      shapeRendering="crispEdges"
      className={cn("fx-pixel-icon shrink-0", className)}
      style={style}
    >
      {children}
    </svg>
  );
}

function PlusIcon() {
  return (
    <PixelSvg width={15} height={15} viewBox="4.5 4.5 15 15">
      <polygon
        fill="#FFFFFF"
        points="11.625 5.75 12.375 5.75 12.375 11.625 18.25 11.625 18.25 12.375 12.375 12.375 12.375 18.25 11.625 18.25 11.625 12.375 5.75 12.375 5.75 11.625 11.625 11.625"
      />
    </PixelSvg>
  );
}

function MicIcon() {
  return (
    <PixelSvg width={16} height={16} viewBox="4 4 16 16">
      <polygon
        fill="#FFFFFF"
        points="10 13.333 9.334 13.333 9.334 12 11.334 12 11.334 11.333 9.334 11.333 9.334 10 11.334 10 11.334 9.333 9.334 9.333 9.334 8 11.334 8 11.334 7.333 9.334 7.333 9.334 6 10 6 10 5.333 10.667 5.333 10.667 4.667 13.334 4.667 13.334 5.333 14 5.333 14 6 14.667 6 14.667 7.333 12.667 7.333 12.667 8 14.667 8 14.667 9.333 12.667 9.333 12.667 10 14.667 10 14.667 11.333 12.667 11.333 12.667 12 14.667 12 14.667 13.333 14 13.333 14 14 13.334 14 13.334 14.667 10.667 14.667 10.667 14 10 14 10 13.333"
      />
      <polygon
        fill="#FFFFFF"
        points="16.667 12 16.667 14 16 14 16 15.333 15.334 15.333 15.334 16 14 16 14 16.667 12.667 16.667 12.667 18 14.667 18 14.667 19.333 9.334 19.333 9.334 18 11.334 18 11.334 16.667 10 16.667 10 16 8.667 16 8.667 15.333 8 15.333 8 14 7.334 14 7.334 12 8 12 8 13.333 8.667 13.333 8.667 14.667 9.334 14.667 9.334 15.333 10.667 15.333 10.667 16 13.334 16 13.334 15.333 14.667 15.333 14.667 14.667 15.334 14.667 15.334 13.333 16 13.333 16 12 16.667 12"
      />
    </PixelSvg>
  );
}

function ArrowUpIcon() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- Paper Q9-0 pixel glyph */
    <img
      src={PAPER_ARROW_UP_SVG}
      width={16}
      height={16}
      alt=""
      aria-hidden
      draggable={false}
      className="fx-pixel-icon fx-pixel-icon--arrow shrink-0"
    />
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <PixelSvg
      width={16}
      height={16}
      viewBox="4 4 16 16"
      className={className}
      style={{ rotate: "90deg", transformOrigin: "50% 50%" }}
    >
      <polygon fill="#FFFFFF" points={PAPER_CHEVRON_POINTS} />
    </PixelSvg>
  );
}

function AttachmentOptionIcon({ action }: { action: AttachmentAction }) {
  const icons: Record<AttachmentAction, string> = {
    image: "/screens/fifty-x-hero/attach-image.svg",
    file: "/screens/fifty-x-hero/attach-file.svg",
    photo: "/screens/fifty-x-hero/attach-camera.svg",
  };

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- attach menu glyphs */
    <img
      src={icons[action]}
      width={14}
      height={14}
      alt=""
      aria-hidden
      draggable={false}
      className="fx-provider-logo shrink-0"
    />
  );
}

function AttachmentDropdown() {
  const { reduced, rootRef, open, setOpen } = useChipDropdown();

  return (
    <div
      ref={rootRef}
      className={cn("fx-attach-select fx-toolbar-item relative shrink-0", open && "fx-dropdown-open")}
    >
      <button
        type="button"
        className={cn(
          "fx-icon-btn inline-flex size-8 shrink-0 items-center justify-center rounded-full outline outline-1 outline-[#2D2D2D]",
          open && "fx-icon-btn--open",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Add attachment"
        onClick={() => setOpen((value) => !value)}
      >
        <PlusIcon />
      </button>

      {open ? (
        <div
          className={cn("fx-model-menu fx-attach-menu", !reduced && "fx-model-menu--animate")}
          role="menu"
          aria-label="Attachments"
        >
          <p className="fx-model-menu-label">Attach</p>
          <ul className="fx-model-menu-list">
            {ATTACHMENT_OPTIONS.map((option) => (
              <li key={option.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="fx-model-option"
                  onClick={() => setOpen(false)}
                >
                  <span className="fx-model-option-icon">
                    <AttachmentOptionIcon action={option.id} />
                  </span>
                  <span className="fx-model-option-label">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PromptTypewriterLabel() {
  const reduced = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const message = PROMPT_MESSAGES[messageIndex];

  useEffect(() => {
    if (reduced) {
      setDisplayed(message);
      setIsTyping(false);
      return;
    }

    let cancelled = false;
    let charIndex = 0;
    let typeTimer = 0;
    const charDelay = Math.min(42, Math.max(24, 1300 / message.length));

    setDisplayed("");
    setIsTyping(true);

    const typeNext = () => {
      if (cancelled) return;
      charIndex += 1;
      setDisplayed(message.slice(0, charIndex));
      if (charIndex < message.length) {
        typeTimer = window.setTimeout(typeNext, charDelay);
      } else {
        setIsTyping(false);
      }
    };

    typeTimer = window.setTimeout(typeNext, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(typeTimer);
    };
  }, [message, reduced]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % PROMPT_MESSAGES.length);
    }, PROMPT_CYCLE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <label htmlFor="forgeai-prompt" className="fx-form-label text-base leading-6 text-white/35">
      <span aria-live="polite" className="inline">
        {displayed}
        {!reduced && isTyping ? (
          <span className="fx-prompt-caret" aria-hidden>
            |
          </span>
        ) : null}
      </span>
    </label>
  );
}

function useChipDropdown() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return { reduced, rootRef, open, setOpen };
}

function ModelProviderIcon({ provider }: { provider: ModelProvider }) {
  const logos: Record<ModelProvider, string> = {
    claude: "/screens/fifty-x-hero/claude-symbol.svg",
    openai: "/screens/fifty-x-hero/openai.svg",
    google: "/screens/fifty-x-hero/gemini.svg",
  };

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- provider brand marks */
    <img
      src={logos[provider]}
      width={14}
      height={14}
      alt=""
      aria-hidden
      draggable={false}
      className="fx-provider-logo shrink-0"
    />
  );
}

function AppPlatformIcon({ platform }: { platform: AppPlatform }) {
  const logos: Record<AppPlatform, string> = {
    ios: "/screens/fifty-x-hero/apple.svg",
    android: "/screens/fifty-x-hero/robot.svg",
    web: "/screens/fifty-x-hero/web.svg",
  };

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- platform brand marks */
    <img
      src={logos[platform]}
      width={platform === "android" ? 15 : 14}
      height={platform === "android" ? 15 : 14}
      alt=""
      aria-hidden
      draggable={false}
      className={cn(
        "fx-provider-logo shrink-0",
        platform === "android" && "fx-provider-logo--android",
      )}
    />
  );
}

function ModelSelectDropdown() {
  const { reduced, rootRef, open, setOpen } = useChipDropdown();
  const [selectedId, setSelectedId] = useState(MODEL_OPTIONS[0].id);

  const selected =
    MODEL_OPTIONS.find((model) => model.id === selectedId) ?? MODEL_OPTIONS[0];

  return (
    <div
      ref={rootRef}
      className={cn("fx-model-select fx-toolbar-item relative shrink-0", open && "fx-dropdown-open")}
    >
      <button
        type="button"
        className={cn(
          "fx-chip inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] leading-4 outline outline-1 outline-[#2D2D2D]",
          open && "fx-chip--open",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select model"
        onClick={() => setOpen((value) => !value)}
      >
        <ModelProviderIcon provider={selected.provider} />
        <span className="max-w-[152px] truncate">{selected.label}</span>
      </button>

      {open ? (
        <div
          className={cn("fx-model-menu", !reduced && "fx-model-menu--animate")}
          role="listbox"
          aria-label="Models"
        >
          <p className="fx-model-menu-label">Models</p>
          <ul className="fx-model-menu-list">
            {MODEL_OPTIONS.map((model) => {
              const isSelected = model.id === selectedId;
              return (
                <li key={model.id} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "fx-model-option",
                      isSelected && "fx-model-option--selected",
                    )}
                    onClick={() => {
                      setSelectedId(model.id);
                      setOpen(false);
                    }}
                  >
                    <span className="fx-model-option-icon">
                      <ModelProviderIcon provider={model.provider} />
                    </span>
                    <span className="fx-model-option-label">{model.label}</span>
                    {isSelected ? <span className="fx-model-option-check" aria-hidden /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function AppSelectDropdown() {
  const { reduced, rootRef, open, setOpen } = useChipDropdown();
  const [selectedId, setSelectedId] = useState(APP_OPTIONS[0].id);

  const selected = APP_OPTIONS.find((app) => app.id === selectedId) ?? APP_OPTIONS[0];

  return (
    <div
      ref={rootRef}
      className={cn("fx-app-select fx-toolbar-item relative shrink-0", open && "fx-dropdown-open")}
    >
      <button
        type="button"
        className={cn(
          "fx-chip inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] leading-4 outline outline-1 outline-[#2D2D2D]",
          open && "fx-chip--open",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select app platform"
        onClick={() => setOpen((value) => !value)}
      >
        <AppPlatformIcon platform={selected.platform} />
        <span className="max-w-[120px] truncate">{selected.label}</span>
      </button>

      {open ? (
        <div
          className={cn("fx-model-menu", !reduced && "fx-model-menu--animate")}
          role="listbox"
          aria-label="App platforms"
        >
          <p className="fx-model-menu-label">Platform</p>
          <ul className="fx-model-menu-list">
            {APP_OPTIONS.map((app) => {
              const isSelected = app.id === selectedId;
              return (
                <li key={app.id} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "fx-model-option",
                      isSelected && "fx-model-option--selected",
                    )}
                    onClick={() => {
                      setSelectedId(app.id);
                      setOpen(false);
                    }}
                  >
                    <span className="fx-model-option-icon">
                      <AppPlatformIcon platform={app.platform} />
                    </span>
                    <span className="fx-model-option-label">{app.label}</span>
                    {isSelected ? <span className="fx-model-option-check" aria-hidden /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

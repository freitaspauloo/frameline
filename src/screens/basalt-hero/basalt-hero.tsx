"use client";

import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";

import {
  AppleGlyph,
  ArrowRightIcon,
  BasaltMark,
  FolderOpenIcon,
  HammerIcon,
  MenuIcon,
  ProductHuntGlyph,
  RocketIcon,
  SearchIcon,
  SparklesIcon,
  UpvoteIcon,
  WindowsGlyph,
} from "./icons";

import "./basalt-hero.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--bh-font-sans",
  display: "swap",
});

const NAV_LINKS = ["Product", "Docs", "Pricing", "Changelog", "Blog"] as const;

type Result = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  arg: string;
  keys: readonly string[];
  active?: boolean;
};

const RESULTS: readonly Result[] = [
  {
    icon: RocketIcon,
    label: "Deploy to staging",
    arg: "basalt deploy --env staging",
    keys: ["⌘", "↵"],
    active: true,
  },
  { icon: HammerIcon, label: "Run build", arg: "pnpm build", keys: ["⌘", "B"] },
  { icon: FolderOpenIcon, label: "Open project", arg: "~/projects/app", keys: ["⌘", "O"] },
  {
    icon: SparklesIcon,
    label: "Ask Basalt AI",
    arg: "“why did staging fail?”",
    keys: ["⌘", "K"],
  },
];

/** Diagonal light-blades; each drifts and breathes on its own loop (see basalt-hero.css). */
const BLADES = [1, 2, 3, 4, 5, 6] as const;

export type BasaltHeroProps = {
  className?: string;
  embed?: boolean;
};

/**
 * Basalt Hero — dark developer-tool landing with a living warm aurora,
 * keycap download CTAs, and a dark-glass command-bar mockup.
 * All motion is CSS keyframes; the 0% frame is full bloom so stills read complete.
 */
export function BasaltHero({ className, embed = false }: BasaltHeroProps) {
  return (
    <section
      className={cn(
        "fl-basalt-hero",
        inter.variable,
        GeistMono.variable,
        embed ? "h-full min-h-0" : "min-h-dvh",
        className,
      )}
    >
      <div className="bh-aurora" aria-hidden>
        {BLADES.map((n) => (
          <div key={n} className={`bh-blade bh-blade--${n}`}>
            <div className="bh-blade-core" />
            <div className="bh-blade-edge" />
          </div>
        ))}
        <div className="bh-scrim" />
        <div className="bh-grain" />
        <div className="bh-vignette" />
      </div>

      <header className="bh-nav-wrap">
        <nav className="bh-nav" aria-label="Primary">
          <a className="bh-brand" href="#">
            <BasaltMark className="bh-brand-mark" />
            <span>Basalt</span>
          </a>
          <ul className="bh-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>
          <div className="bh-nav-actions">
            <a className="bh-nav-login" href="#">
              Log in
            </a>
            <a className="bh-nav-download" href="#">
              <AppleGlyph className="bh-nav-download-glyph" />
              Download
            </a>
            <button className="bh-nav-menu" type="button" aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>

      <main className="bh-main">
        <a className="bh-eyebrow" href="#">
          <span className="bh-eyebrow-tag">v2.0</span>
          <span>Now with an AI command bar</span>
          <ArrowRightIcon className="bh-eyebrow-arrow" />
        </a>

        <h1 className="bh-title">
          Everything you build,{" "}
          <br />
          one <span className="bh-title-accent">keystroke</span> away.
        </h1>

        <p className="bh-subtitle">
          Basalt is a keyboard-first launcher for your whole dev loop. Run scripts, jump between
          repos, and ship to staging from a single command bar.
        </p>

        <div className="bh-ctas">
          <a className="bh-key" href="#">
            <AppleGlyph className="bh-key-glyph" />
            Download for Mac
          </a>
          <a className="bh-key" href="#">
            <WindowsGlyph className="bh-key-glyph bh-key-glyph--win" />
            Download for Windows
          </a>
        </div>

        <p className="bh-install">
          <span className="bh-install-cmd">brew install basalt</span>
          <span className="bh-install-sep" aria-hidden>
            ·
          </span>
          <span>Install via homebrew or winget</span>
        </p>

        <div className="bh-palette" role="img" aria-label="Basalt command bar preview">
          <div className="bh-palette-input">
            <SearchIcon className="bh-palette-search" />
            <span className="bh-palette-query">
              deploy staging
              <span className="bh-caret" />
            </span>
            <span className="bh-palette-mode">
              <span className="bh-palette-mode-key">⌘</span>
              Command
            </span>
          </div>

          <div className="bh-palette-body">
            <p className="bh-palette-label">Actions</p>
            <ul className="bh-results">
              {RESULTS.map(({ icon: Icon, label, arg, keys, active }) => (
                <li key={label} className={cn("bh-row", active && "bh-row--active")}>
                  <span className="bh-row-icon">
                    <Icon />
                  </span>
                  <span className="bh-row-label">{label}</span>
                  <span className="bh-row-arg">{arg}</span>
                  <span className="bh-row-keys">
                    {keys.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bh-palette-footer">
            <span className="bh-hints">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> open
              </span>
              <span>
                <kbd>esc</kbd> dismiss
              </span>
            </span>
            <span className="bh-palette-brand">
              <BasaltMark className="bh-palette-brand-mark" />
              Basalt
            </span>
          </div>
        </div>

        <a className="bh-ghost" href="#">
          Learn more
          <ArrowRightIcon className="bh-ghost-arrow" />
        </a>
      </main>

      <a className="bh-badge" href="#" aria-label="Featured on Product Hunt — #1 Product of the Day">
        <ProductHuntGlyph className="bh-badge-logo" />
        <span className="bh-badge-text">
          <span className="bh-badge-kicker">Featured on Product Hunt</span>
          <span className="bh-badge-title">#1 Product of the Day</span>
        </span>
        <span className="bh-badge-votes">
          <UpvoteIcon className="bh-badge-vote-glyph" />
          1,284
        </span>
      </a>
    </section>
  );
}

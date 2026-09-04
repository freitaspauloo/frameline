"use client"

import { useLayoutEffect, useRef } from "react"

import { gsap } from "@/lib/gsap-client"

import AtheraHeroPreloader from "./athera-hero-preloader"
import { mountHeroMotion, safetyReveal } from "./athera-hero-motion"
import { ATHERA_ASSETS, NAV_LINKS } from "./constants"
import { PartnerLogos } from "./partner-logos"
import { FramelineBrand } from "./frameline-brand"
import { ATHERA_THEME_PINK, type AtheraThemeId } from "./themes"
import "./athera-hero.css"

function AccentBlendStack() {
  return (
    <div className="athera-accent-blend-stack absolute inset-0" aria-hidden>
      <div data-hero-overlay className="athera-accent-wash" />
      <div data-hero-overlay className="athera-accent-blend" />
      <div data-hero-overlay className="athera-accent-blur" />
    </div>
  )
}

function AvatarStack() {
  const avatars = [ATHERA_ASSETS.avatar1, ATHERA_ASSETS.avatar2, ATHERA_ASSETS.avatar3]
  return (
    <div className="flex items-center">
      {avatars.map((src, i) => (
        <div
          key={src}
          className="relative size-6 shrink-0 rounded-full border-2 border-white"
          style={{ marginLeft: i === 0 ? 0 : -14 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- dev preview avatars */}
          <img alt="" className="size-full rounded-full object-cover" src={src} />
        </div>
      ))}
    </div>
  )
}

function NavBar() {
  return (
    <nav
      data-hero-nav
      className="athera-border-accent flex w-[672px] items-center justify-between rounded-[20px] border bg-white/90 px-[15px] py-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-[25px]"
      aria-label="Main navigation"
    >
      <div data-hero-nav-item className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- dev preview brand mark */}
        <img alt="" className="size-[25px]" src={ATHERA_ASSETS.framelineLogo} />
        <span className="text-xl font-semibold tracking-[-1.6px] text-black">frameline.ai</span>
      </div>

      <ul className="flex items-center gap-5 text-lg text-black/70">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <a
              data-hero-nav-item
              className="athera-link-accent tracking-[-0.72px] transition-colors"
              href="#"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <button
        data-hero-nav-item
        type="button"
        className="athera-btn-ghost rounded-[15px] border px-[15px] py-[15px] text-lg font-medium tracking-[-0.72px] transition-colors"
      >
        Sign in
      </button>
    </nav>
  )
}

function DashboardPreview() {
  return (
    <div data-hero-dashboard className="absolute right-0 top-[-95px] h-[1027px] w-[696px]">
      <div className="athera-ring-accent absolute left-[17px] top-[23px] isolate h-[984px] w-[659px] overflow-hidden rounded-[20px] ring-1">
        {/* eslint-disable-next-line @next/next/no-img-element -- dev preview sky art */}
        <img
          data-hero-bg
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={ATHERA_ASSETS.sky}
        />
        <AccentBlendStack />
        <div data-hero-accent-glow className="athera-accent-glow absolute inset-0" aria-hidden />
        <div
          className="absolute overflow-hidden rounded-br-[20px] rounded-tl-[20px] rounded-tr-[20px]"
          style={{ left: 128, top: 146, width: 1393, height: 874 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- dev preview dashboard art */}
          <img
            alt="Financial dashboard preview"
            className="size-full object-cover object-left-top"
            src={ATHERA_ASSETS.dashboard}
          />
          <FramelineBrand className="absolute left-[22px] top-[18px] z-10" />
        </div>
      </div>
    </div>
  )
}

type AtheraHeroProps = {
  theme?: AtheraThemeId
}

export default function AtheraHero({ theme = ATHERA_THEME_PINK.id }: AtheraHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const safety = window.setTimeout(() => safetyReveal(root, "hero"), 5000)

    const ctx = gsap.context(() => {
      mountHeroMotion(root)
    }, root)

    return () => {
      window.clearTimeout(safety)
      ctx.revert()
    }
  }, [theme])

  return (
    <div
      ref={rootRef}
      data-theme={theme}
      className="athera-hero athera-motion-pending relative isolate h-[1052px] w-[1440px] shrink-0 overflow-hidden rounded-[20px] border-[5px] border-white bg-[#f4f4f4] antialiased"
    >
      <AtheraHeroPreloader />

      <header className="relative z-10 px-10 pt-5">
        <NavBar />
      </header>

      <div className="relative z-10 h-[932px] w-full">
        <section className="relative flex h-full w-[744px] flex-col gap-8 px-10 pb-16 pt-[54px]">
          <div
            data-hero-enter
            className="athera-border-accent athera-bg-accent-muted flex w-fit items-center gap-2 rounded-xl border py-[5px] pl-[5px] pr-2 backdrop-blur-[10px]"
          >
            <AvatarStack />
            <span className="athera-text-accent-dark text-base tracking-[-0.64px]">
              Trusted by 10k+ people
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <h1
              data-hero-enter
              className="w-[815px] text-[68px] font-medium leading-none tracking-[-4.08px] text-black/80"
            >
              Built for Financial{" "}
              <span className="athera-text-accent opacity-80">Management at Scale.</span>
            </h1>
            <p
              data-hero-enter
              className="w-[612px] text-lg leading-normal tracking-[-0.72px] text-black/56"
            >
              Oversee invoices, payments, and performance without switching tools.
            </p>
          </div>

          <div className="flex gap-5">
            <button
              data-hero-enter
              type="button"
              className="athera-btn-primary relative overflow-hidden rounded-[15px] border px-[25px] py-[15px] text-lg font-medium tracking-[-0.72px] text-white transition-transform hover:scale-[1.02]"
            >
              <span className="relative z-10">Get Started Free</span>
            </button>
            <button
              data-hero-enter
              type="button"
              className="athera-btn-ghost rounded-[15px] border px-[25px] py-[15px] text-lg font-medium tracking-[-0.72px] backdrop-blur-[5px] transition-colors"
            >
              Learn How
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-[15px]">
            <p data-hero-enter className="text-lg tracking-[-0.72px] text-black/50">
              Trusted by leading names
            </p>
            <div data-hero-enter>
              <PartnerLogos />
            </div>
          </div>
        </section>

        <DashboardPreview />
      </div>
    </div>
  )
}

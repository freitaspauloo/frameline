"use client";

import * as React from "react";
import Link from "next/link";
import {
  RiArrowDownLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MaterialPreview } from "@/components/material-preview";
import {
  MarketingRailCross,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingSectionHeader,
  MarketingSectionSpacer,
  MarketingShell,
  MarketingSplit,
  marketingPadX,
} from "@/components/marketing-shell";
import { MarketingFaq } from "@/components/marketing-faq";
import { HeroMacFrame } from "@/components/hero-mac-frame";
import { FramelineLenis } from "@/components/motion/frameline-lenis";
import { LogoWall } from "@/components/motion/logo-wall";
import { MaterialStrip } from "@/components/motion/material-strip";
import { RailProgress } from "@/components/motion/rail-progress";
import {
  FramelineReveal,
  InkRule,
  IntroStagger,
} from "@/components/motion/reveal";
import { WordMask } from "@/components/motion/word-mask";
import { Button } from "@/components/ui/button";
import type { MaterialCatalogEntry } from "@/materials";
import { screenPosterNeedsMagentaTint } from "@/screens/poster-tint";
import type { ScreenCatalogEntry } from "@/screens/types";
import { cn } from "@/lib/utils";

import { CLIENT_LOGOS } from "@/lib/client-logos";

const FAQ_ITEMS = [
  {
    q: "What is a screen?",
    a: "A production-ready landing page — hero, dashboard, or marketing section shipped as React source. Browse the catalog, preview live, then copy what you need.",
  },
  {
    q: "What’s free vs paid?",
    a: "Materials and screens are free to browse. Sign in to copy — CLI, JSX, prompt, or code. Each screen includes 1 free copy per week; after that, $9/mo, $49/y, or $150 lifetime unlocks unlimited copies for that screen.",
  },
  {
    q: "What do Copy prompt and Copy code give me?",
    a: "Copy prompt is a structured brief for your AI coding tool. Copy code is the actual React/CSS Frameline ships for that layout — ready to paste into your repo.",
  },
  {
    q: "Do I own what I copy?",
    a: "Yes. Use copied screens in client and commercial work. You may not resell the source or repackage it as a competing template library.",
  },
  {
    q: "Why sign in to copy?",
    a: "Every copy — prompt, code, or CLI — goes through your account. Sign-in ties your free weekly allowance and paid unlocks to you.",
  },
] as const;

const PRICING_TEASERS = [
  {
    name: "Free",
    price: "$0",
    blurb: "1 free copy per week.",
  },
  {
    name: "Screen",
    price: "$9/mo",
    blurb: "Unlimited prompt + code copies for one template.",
  },
  {
    name: "Yearly",
    price: "$49/y",
    blurb: "Same unlimited unlock, billed once a year.",
  },
  {
    name: "Lifetime",
    price: "$150",
    blurb: "Pay once — unlimited copies forever.",
  },
] as const;

const VALUE_PROPS = [
  {
    title: "Free to evaluate",
    body: "Excellent free materials. Same craft bar as paid.",
  },
  {
    title: "Install as source",
    body: "CLI or copy JSX. You own the component in your repo.",
  },
  {
    title: "Screens at $9",
    body: "One-time unlock for unlimited prompt + code copies.",
  },
] as const;

/** Marks a band for the ledger index without disturbing the ruled layout. */
function SectionBand({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div data-frameline-section data-label={label}>
      {children}
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-3">
        <p
          className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
          data-reveal
        >
          {eyebrow}
        </p>
        <h2
          className="font-heading text-3xl font-light tracking-tight sm:text-4xl"
          data-reveal
        >
          {title}
        </h2>
        <p
          className="max-w-[48ch] text-base leading-relaxed text-muted-foreground"
          data-reveal
        >
          {description}
        </p>
      </div>
      {action ? <div data-reveal>{action}</div> : null}
    </div>
  );
}

export function FramelineHomePageV2({
  catalog,
  screens,
}: {
  catalog: MaterialCatalogEntry[];
  screens: ScreenCatalogEntry[];
}) {
  return (
    <FramelineLenis>
      <FramelineReveal>
        <MarketingShell>
          <RailProgress />

          {/* —— Hero —— */}
          <section
            className="relative isolate flex flex-col bg-background"
            data-frameline-section
            data-label="Index"
            id="top"
          >
            <MarketingNavbar />

            <IntroStagger delay={0.55}>
              <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div
                  className={cn(
                    "flex flex-col items-center pt-14 pb-8 text-center sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12",
                    marketingPadX,
                  )}
                >
                  <div className="max-w-3xl space-y-7">
                    <h1 className="font-instrument text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.05] font-normal tracking-[-0.02em] text-foreground">
                      <WordMask
                        delay={0.28}
                        text="Design assets for the AI era"
                      />
                    </h1>

                    <p
                      className="text-base leading-relaxed text-balance text-muted-foreground sm:text-lg"
                      data-intro-step
                    >
                      Shippable surface — so you don’t ship the default AI look.
                    </p>

                    <div
                      className="flex items-center justify-center pt-3"
                      data-intro-step
                    >
                      <Button
                        nativeButton={false}
                        render={<a href="#browse" />}
                        size="lg"
                      >
                        Browse materials
                        <RiArrowDownLine data-icon="inline-end" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </IntroStagger>

            <div className="relative w-full overflow-visible">
              <HeroMacFrame />
            </div>
          </section>

          {/* —— Credits —— */}
          <MarketingSection id="clients">
            <InkRule />
            <SectionBand label="Shipped with">
              <LogoWall logos={CLIENT_LOGOS} />
            </SectionBand>
          </MarketingSection>

          {/* —— Catalog preview —— */}
          <MarketingSection id="browse">
            <SectionBand label="Catalog">
              <MarketingSectionHeader>
                <SectionIntro
                  description="Full landing screens — copy prompt or source."
                  eyebrow="Catalog"
                  title="Pages you can ship"
                />
              </MarketingSectionHeader>

              <div
                className={cn(
                  "grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:gap-x-12 lg:gap-y-12",
                  marketingPadX,
                  "pt-10 pb-2 lg:pt-14",
                )}
              >
                {screens.map((screen) => (
                  <Link
                    key={screen.slug}
                    className="group block border border-border transition-colors hover:bg-muted/40"
                    data-reveal
                    href={`/materials/${screen.slug}`}
                    aria-label={screen.title}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-foreground">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                        src={screen.poster}
                      />
                      {screenPosterNeedsMagentaTint(screen.slug) ? (
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-[#d600bf] mix-blend-color"
                        />
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>

              <div
                className={cn(
                  "flex justify-center py-10",
                  marketingPadX,
                )}
              >
                <div data-reveal>
                  <Button
                    nativeButton={false}
                    render={<Link href="/materials" />}
                    size="lg"
                    variant="outline"
                  >
                    See full catalog
                    <RiArrowRightLine data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            </SectionBand>
          </MarketingSection>

          <MarketingSectionSpacer size="lg" />

          {/* —— In rotation (moved off hero) —— */}
          <MarketingSection id="rotation">
            <InkRule />
            <SectionBand label="In rotation">
              <MaterialStrip entries={screens} />
            </SectionBand>
          </MarketingSection>

          <MarketingSectionSpacer size="lg" />

          {/* —— Configurator —— */}
          <MarketingSection id="configurator">
            <InkRule />
            <SectionBand label="Configurator">
              <MarketingSplit
                left={
                  <div className="space-y-5">
                    <p
                      className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
                      data-reveal
                    >
                      Configurator
                    </p>
                    <h2
                      className="font-heading text-3xl font-light tracking-tight sm:text-4xl"
                      data-reveal
                    >
                      Tune in the live preview
                    </h2>
                    <p
                      className="max-w-[42ch] text-base leading-relaxed text-muted-foreground"
                      data-reveal
                    >
                      Open any material, adjust props, and copy JSX — the
                      surface is the product, not a PNG pack.
                    </p>
                    <div data-reveal>
                      <Button
                        nativeButton={false}
                        render={<Link href="/materials/aurora-mesh" />}
                        size="lg"
                      >
                        Open Aurora Mesh
                        <RiArrowRightLine data-icon="inline-end" />
                      </Button>
                    </div>
                  </div>
                }
                right={
                  <div
                    className="pointer-events-none relative aspect-[16/10] overflow-hidden bg-foreground lg:aspect-auto lg:min-h-[20rem]"
                    data-reveal
                  >
                    {catalog[0] ? (
                      <MaterialPreview entry={catalog[0]} />
                    ) : null}
                  </div>
                }
              />
            </SectionBand>
          </MarketingSection>

          <MarketingSectionSpacer size="lg" />

          {/* —— Why Frameline —— */}
          <MarketingSection id="why">
            <InkRule />
            <SectionBand label="Why Frameline">
              <MarketingSectionHeader>
                <SectionIntro
                  description="Gradients, textures, and motion — typed React components, token-bound, production-safe."
                  eyebrow="Why Frameline"
                  title="Surface that installs as code"
                />
              </MarketingSectionHeader>

              <MarketingRuledGrid closeBottom>
                {VALUE_PROPS.map((item) => (
                  <MarketingRuledCell key={item.title} className="space-y-2">
                    <h3
                      className="font-heading text-base font-medium tracking-tight"
                      data-reveal
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed text-muted-foreground"
                      data-reveal
                    >
                      {item.body}
                    </p>
                  </MarketingRuledCell>
                ))}
              </MarketingRuledGrid>
            </SectionBand>
          </MarketingSection>

          <MarketingSectionSpacer size="lg" />

          {/* —— Pricing tease —— */}
          <MarketingSection id="pricing">
            <InkRule />
            <SectionBand label="Pricing">
              <MarketingSectionHeader>
                <SectionIntro
                  action={
                    <Button
                      nativeButton={false}
                      render={<Link href="/pricing" />}
                      size="lg"
                    >
                      View pricing
                    </Button>
                  }
                  description="$0 is 1 free copy per week. Screen is $9/mo, $49/y, or $150 lifetime."
                  eyebrow="Pricing"
                  title="Two prices. That’s it."
                />
              </MarketingSectionHeader>

              <MarketingRuledGrid closeBottom cols={4}>
                {PRICING_TEASERS.map((tier) => (
                  <MarketingRuledCell key={tier.name} className="space-y-3">
                    <p
                      className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
                      data-reveal
                    >
                      {tier.name}
                    </p>
                    <p
                      className="font-heading text-3xl font-light tracking-tight sm:text-4xl"
                      data-reveal
                    >
                      {tier.price}
                    </p>
                    <p
                      className="text-sm leading-relaxed text-muted-foreground"
                      data-reveal
                    >
                      {tier.blurb}
                    </p>
                  </MarketingRuledCell>
                ))}
              </MarketingRuledGrid>
            </SectionBand>
          </MarketingSection>

          <MarketingSectionSpacer size="lg" />

          {/* —— FAQ —— */}
          <MarketingSection id="faq">
            <InkRule />
            <SectionBand label="FAQ">
              <MarketingSplit
                className="[&>div:first-child]:px-6 [&>div:first-child]:py-8 sm:[&>div:first-child]:px-8 lg:[&>div:first-child]:px-12 lg:[&>div:first-child]:py-10 [&>div:last-child]:p-0"
                left={
                  <div className="space-y-3">
                    <p
                      className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
                      data-reveal
                    >
                      FAQ
                    </p>
                    <h2
                      className="font-heading text-3xl font-light tracking-tight sm:text-4xl"
                      data-reveal
                    >
                      Before you copy
                    </h2>
                    <p
                      className="max-w-[36ch] text-base leading-relaxed text-muted-foreground"
                      data-reveal
                    >
                      Screens, pricing, and what lands in your repo.
                    </p>
                  </div>
                }
                right={<MarketingFaq items={FAQ_ITEMS} />}
              />
            </SectionBand>
          </MarketingSection>

          {/* —— Closing CTA —— */}
          <MarketingSection id="start">
            <InkRule />
            <SectionBand label="Start">
              <div
                className={cn(
                  "flex flex-col items-start gap-6 pt-10 pb-16 lg:pt-12 lg:pb-20",
                  marketingPadX,
                )}
              >
                <h2 className="max-w-[16ch] font-heading text-3xl font-light tracking-tight sm:text-4xl">
                  <WordMask onView text="Stop shipping the default AI look." />
                </h2>
                <p
                  className="max-w-[40ch] text-base leading-relaxed text-muted-foreground"
                  data-reveal
                >
                  Browse the catalog, install a free material, and put real
                  surface under your next build.
                </p>
                <div className="flex flex-wrap gap-3" data-reveal>
                  <Button
                    nativeButton={false}
                    render={<Link href="/materials" />}
                    size="lg"
                  >
                    Browse materials
                  </Button>
                </div>
              </div>
            </SectionBand>
          </MarketingSection>

          <MarketingFooter />
        </MarketingShell>
      </FramelineReveal>
    </FramelineLenis>
  );
}

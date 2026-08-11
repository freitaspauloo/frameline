"use client";

import * as React from "react";
import Link from "next/link";
import {
  RiArrowDownLine,
  RiArrowRightLine,
  RiCheckLine,
  RiFileCopyLine,
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
  MarketingShell,
  MarketingSplit,
  marketingPadX,
} from "@/components/marketing-shell";
import { HeroMacFrame } from "@/components/hero-mac-frame";
import { FramelineLenis } from "@/components/motion/frameline-lenis";
import { LogoWall } from "@/components/motion/logo-wall";
import {
  MaterialSequence,
  type MaterialSequenceStage,
} from "@/components/motion/material-sequence";
import { MaterialStrip } from "@/components/motion/material-strip";
import { RailProgress } from "@/components/motion/rail-progress";
import {
  FramelineReveal,
  InkRule,
  IntroStagger,
} from "@/components/motion/reveal";
import { TypeOnView } from "@/components/motion/type-on-view";
import { WordMask } from "@/components/motion/word-mask";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getV1LaunchCatalog,
  getFeaturedCollections,
  getCollectionMaterials,
} from "@/materials";
import { cn } from "@/lib/utils";

const CATALOG_PREVIEW_SLOTS = 6;

const INSTALL_SNIPPET = `npx shadcn@latest add @frameline/aurora-mesh`;

/**
 * Credits row. Deliberately fictional studio marks — placeholders set as type,
 * so the band reads as editorial rather than as borrowed endorsement.
 */
const CREDITS = [
  "Northline",
  "Studio Kern",
  "Halftone Co",
  "Verso Labs",
  "Atelier Nine",
  "Ferro Type",
  "Quiet Machines",
  "Ledger & Co",
] as const;

/** Captions for the pinned mesh → dither → grain beat. */
const PUBLIC_CATALOG = getV1LaunchCatalog();

const SEQUENCE_COPY: Record<string, { caption: string; label: string }> = {
  "fog-layer": {
    caption:
      "Atmosphere first — soft fog for heroes that reads like air, not a WebGL flex.",
    label: "Fog",
  },
  "aurora-mesh": {
    caption:
      "Then mesh — a soft multi-color field for the top of the page, wired to your tokens instead of a stock gradient.",
    label: "Mesh",
  },
  "ink-dither": {
    caption:
      "Then dither — two tones, one halftone grid. The loud brand moment that still prints as paper.",
    label: "Dither",
  },
};

const FAQ_ITEMS = [
  {
    q: "Do I own the code after install?",
    a: "Yes. Materials install as source in your repo — typed React components you can edit, theme, and ship.",
  },
  {
    q: "What’s free vs paid?",
    a: "Free materials are production-ready with the same craft bar. Paid unlocks signature materials and clearer commercial rights.",
  },
  {
    q: "Does it fit my design system?",
    a: "Materials are token-bound by default. Wire colors to your theme — they shouldn’t force Frameline’s palette.",
  },
] as const;

const PRICING_TEASERS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Evaluate with excellent free materials.",
  },
  {
    name: "Personal",
    price: "$99",
    blurb: "All personal SKUs · commercial rights.",
  },
  {
    name: "Team",
    price: "$299",
    blurb: "Client work · seats · invoice-ready.",
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
    title: "Buy for depth",
    body: "Paid unlocks signature materials and commercial clarity.",
  },
] as const;

function CatalogSoonPlaceholder() {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-[#F3F5FE] sm:aspect-[3/2]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 22% 36%, rgba(58, 88, 240, 0.2) 0%, transparent 46%),
            radial-gradient(circle at 78% 64%, rgba(58, 88, 240, 0.14) 0%, transparent 44%),
            repeating-linear-gradient(0deg, rgba(58, 88, 240, 0.05) 0 1px, transparent 1px 7px),
            repeating-linear-gradient(90deg, rgba(58, 88, 240, 0.05) 0 1px, transparent 1px 7px)
          `,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-none border border-border/60 bg-background/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase backdrop-blur-sm">
          Placeholder
        </span>
      </div>
    </div>
  );
}

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

function InstallTerminal() {
  const [copied, setCopied] = React.useState(false);

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL_SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="space-y-3 border border-[#3A58F0] bg-[#EEF2FF] p-5 text-[#1A2A6B] sm:p-6"
      data-reveal
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.625rem] font-semibold tracking-widest text-[#3A58F0]/70 uppercase">
          Terminal
        </p>
        <Button
          className="text-[#3A58F0] hover:bg-[#3A58F0]/10 hover:text-[#1A2A6B]"
          size="xs"
          type="button"
          variant="ghost"
          onClick={copyInstall}
        >
          {copied ? <RiCheckLine /> : <RiFileCopyLine />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-[#1A2A6B]">
        <TypeOnView text={INSTALL_SNIPPET} />
      </pre>
      <Separator className="bg-[#3A58F0]/20" />
      <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-[#3A58F0]/75">
        {`import { AuroraMesh } from "@/materials"`}
      </pre>
    </div>
  );
}

const SEQUENCE_STAGES: MaterialSequenceStage[] = PUBLIC_CATALOG.filter(
  (entry) => entry.slug in SEQUENCE_COPY,
).map((entry) => ({ entry, ...SEQUENCE_COPY[entry.slug] }));

export function FramelineHomePageV2() {
  const featuredCollections = getFeaturedCollections();

  return (
    <FramelineLenis>
      <FramelineReveal>
        <MarketingShell>
          <RailProgress />

          {/* —— Hero —— */}
          <section
            className="relative isolate flex min-h-dvh flex-col bg-background"
            data-frameline-section
            data-label="Index"
            id="top"
          >
            <MarketingNavbar />

            <IntroStagger delay={0.55}>
              <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div
                  className={cn(
                    "flex flex-col items-center pt-16 pb-12 text-center sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16",
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

            <div className="relative mt-auto min-h-[min(62dvh,720px)] w-full flex-1 overflow-visible">
              <HeroMacFrame />
            </div>
          </section>

          {/* —— Credits —— */}
          <MarketingSection id="clients">
            <InkRule />
            <SectionBand label="Shipped with">
              <LogoWall names={CREDITS} />
            </SectionBand>
          </MarketingSection>

          {/* —— Catalog preview —— */}
          <MarketingSection id="browse">
            <InkRule />
            <SectionBand label="Catalog">
              <MarketingSectionHeader>
                <SectionIntro
                  description="Production-ready materials you can install. Open any one to tune props and copy JSX."
                  eyebrow="Catalog"
                  title="Materials you can ship"
                />
              </MarketingSectionHeader>

              <div
                className={cn(
                  "grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:gap-x-12 lg:gap-y-12",
                  marketingPadX,
                  "pb-2",
                )}
              >
                {Array.from({ length: CATALOG_PREVIEW_SLOTS }, (_, index) => {
                  const entry = PUBLIC_CATALOG[index];

                  if (!entry) {
                    return (
                      <div
                        key={`soon-${index}`}
                        className="flex h-full min-h-[22rem] flex-col border border-border"
                        data-reveal
                      >
                        <CatalogSoonPlaceholder />
                        <div className="space-y-3 border-t border-border p-7 sm:p-9">
                          <p className="font-mono text-[11px] text-muted-foreground">
                            Soon
                          </p>
                          <h3 className="font-heading text-lg font-medium tracking-tight text-muted-foreground sm:text-xl">
                            Coming soon
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            More surfaces in the next drop.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={entry.slug}
                      className="group flex h-full min-h-[22rem] flex-col border border-border transition-colors hover:bg-muted/40"
                      data-reveal
                      href={`/materials/${entry.slug}`}
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-foreground sm:aspect-[3/2]">
                        <MaterialPreview entry={entry} />
                      </div>
                      <div className="space-y-3 border-t border-border p-7 sm:p-9">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-heading text-lg font-medium tracking-tight sm:text-xl">
                            {entry.title}
                          </h3>
                          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                            {entry.tier === "free" ? "Free" : "Paid"}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {entry.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
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

          {/* —— Pinned sequence —— */}
          <MarketingSection id="showcase">
            <InkRule />
            <SectionBand label="Sequence">
              <MaterialSequence stages={SEQUENCE_STAGES} />
            </SectionBand>
          </MarketingSection>

          {/* —— In rotation (moved off hero) —— */}
          <MarketingSection id="rotation">
            <InkRule />
            <SectionBand label="In rotation">
              <MaterialStrip entries={PUBLIC_CATALOG} />
            </SectionBand>
          </MarketingSection>

          {/* —— Popular collections —— */}
          <MarketingSection id="collections">
            <InkRule />
            <SectionBand label="Collections">
              <MarketingSectionHeader>
                <SectionIntro
                  action={
                    <Button
                      nativeButton={false}
                      render={<Link href="/collections" />}
                      variant="outline"
                    >
                      See all
                      <RiArrowRightLine data-icon="inline-end" />
                    </Button>
                  }
                  description="Editorial drops — materials grouped by job, not by trend."
                  eyebrow="Collections"
                  title="Popular collections"
                />
              </MarketingSectionHeader>

              <MarketingRuledGrid cols={2}>
                {featuredCollections.map((collection) => {
                  const materials = getCollectionMaterials(collection);
                  const preview = materials[0];

                  return (
                    <MarketingRuledCell
                      key={collection.slug}
                      className="p-0 sm:p-0 lg:p-0"
                    >
                      <Link
                        className="group block transition-colors hover:bg-muted/40"
                        data-reveal
                        href={`/collections/${collection.slug}`}
                      >
                        <div className="relative aspect-[21/9] overflow-hidden bg-foreground">
                          {preview ? (
                            <MaterialPreview entry={preview} />
                          ) : (
                            <div className="absolute inset-0 bg-muted" />
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-border p-6 sm:p-8">
                          <div className="space-y-2">
                            <h3 className="font-heading text-base font-medium tracking-tight">
                              {collection.title}
                            </h3>
                            <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                              {collection.description}
                            </p>
                          </div>
                          <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
                            {materials.length} materials
                          </p>
                        </div>
                      </Link>
                    </MarketingRuledCell>
                  );
                })}
              </MarketingRuledGrid>
            </SectionBand>
          </MarketingSection>

          {/* —— Install —— */}
          <MarketingSection id="install">
            <InkRule />
            <SectionBand label="Install">
              <MarketingSplit
                left={
                  <div className="space-y-5">
                    <p
                      className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
                      data-reveal
                    >
                      Install
                    </p>
                    <h2
                      className="font-heading text-3xl font-light tracking-tight sm:text-4xl"
                      data-reveal
                    >
                      Install as source
                    </h2>
                    <p
                      className="max-w-[42ch] text-base leading-relaxed text-muted-foreground"
                      data-reveal
                    >
                      Compatible with the shadcn registry flow. Install, import,
                      theme against your tokens — no locked runtime.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1" data-reveal>
                      <Button
                        nativeButton={false}
                        render={<Link href="/docs/installation" />}
                        size="lg"
                      >
                        Installation docs
                      </Button>
                      <Button
                        nativeButton={false}
                        render={<Link href="/materials" />}
                        size="lg"
                        variant="outline"
                      >
                        Pick a material
                      </Button>
                    </div>
                  </div>
                }
                right={<InstallTerminal />}
              />
            </SectionBand>
          </MarketingSection>

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
                    className="relative aspect-[16/10] overflow-hidden bg-foreground lg:aspect-auto lg:min-h-[20rem]"
                    data-reveal
                  >
                    {PUBLIC_CATALOG[0] ? (
                      <MaterialPreview entry={PUBLIC_CATALOG[0]} />
                    ) : null}
                  </div>
                }
              />
            </SectionBand>
          </MarketingSection>

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

              <MarketingRuledGrid>
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
                  description="Free to evaluate. Paid when you need signature depth and clear commercial rights."
                  eyebrow="Pricing"
                  title="Licenses that match how you ship"
                />
              </MarketingSectionHeader>

              <MarketingRuledGrid>
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

          {/* —— FAQ —— */}
          <MarketingSection id="faq">
            <InkRule />
            <SectionBand label="FAQ">
              <MarketingSplit
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
                      Before you install
                    </h2>
                    <p
                      className="max-w-[36ch] text-base leading-relaxed text-muted-foreground"
                      data-reveal
                    >
                      Short answers on ownership, tiers, and theming.
                    </p>
                  </div>
                }
                right={
                  <Accordion>
                    {FAQ_ITEMS.map((item) => (
                      <AccordionItem key={item.q} data-reveal value={item.q}>
                        <AccordionTrigger>{item.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                }
              />
            </SectionBand>
          </MarketingSection>

          {/* —— Closing CTA —— */}
          <MarketingSection id="start">
            <InkRule />
            <SectionBand label="Start">
              <div
                className={cn(
                  "flex flex-col items-start gap-6 py-16 lg:py-20",
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
                  <Button
                    nativeButton={false}
                    render={<Link href="/collections" />}
                    size="lg"
                    variant="outline"
                  >
                    Explore collections
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

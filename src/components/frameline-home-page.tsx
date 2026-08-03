"use client";

import * as React from "react";
import Link from "next/link";
import { Dithering } from "@paper-design/shaders-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MATERIALS_CATALOG,
  getFeaturedCollections,
  getCollectionMaterials,
} from "@/materials";
import { cn } from "@/lib/utils";

const HERO_INK = "#3A58F0";
const HERO_PAPER = "#FFFFFF";
const CATALOG_PREVIEW_SLOTS = Math.min(6, MATERIALS_CATALOG.length);

const INSTALL_SNIPPET = `npx shadcn@latest add @frameline/aurora-mesh`;

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
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="font-heading text-3xl font-light tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-[48ch] text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function FramelineHomePage() {
  const [copied, setCopied] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [heroInView, setHeroInView] = React.useState(true);
  const heroDitherRef = React.useRef<HTMLDivElement>(null);
  const featuredCollections = getFeaturedCollections();

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    const el = heroDitherRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL_SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const ditherSpeed = reducedMotion || !heroInView ? 0 : 0.4;

  return (
    <MarketingShell>
      {/* —— Hero —— */}
      <section className="relative isolate flex min-h-dvh flex-col bg-background">
        <MarketingNavbar />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div
            className={cn(
              "flex flex-col items-center pt-14 pb-10 text-center sm:pt-16 sm:pb-12 lg:pt-20",
              marketingPadX,
            )}
          >
            <div className="max-w-3xl space-y-5">
              <h1
                className="frameline-rise font-instrument text-[clamp(2.5rem,6.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-foreground"
                style={{ animationDelay: "60ms" }}
              >
                Design assets for the AI era
              </h1>

              <p
                className="frameline-rise whitespace-nowrap text-base leading-relaxed text-muted-foreground sm:text-lg"
                style={{ animationDelay: "160ms" }}
              >
                Shippable surface — so you don’t ship the default AI look.
              </p>

              <div
                className="frameline-rise flex items-center justify-center pt-2"
                style={{ animationDelay: "260ms" }}
              >
                <Button
                  className="transition-transform duration-300 ease-[var(--ease-emil)] hover:translate-y-0.5"
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

        <div
          ref={heroDitherRef}
          aria-hidden
          className="frameline-material-in relative mt-auto min-h-[52dvh] w-full flex-1 border-t border-border"
        >
          <div
            className="absolute inset-x-0 top-0 bottom-0 z-0 mx-auto max-w-7xl overflow-visible"
            style={{ backgroundColor: HERO_PAPER }}
          >
            <MarketingRailCross edge="top" />
            <MarketingRailCross edge="bottom" />
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Dithering
                className="absolute inset-0 h-full w-full"
                colorBack={HERO_PAPER}
                colorFront={HERO_INK}
                maxPixelCount={1_280_000}
                minPixelRatio={1}
                scale={0.85}
                shape="swirl"
                size={2.5}
                speed={ditherSpeed}
                style={{
                  position: "absolute",
                  inset: 0,
                  height: "100%",
                  width: "100%",
                }}
                type="4x4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— Catalog preview —— */}
      <MarketingSection id="browse">
        <MarketingSectionHeader>
          <SectionIntro
            description="Production-ready materials you can install. Open any one to tune props and copy JSX."
            eyebrow="Catalog"
            title="Materials you can ship"
          />
        </MarketingSectionHeader>

        <MarketingRuledGrid>
          {Array.from({ length: CATALOG_PREVIEW_SLOTS }, (_, index) => {
            const entry = MATERIALS_CATALOG[index];

            if (!entry) {
              return (
                <MarketingRuledCell
                  key={`soon-${index}`}
                  className="p-0 sm:p-0 lg:p-0"
                >
                  <div className="flex h-full min-h-[16rem] flex-col">
                    <div className="relative aspect-[16/10] bg-muted/50" />
                    <div className="space-y-2 border-t border-border p-6 sm:p-8">
                      <p className="font-mono text-[11px] text-muted-foreground">
                        Soon
                      </p>
                      <h3 className="font-heading text-base font-medium tracking-tight text-muted-foreground">
                        Coming soon
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        More surfaces in the next drop.
                      </p>
                    </div>
                  </div>
                </MarketingRuledCell>
              );
            }

            return (
              <MarketingRuledCell
                key={entry.slug}
                className="p-0 sm:p-0 lg:p-0"
              >
                <Link
                  className="group block transition-colors hover:bg-muted/40"
                  href={`/materials/${entry.slug}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
                    <MaterialPreview entry={entry} />
                  </div>
                  <div className="space-y-2 border-t border-border p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading text-base font-medium tracking-tight">
                        {entry.title}
                      </h3>
                      <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                        {entry.tier === "free" ? "Free" : "Paid"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </Link>
              </MarketingRuledCell>
            );
          })}
        </MarketingRuledGrid>

        <div
          className={cn(
            "flex justify-center border-t border-border py-10",
            marketingPadX,
          )}
        >
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
      </MarketingSection>

      {/* —— Popular collections —— */}
      <MarketingSection>
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
      </MarketingSection>

      {/* —— Product pillars —— */}
      <MarketingSection>
        <MarketingSplit
          left={
            <div className="space-y-5">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Install
              </p>
              <h2 className="font-heading text-3xl font-light tracking-tight sm:text-4xl">
                Install as source
              </h2>
              <p className="max-w-[42ch] text-base leading-relaxed text-muted-foreground">
                Compatible with the shadcn registry flow. Install, import, theme
                against your tokens — no locked runtime.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
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
          right={
            <div className="space-y-3 bg-foreground p-5 text-background sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.625rem] font-semibold tracking-widest text-background/55 uppercase">
                  Terminal
                </p>
                <Button
                  className="text-background hover:bg-background/10 hover:text-background"
                  size="xs"
                  type="button"
                  variant="ghost"
                  onClick={copyInstall}
                >
                  {copied ? <RiCheckLine /> : <RiFileCopyLine />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-background">
                {INSTALL_SNIPPET}
              </pre>
              <Separator className="bg-background/15" />
              <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-background/70">
                {`import { AuroraMesh } from "@/materials"`}
              </pre>
            </div>
          }
        />
      </MarketingSection>

      <MarketingSection>
        <MarketingSplit
          left={
            <div className="space-y-5">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Configurator
              </p>
              <h2 className="font-heading text-3xl font-light tracking-tight sm:text-4xl">
                Tune in the live preview
              </h2>
              <p className="max-w-[42ch] text-base leading-relaxed text-muted-foreground">
                Open any material, adjust props, and copy JSX — the surface is
                the product, not a PNG pack.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/materials/aurora-mesh" />}
                size="lg"
              >
                Open Aurora Mesh
                <RiArrowRightLine data-icon="inline-end" />
              </Button>
            </div>
          }
          right={
            <div className="relative aspect-[16/10] overflow-hidden bg-foreground lg:aspect-auto lg:min-h-[20rem]">
              {MATERIALS_CATALOG[0] ? (
                <MaterialPreview entry={MATERIALS_CATALOG[0]} />
              ) : null}
            </div>
          }
        />
      </MarketingSection>

      {/* —— Why Frameline —— */}
      <MarketingSection>
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
              <h3 className="font-heading text-base font-medium tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>

      {/* —— Pricing tease —— */}
      <MarketingSection>
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
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {tier.name}
              </p>
              <p className="font-heading text-3xl font-light tracking-tight sm:text-4xl">
                {tier.price}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tier.blurb}
              </p>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>

      {/* —— FAQ —— */}
      <MarketingSection>
        <MarketingSplit
          left={
            <div className="space-y-3">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                FAQ
              </p>
              <h2 className="font-heading text-3xl font-light tracking-tight sm:text-4xl">
                Before you install
              </h2>
              <p className="max-w-[36ch] text-base leading-relaxed text-muted-foreground">
                Short answers on ownership, tiers, and theming.
              </p>
            </div>
          }
          right={
            <Accordion>
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          }
        />
      </MarketingSection>

      {/* —— Closing CTA —— */}
      <MarketingSection>
        <div
          className={cn(
            "flex flex-col items-start gap-6 py-16 lg:py-20",
            marketingPadX,
          )}
        >
          <h2 className="max-w-[16ch] font-heading text-3xl font-light tracking-tight sm:text-4xl">
            Stop shipping the default AI look.
          </h2>
          <p className="max-w-[40ch] text-base leading-relaxed text-muted-foreground">
            Browse the catalog, install a free material, and put real surface
            under your next build.
          </p>
          <div className="flex flex-wrap gap-3">
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
      </MarketingSection>

      <MarketingFooter />
    </MarketingShell>
  );
}

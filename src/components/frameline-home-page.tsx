"use client";

import * as React from "react";
import Link from "next/link";
import { Dithering } from "@paper-design/shaders-react";
import {
  RiArrowRightLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AuroraMesh,
  GrainField,
  InkDither,
  MATERIALS_CATALOG,
  type MaterialCatalogEntry,
} from "@/materials";
import { cn } from "@/lib/utils";

const HERO_INK = "#3A58F0";
const HERO_PAPER = "#FFFFFF";

const INSTALL_SNIPPET = `npx shadcn@latest add @frameline/aurora-mesh`;

const USAGE_SCENES = [
  {
    slug: "aurora-mesh" as const,
    context: "Hero",
    title: "Marketing shell",
    body: "Full-bleed mesh behind a short headline and one CTA group.",
  },
  {
    slug: "ink-dither" as const,
    context: "Empty",
    title: "Empty / loading",
    body: "High-contrast dither for states that need presence without clutter.",
  },
  {
    slug: "grain-field" as const,
    context: "Auth",
    title: "Quiet surfaces",
    body: "Soft grain under cards, auth shells, and understated panels.",
  },
] as const;

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

function MaterialPreview({ entry }: { entry: MaterialCatalogEntry }) {
  const common = "absolute inset-0 h-full w-full";

  switch (entry.slug) {
    case "aurora-mesh":
      return <AuroraMesh className={common} forceStatic />;
    case "ink-dither":
      return <InkDither className={common} forceStatic />;
    case "grain-field":
      return <GrainField className={common} forceStatic />;
    default:
      return (
        <div
          className={common}
          style={{
            backgroundImage: `linear-gradient(135deg, ${entry.fallbackColors.join(", ")})`,
          }}
        />
      );
  }
}

function ScenePreview({ slug }: { slug: (typeof USAGE_SCENES)[number]["slug"] }) {
  const common = "absolute inset-0 h-full w-full";
  if (slug === "aurora-mesh") return <AuroraMesh className={common} forceStatic />;
  if (slug === "ink-dither") return <InkDither className={common} forceStatic />;
  return <GrainField className={common} forceStatic />;
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
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
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

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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

  return (
    <MarketingShell>
      {/* —— Hero —— */}
      <section className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-background">
        <MarketingNavbar />

        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl flex-col items-center border-b border-border pt-14 pb-10 text-center sm:pt-16 sm:pb-12 lg:pt-20",
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
              className="frameline-rise mx-auto max-w-[38ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Shippable surface — so you don’t ship the default AI look.
            </p>

            <div
              className="frameline-rise flex flex-wrap items-center justify-center gap-3 pt-2"
              style={{ animationDelay: "260ms" }}
            >
              <Button
                className="transition-transform duration-300 ease-[var(--ease-emil)] hover:-translate-y-0.5"
                nativeButton={false}
                render={<Link href="/materials" />}
                size="lg"
              >
                Browse materials
              </Button>
              <Button
                className="transition-transform duration-300 ease-[var(--ease-emil)] hover:-translate-y-0.5"
                nativeButton={false}
                render={<Link href="/pricing" />}
                size="lg"
                variant="secondary"
              >
                Pricing
              </Button>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="frameline-material-in relative mt-auto min-h-[52dvh] flex-1 overflow-hidden"
          style={{ backgroundColor: HERO_PAPER }}
        >
          <Dithering
            className="absolute inset-0 h-full w-full"
            colorBack={HERO_PAPER}
            colorFront={HERO_INK}
            scale={0.85}
            shape="swirl"
            size={2.5}
            speed={reducedMotion ? 0 : 0.4}
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
            }}
            type="4x4"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        </div>
      </section>

      {/* —— Value props —— */}
      <MarketingSection>
        <MarketingSectionHeader>
          <SectionIntro
            description="Gradients, textures, and motion — typed React components, token-bound, production-safe."
            eyebrow="Why Frameline"
            title="Surface that installs as code"
          />
        </MarketingSectionHeader>

        <MarketingRuledGrid>
          {[
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
          ].map((item) => (
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

      {/* —— Catalog —— */}
      <MarketingSection>
        <MarketingSectionHeader>
          <SectionIntro
            action={
              <Button
                nativeButton={false}
                render={<Link href="/materials" />}
                variant="outline"
              >
                Full catalog
                <RiArrowRightLine data-icon="inline-end" />
              </Button>
            }
            description="Live materials from the catalog. Open any one to tune props and copy JSX."
            eyebrow="Catalog"
            title="Materials you can ship"
          />
        </MarketingSectionHeader>

        <MarketingRuledGrid>
          {MATERIALS_CATALOG.map((entry) => (
            <MarketingRuledCell key={entry.slug} className="p-0 sm:p-0 lg:p-0">
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
                    <Badge variant="secondary">
                      {entry.tier === "free" ? "Free" : "Paid"}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                  <p className="pt-1 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                    {entry.useContexts.join(" · ")}
                  </p>
                </div>
              </Link>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>

      {/* —— Inspo / in use —— */}
      <MarketingSection>
        <MarketingSectionHeader>
          <SectionIntro
            description="Drop materials into real product surfaces — heroes, empty states, and quiet shells."
            eyebrow="Inspiration"
            title="How materials land in product"
          />
        </MarketingSectionHeader>

        <MarketingRuledGrid>
          {USAGE_SCENES.map((scene) => (
            <MarketingRuledCell key={scene.slug} className="space-y-5 p-0 sm:p-0 lg:p-0">
              <div className="relative aspect-[4/5] overflow-hidden border-b border-border sm:aspect-[5/6]">
                <ScenePreview slug={scene.slug} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                {scene.slug === "aurora-mesh" ? (
                  <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
                    <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                      Describe it. See it. Ship it.
                    </p>
                    <div className="flex gap-2">
                      <span className="inline-flex h-8 items-center bg-primary px-3 text-[0.625rem] font-semibold tracking-widest text-primary-foreground uppercase">
                        Get started
                      </span>
                      <span className="inline-flex h-8 items-center bg-background/80 px-3 text-[0.625rem] font-semibold tracking-widest text-foreground uppercase backdrop-blur-sm">
                        Docs
                      </span>
                    </div>
                  </div>
                ) : null}

                {scene.slug === "ink-dither" ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full max-w-[14rem] space-y-3 border border-border bg-background/95 p-5 text-center backdrop-blur-md">
                      <p className="font-heading text-sm font-semibold tracking-tight">
                        No runs yet
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Kick off a workflow to see status here.
                      </p>
                      <span className="inline-flex h-8 w-full items-center justify-center bg-primary text-[0.625rem] font-semibold tracking-widest text-primary-foreground uppercase">
                        New run
                      </span>
                    </div>
                  </div>
                ) : null}

                {scene.slug === "grain-field" ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full max-w-[15rem] space-y-4 border border-border bg-background/92 p-5 backdrop-blur-md">
                      <p className="font-heading text-sm font-semibold tracking-tight">
                        Sign in
                      </p>
                      <div className="space-y-2">
                        <div className="h-9 border-b border-input bg-transparent" />
                        <div className="h-9 border-b border-input bg-transparent" />
                      </div>
                      <span className="inline-flex h-9 w-full items-center justify-center bg-primary text-[0.625rem] font-semibold tracking-widest text-primary-foreground uppercase">
                        Continue
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 px-6 pb-8 sm:px-8 lg:px-10">
                <Badge variant="secondary">{scene.context}</Badge>
                <h3 className="font-heading text-base font-medium tracking-tight">
                  {scene.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {scene.body}
                </p>
                <Link
                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                  href={`/materials/${scene.slug}`}
                >
                  Open {scene.slug}
                  <RiArrowRightLine className="size-3.5" />
                </Link>
              </div>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>

      {/* —— Install —— */}
      <MarketingSection>
        <MarketingSplit
          left={
            <div className="space-y-5">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Install
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                One command. Source in your repo.
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
                {`import { AuroraMesh } from "@/components/ui/aurora-mesh"`}
              </pre>
            </div>
          }
        />
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
              <p className="font-heading text-3xl font-semibold tracking-tight">
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
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
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
          <h2 className="max-w-[16ch] font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
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
              render={<Link href="/docs/installation" />}
              size="lg"
              variant="outline"
            >
              Read the docs
            </Button>
          </div>
        </div>
      </MarketingSection>

      <MarketingFooter />
    </MarketingShell>
  );
}

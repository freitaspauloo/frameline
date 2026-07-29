"use client";

import * as React from "react";
import { MeshGradient } from "@paper-design/shaders-react";

import {
  HeroDitheringActions,
  HeroDitheringBadges,
  HeroDitheringContainer,
  HeroDitheringContent,
  HeroDitheringDescription,
  HeroDitheringHeading,
  HeroDitheringMobileVisual,
  HeroDitheringRoot,
  HeroDitheringVisual,
  NextjsIcon,
} from "@/components/ui/hero-dithering";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  IconAgents,
  IconBell,
  IconBolt,
  IconBranch,
  IconCheck,
  IconChevron,
  IconClose,
  IconIntegrations,
  IconLogs,
  IconMore,
  IconPlus,
  IconRuns,
  IconSearch,
  IconSettings,
  IconSparkle,
  IconTemplates,
  Logo01,
  Logo02,
  LogoLockupHorizontal,
  LogoMark,
  PixelDiamond,
  RelayButton,
  RelayCommandBar,
  RelayNode,
  RelayStatusPill,
} from "@/components/relay-ui";
import { cn } from "@/lib/utils";

function FigmaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" {...props}>
      <title>Figma</title>
      <path
        d="M8 24a4 4 0 004-4v-4H8a4 4 0 000 8zM4 12a4 4 0 014-4h4v8H8a4 4 0 01-4-4zM4 4a4 4 0 014-4h4v8H8a4 4 0 01-4-4zM16 0h-4v8h4a4 4 0 100-8zM12 12h4a4 4 0 110 8h-4v-8z"
        fill="currentColor"
      />
    </svg>
  );
}

function TailwindIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" {...props}>
      <title>Tailwind CSS</title>
      <path
        d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zm-5 8c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 15.15 9.47 14 7 14z"
        fill="currentColor"
      />
    </svg>
  );
}

const heroContainerClassName =
  "relative z-10 mx-auto w-full max-w-7xl grid gap-6 px-6 pb-16 pt-8 sm:gap-8 sm:pb-20 lg:grid-cols-[1fr_minmax(320px,560px)] lg:items-center lg:gap-12 lg:px-8 lg:pb-24 xl:grid-cols-[1fr_1fr]";

/* -------------------------------------------------------------------------- */
/* Scroll reveal — IntersectionObserver, CSS-driven, reduced-motion safe.      */
/* -------------------------------------------------------------------------- */

function useRevealEnabled() {
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-enabled");
    return () => root.classList.remove("reveal-enabled");
  }, []);
}

type RevealProps<T extends React.ElementType> = {
  as?: T;
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function Reveal<T extends React.ElementType = "div">({
  as,
  delay = 0,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const Comp = (as ?? "div") as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.setAttribute("data-reveal", "in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.setAttribute("data-reveal", "in");
            observer.unobserve(node);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Comp
      ref={ref}
      className={className}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared section furniture                                                    */
/* -------------------------------------------------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-relay-blue">
      <span aria-hidden className="size-1.5 rounded-full bg-relay-blue" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="max-w-2xl text-pretty text-3xl font-semibold tracking-[-0.03em] text-relay-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={120}>
          <p className="max-w-[60ch] text-pretty text-base leading-relaxed text-relay-secondary sm:text-lg">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section: library manifest (#assets)                                         */
/* -------------------------------------------------------------------------- */

const libraryCategories = [
  {
    index: "01",
    name: "Tokens",
    detail: "Color, type, spacing, radius, and elevation — one synced source.",
    count: "40+ variables",
  },
  {
    index: "02",
    name: "Components",
    detail: "Buttons, inputs, nodes, pills, and prompt bars, mapped to Figma.",
    count: "14 components",
  },
  {
    index: "03",
    name: "Icons",
    detail: "A quiet, consistent 20px set drawn on the same grid.",
    count: "16 icons",
  },
  {
    index: "04",
    name: "Patterns",
    detail: "Command bars, navigation, and empty states — composed, not guessed.",
    count: "9 patterns",
  },
  {
    index: "05",
    name: "Materials",
    detail: "Shaders and gradients that render live in the browser.",
    count: "Animated",
  },
] as const;

function LibrarySection() {
  return (
    <section
      className="border-t border-relay-border bg-background"
      data-relay-anchor
      id="assets"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-8 lg:py-28">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            eyebrow="The library"
            lead="Tokens, components, icons, patterns, and live materials — each synced from Figma and shipped as production code you can read."
            title={
              <>
                Everything you need to build{" "}
                <span className="text-relay-blue">the interface.</span>
              </>
            }
          />
        </div>

        <ul className="flex flex-col rounded-relay-lg border border-relay-border bg-relay-canvas">
          {libraryCategories.map((cat, i) => (
            <Reveal
              as="li"
              delay={i * 60}
              key={cat.name}
              className={cn(
                "group relative flex items-center gap-5 px-5 py-6 transition-colors duration-300 hover:bg-relay-panel sm:px-7",
                i !== libraryCategories.length - 1 && "border-b border-relay-border",
              )}
            >
              <span className="font-pixel-square text-sm text-relay-tertiary tabular-nums transition-colors duration-300 group-hover:text-relay-blue">
                {cat.index}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold tracking-tight text-relay-ink">
                    {cat.name}
                  </h3>
                  <span className="rounded-relay-sm bg-relay-muted px-2 py-0.5 text-xs font-medium text-relay-secondary">
                    {cat.count}
                  </span>
                </div>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-relay-secondary">
                  {cat.detail}
                </p>
              </div>
              <IconChevron
                aria-hidden
                className="size-5 shrink-0 text-relay-tertiary transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-relay-blue"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section: live materials (MeshGradient home)                                 */
/* -------------------------------------------------------------------------- */

const materialSwatches = [
  { hex: "#E3FFFE", name: "mint" },
  { hex: "#C5F0FF", name: "sky" },
  { hex: "#FF008D", name: "magenta" },
  { hex: "#B700FF", name: "violet" },
] as const;

function MaterialsSection() {
  return (
    <section className="border-t border-relay-border bg-relay-panel">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8 lg:py-28">
        <Reveal className="order-2 lg:order-1">
          <figure className="overflow-hidden rounded-relay-lg border border-relay-border bg-relay-white shadow-relay-sm">
            <figcaption className="flex items-center justify-between gap-3 border-b border-relay-border px-4 py-3">
              <span className="font-mono text-[13px] text-relay-secondary">
                aurora.material.tsx
              </span>
              <RelayStatusPill label="Live" />
            </figcaption>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-relay-ink">
              <MeshGradient
                colors={["#E3FFFE", "#C5F0FF", "#FF008D", "#B700FF"]}
                distortion={0.8}
                scale={0.69}
                speed={0.47}
                style={{
                  position: "absolute",
                  inset: 0,
                  height: "100%",
                  width: "100%",
                }}
                swirl={0.5}
              />
            </div>
            <div className="flex items-center gap-2 border-t border-relay-border px-4 py-3">
              {materialSwatches.map((sw) => (
                <span
                  className="inline-flex items-center gap-1.5 rounded-relay-sm bg-relay-muted px-2 py-1"
                  key={sw.hex}
                >
                  <span
                    aria-hidden
                    className="size-3 rounded-[3px] ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: sw.hex }}
                  />
                  <span className="font-mono text-[11px] text-relay-secondary">
                    {sw.hex}
                  </span>
                </span>
              ))}
            </div>
          </figure>
        </Reveal>

        <div className="order-1 flex flex-col gap-5 lg:order-2">
          <SectionHeading
            eyebrow="Live materials"
            lead="Materials ship as components, not screenshots. Drop one in and it renders live in the browser — no video file, no exported PNG, just typed code that animates."
            title={
              <>
                Some assets are meant{" "}
                <span className="text-relay-blue">to move.</span>
              </>
            }
          />
          <Reveal delay={160}>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <RelayButton
                className="h-11 px-6 text-sm"
                nativeButton={false}
                render={<a href="#components" />}
              >
                See the components
              </RelayButton>
              <span className="text-sm text-relay-tertiary">
                Renders at 60fps · respects reduced motion
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section: component specimen sheet (#components)                             */
/* -------------------------------------------------------------------------- */

const showcaseIcons = [
  IconAgents,
  IconTemplates,
  IconRuns,
  IconIntegrations,
  IconLogs,
  IconSettings,
  IconSearch,
  IconPlus,
  IconSparkle,
  IconBolt,
  IconBranch,
  IconChevron,
  IconCheck,
  IconMore,
  IconBell,
  IconClose,
];

function CellLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-relay-tertiary">
      {children}
    </span>
  );
}

function SpecimenCell({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 bg-background p-6 transition-colors duration-300 hover:bg-relay-panel sm:p-8",
        className,
      )}
    >
      <CellLabel>{label}</CellLabel>
      <div className="flex flex-1 flex-col items-start justify-center">
        {children}
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <section
      className="border-t border-relay-border bg-background"
      data-relay-anchor
      id="components"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Components"
          lead="Real specimens, rendered from the same code you'll ship. No mockups, no marketing gloss — this is the actual system."
          title="See every piece before you commit."
        />

        <Reveal className="mt-12" delay={80}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-relay-lg border border-relay-border bg-relay-border lg:grid-cols-6">
            <SpecimenCell className="col-span-2 lg:col-span-3" label="Brand / Logos">
              <div className="flex flex-wrap items-center gap-6">
                <Logo01 className="size-14" />
                <Logo02 className="size-14 ring-1 ring-relay-border" />
                <LogoMark className="size-10" />
                <LogoLockupHorizontal className="h-7" />
              </div>
            </SpecimenCell>

            <SpecimenCell className="col-span-2 lg:col-span-3" label="Fable / Pixel diamond">
              <div className="flex items-center gap-5">
                <PixelDiamond pixelSize={7} />
                <div className="flex flex-col gap-1">
                  <span className="font-pixel-circle text-sm text-relay-ink">
                    13 × 13 grid
                  </span>
                  <span className="text-sm text-relay-secondary">
                    Generated geometry, zero raster.
                  </span>
                </div>
              </div>
            </SpecimenCell>

            <SpecimenCell className="col-span-2 lg:col-span-4" label="Icons / 20px set">
              <div className="grid grid-cols-8 gap-x-4 gap-y-5 text-relay-ink">
                {showcaseIcons.map((Icon, i) => (
                  <Icon
                    className="size-5 text-relay-secondary transition-colors duration-200 hover:text-relay-blue"
                    key={i}
                  />
                ))}
              </div>
            </SpecimenCell>

            <SpecimenCell className="col-span-2 lg:col-span-2" label="Component / Button">
              <div className="flex flex-wrap items-center gap-2.5">
                <RelayButton variant="primary">Primary</RelayButton>
                <RelayButton variant="secondary">Secondary</RelayButton>
                <RelayButton variant="ghost">Ghost</RelayButton>
              </div>
            </SpecimenCell>

            <SpecimenCell className="col-span-2 lg:col-span-3" label="System / Node">
              <div className="flex w-full flex-col gap-3">
                <RelayNode
                  detail="ai · classify intent"
                  icon={<IconSparkle className="size-[18px]" />}
                  title="Classify request"
                  type="ai"
                />
                <RelayStatusPill label="Running" />
              </div>
            </SpecimenCell>

            <SpecimenCell className="col-span-2 lg:col-span-3" label="Pattern / Command bar">
              <RelayCommandBar className="max-w-none" />
            </SpecimenCell>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section: how it works (#docs)                                               */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    index: "01",
    title: "Browse",
    body: "Open the library and filter by tokens, components, or patterns. Everything is searchable.",
  },
  {
    index: "02",
    title: "Copy",
    body: "Grab typed, dependency-light code. It reads the same in your editor as it does here.",
  },
  {
    index: "03",
    title: "Ship",
    body: "Paste into your app. It matches your system on the first try — no reconciliation pass.",
  },
] as const;

function HowItWorksSection() {
  return (
    <section
      className="border-t border-relay-border bg-relay-panel"
      data-relay-anchor
      id="docs"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Browse. Copy. Ship."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-relay-lg border border-relay-border bg-relay-border md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal
              className="flex flex-col gap-4 bg-background p-7 sm:p-8"
              delay={i * 90}
              key={step.index}
            >
              <span className="font-pixel-square text-2xl text-relay-blue tabular-nums">
                {step.index}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-relay-ink">
                {step.title}
              </h3>
              <p className="max-w-[42ch] text-pretty text-sm leading-relaxed text-relay-secondary">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section: final CTA                                                          */
/* -------------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section className="border-t border-relay-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[calc(var(--relay-radius-lg)+6px)] bg-relay-blue px-8 py-16 text-center sm:px-16 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.22), transparent 60%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-6">
              <h2 className="max-w-2xl text-pretty font-pixel-square text-2xl leading-[1.15] text-relay-white sm:text-4xl">
                Assets, ready when you are.
              </h2>
              <p className="max-w-[52ch] text-pretty text-base text-relay-white/80 sm:text-lg">
                Copy, paste, and ship polished product UI today. Synced from
                Figma, built for design engineers.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <RelayButton
                  className="h-11 bg-relay-white px-7 text-sm text-relay-ink hover:bg-relay-white/90"
                  nativeButton={false}
                  render={<a href="#assets" />}
                >
                  Browse the library
                </RelayButton>
                <RelayButton
                  className="h-11 border-white/25 bg-transparent px-7 text-sm text-relay-white hover:bg-white/10"
                  nativeButton={false}
                  render={<a href="#docs" />}
                  variant="secondary"
                >
                  Read the docs
                </RelayButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

const footerLinks = [
  { href: "#assets", label: "Assets" },
  { href: "#components", label: "Components" },
  { href: "#docs", label: "Docs" },
];

function SiteFooter() {
  return (
    <footer className="border-t border-relay-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <LogoLockupHorizontal className="h-6" />
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              className="text-sm text-relay-secondary transition-colors hover:text-relay-ink"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <span className="text-xs text-relay-tertiary">
          Synced from Figma · © {new Date().getFullYear()} Relay
        </span>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export function AssetsLandingPage() {
  useRevealEnabled();

  return (
    <div className="min-h-screen bg-background text-relay-ink">
      <MarketingNavbar />

      <main>
        <HeroDitheringRoot
          className="min-h-[calc(100vh-4rem)] pb-28 lg:pb-0"
          ctaProps={{
            href: "#assets",
            label: "Browse the library",
            target: "_self",
            rel: undefined,
            buttonClassName: "h-11 px-8 text-base",
          }}
          description={
            <>
              Production-ready tokens, components, and patterns for design
              engineers shipping polished product UI. Synced from Figma, built
              with{" "}
              <span className="font-medium tracking-tight">Next.js</span> and{" "}
              <span className="font-medium tracking-tight">Tailwind</span>.
              <span className="hidden sm:inline">
                {" "}
                Copy, paste, and ship faster.
              </span>
            </>
          }
          desktopShaderProps={{
            colorFront: "#2D6BFF",
            scale: 0.75,
            speed: 0.85,
          }}
          mobileShaderProps={{
            colorFront: "#2D6BFF",
            speed: 0.7,
          }}
          srTitle="Assets for design engineers"
          subtitle="Design Engineers"
          title={<span className="font-pixel-square">Assets for</span>}
          techStack={[
            { name: "Figma", version: "synced", icon: FigmaIcon },
            { name: "Next.js", version: "v16", icon: NextjsIcon },
            { name: "Tailwind", version: "v4", icon: TailwindIcon },
          ]}
        >
          <HeroDitheringContainer className={heroContainerClassName}>
            <HeroDitheringContent>
              <HeroDitheringHeading />
              <HeroDitheringDescription />
              <HeroDitheringActions />
              <div
                className="flex justify-center lg:justify-start"
                data-slot="hero-dithering-badges-wrap"
              >
                <HeroDitheringBadges />
              </div>
            </HeroDitheringContent>
            <HeroDitheringVisual />
          </HeroDitheringContainer>
          <HeroDitheringMobileVisual />
        </HeroDitheringRoot>

        <LibrarySection />
        <MaterialsSection />
        <ComponentsSection />
        <HowItWorksSection />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}

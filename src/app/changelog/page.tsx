import type { Metadata } from "next";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
} from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What shipped in Frameline — materials, docs, and storefront.",
};

const ENTRIES = [
  {
    date: "2026-08-03",
    title: "CSS tier + demo publish",
    items: [
      "Eight CSS-only materials: Sera Wash, Stone Band, Blue Signal, Dusk Veil, Grid Ghost, Stripe Quiet, Glow Rim, Fog Layer",
      "Catalog at 40 materials — CSS tier with honest negligible-GPU perf notes",
      "Admin demo publish: `.data/catalog-overrides.json` for title/description/tier/status without mutating source catalog",
    ],
  },
  {
    date: "2026-08-03",
    title: "Catalog depth drop",
    items: [
      "Twelve new materials: Water Sheet, Still Mesh, Paper Tooth, Gem Haze, CMYK Halftone, Radial Still, Mesh Still, Aurora Dusk, Ink Dither Soft, Grain Night, Wave Ribbon, Voronoi Soft",
      "Collections: Still gradients, Nocturnal; Signal systems expanded with free static fields",
      "Heatmap / FlutedGlass skipped (mandatory image) — Still Mesh and Gem Haze stand in",
    ],
  },
  {
    date: "2026-08-03",
    title: "Storefront foundation",
    items: [
      "Catalog filters: search, use context, free/paid, sort",
      "Configurator URL deep-links and play/pause",
      "Docs suite: theming, accessibility, performance, examples, licensing",
      "Legal pages, sitemap/robots, waitlist capture",
      "Demo checkout, account entitlements, admin shell",
      "Six new materials: Neuro Veil, Tide Wave, Cell Voronoi, Ink Swirl, Signal Dots, Ember Warp",
      "Six more materials: Halo Rays, Ink Metaballs, Smoke Ring, Simplex Field, Halftone Signal, Liquid Chrome",
    ],
  },
  {
    date: "2026-07",
    title: "Seed catalog",
    items: [
      "Aurora Mesh, Ink Dither, Grain Field",
      "Live WebGL configurator with JSX copy",
      "Collections and pricing tiers",
    ],
  },
] as const;

export default function ChangelogPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Ship notes for the catalog and the storefront. No fluff."
          eyebrow="Changelog"
          title="What changed"
        />
        <div className="divide-y divide-border border-t border-border">
          {ENTRIES.map((entry) => (
            <article className={marketingPad} key={entry.date}>
              <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                {entry.date}
              </p>
              <h2 className="mt-3 font-heading text-xl font-medium tracking-tight">
                {entry.title}
              </h2>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {entry.items.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span aria-hidden className="text-foreground">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { listScreens } from "@/screens/catalog";

export const metadata: Metadata = {
  title: "Screens",
  description:
    "Cinematic screen templates — copy the prompt or the real component source.",
};

export default function ScreensIndexPage() {
  const screens = listScreens();

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Full-page heroes you can drop into any app. One free copy per UTC day, then $9 for unlimited."
          eyebrow="Screens"
          title="Screen templates"
        />

        <MarketingRuledGrid cols={2}>
          {screens.map((screen) => (
            <MarketingRuledCell key={screen.slug} className="p-0 sm:p-0 lg:p-0">
              <Link
                className="group block transition-colors hover:bg-muted/40"
                href={`/screens/${screen.slug}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#140810]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-90"
                    src="/screens/spaceman-moon/poster.png"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[#d600bf] mix-blend-color"
                  />
                </div>
                <div className="space-y-2 border-t border-border p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-lg font-medium tracking-tight sm:text-xl">
                      {screen.title}
                    </h2>
                    <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                      {screen.priceLabel}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {screen.blurb}
                  </p>
                </div>
              </Link>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

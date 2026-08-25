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
import { screenPosterNeedsMagentaTint } from "@/screens/poster-tint";
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
          description="Full-page heroes you can drop into any app. One free copy per week, then $9 for unlimited."
          eyebrow="Screens"
          title="Screen templates"
        />

        <MarketingRuledGrid cols={2}>
          {screens.map((screen) => (
            <MarketingRuledCell key={screen.slug} className="p-0 sm:p-0 lg:p-0">
              <Link
                className="group block transition-colors hover:bg-muted/40"
                href={`/screens/${screen.slug}`}
                aria-label={screen.title}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#140810]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-90"
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
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

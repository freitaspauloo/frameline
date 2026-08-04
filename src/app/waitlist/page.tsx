import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { WaitlistDemos } from "@/components/waitlist-demos";
import { WaitlistForm } from "@/components/waitlist-form";
import { MATERIALS_CATALOG } from "@/materials";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Join the Frameline waitlist — live material demos, launch notes on licensing, and registry access.",
};

const DEMO_SLUGS = [
  "aurora-mesh",
  "neuro-veil",
  "signal-dots",
  "sera-wash",
  "paper-tooth",
  "radial-still",
] as const;

export default function WaitlistPage() {
  const demos = DEMO_SLUGS.map((slug) =>
    MATERIALS_CATALOG.find((m) => m.slug === slug),
  ).filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description="Typed React materials with a live configurator and clear licenses. Preview a few surfaces, then leave your email — we write when a new surface ships or pricing changes."
          eyebrow="Waitlist"
          title="Get launch notes"
        />
        <MarketingPad className="mx-auto max-w-md space-y-8 py-10 text-center lg:py-14">
          <WaitlistForm className="text-left" source="waitlist" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Prefer to browse first?{" "}
            <Link
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              href="/free"
            >
              Free materials
            </Link>{" "}
            install without an account.
          </p>
        </MarketingPad>
      </MarketingSection>

      {demos.length > 0 ? (
        <MarketingSection>
          <MarketingPad className="space-y-3 border-t border-border pt-12 pb-8 lg:pt-16">
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Live demos
            </p>
            <h2 className="font-instrument text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.02em] text-foreground">
              Surfaces worth waiting for
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Free SKUs at the same craft bar as paid — open any material to
              tune props live, then install with one command.
            </p>
          </MarketingPad>
          <WaitlistDemos materials={demos} />
        </MarketingSection>
      ) : null}

      <MarketingFooter />
    </MarketingShell>
  );
}

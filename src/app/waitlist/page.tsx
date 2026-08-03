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
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Join the Frameline waitlist — launch notes on materials, licensing, and registry access.",
};

export default function WaitlistPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description="Typed React materials with a live configurator and clear licenses. We write when a new surface ships or pricing changes — no spam."
          eyebrow="Waitlist"
          title="Get launch notes"
        />
        <MarketingPad className="mx-auto max-w-md space-y-8 py-14 text-center lg:py-20">
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
      <MarketingFooter />
    </MarketingShell>
  );
}

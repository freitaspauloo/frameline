import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { LICENSE_PLANS } from "@/lib/license-plans";

export const metadata: Metadata = {
  title: "License",
  description:
    "Plain-language Free, Personal, and Team rights for Frameline materials. Full terms pin per order.",
};

export default function LicensePage() {
  const tiers = LICENSE_PLANS.filter((p) => p.key !== "static");

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description={
            <>
              Human summaries at the point of sale. Authoritative docs live in{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/docs/licensing"
              >
                Licensing
              </Link>
              . Full legal terms are version-pinned on every order — later
              changes never apply retroactively.
            </>
          }
          eyebrow="License"
          title="What you can do"
        />

        <MarketingRuledGrid>
          {tiers.map((plan) => (
            <MarketingRuledCell key={plan.key} className="space-y-4">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {plan.name}
              </p>
              <p className="font-instrument text-4xl leading-none font-normal tracking-[-0.02em]">
                {plan.priceLabel}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {plan.summary}
              </p>
              <div className="space-y-3 border-t border-border pt-4 text-sm">
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Permitted
                </p>
                <ul className="space-y-2 text-foreground">
                  {plan.permitted.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="pt-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Not permitted
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  {plan.notPermitted.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>

        <MarketingPad className="space-y-4 border-t border-border py-12">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Static export (~$19) is a separate entry SKU for decks, social, and
            non-React use. See{" "}
            <Link
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              href="/docs/licensing"
            >
              /docs/licensing
            </Link>{" "}
            and{" "}
            <Link
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              href="/pricing"
            >
              pricing
            </Link>
            .
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Universal rule across every tier: do not redistribute or resell
            source packages, including inside templates, starter kits, or asset
            bundles. This page is a plain-language guide — the license version
            attached to your order is the binding record.
          </p>
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

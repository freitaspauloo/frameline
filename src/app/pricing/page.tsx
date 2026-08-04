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
import { Button } from "@/components/ui/button";
import { PricingBuyLink } from "@/components/pricing-buy-link";
import { WaitlistForm } from "@/components/waitlist-form";
import { LICENSE_PLANS } from "@/lib/license-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free, Static ($19), Personal ($99), and Team ($299) licenses for Frameline materials — clear commercial rights, one-time purchase.",
};

const TIER_CTAS = {
  free: {
    kind: "link" as const,
    href: "/free",
    label: "Browse free",
    primary: false,
  },
  static: {
    kind: "buy" as const,
    plan: "static" as const,
    href: "/checkout?plan=static",
    label: "Buy Static",
    primary: true,
  },
  personal: {
    kind: "buy" as const,
    plan: "personal" as const,
    href: "/checkout?plan=personal",
    label: "Buy Personal",
    primary: true,
  },
  team: {
    kind: "buy" as const,
    plan: "team" as const,
    href: "/checkout?plan=team",
    label: "Buy Team",
    primary: true,
  },
} as const;

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ material?: string }>;
}) {
  const { material } = await searchParams;

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description={
            <>
              Free to evaluate. Paid when you need signature depth and clear
              commercial rights.
              {material ? (
                <>
                  {" "}
                  Continuing from{" "}
                  <Link
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    href={`/materials/${material}`}
                  >
                    {material}
                  </Link>
                  .
                </>
              ) : null}
            </>
          }
          eyebrow="Pricing"
          title="Choose a license"
        />

        <MarketingRuledGrid className="lg:grid-cols-2 xl:grid-cols-4">
          {LICENSE_PLANS.map((tier) => {
            const cta = TIER_CTAS[tier.key];
            return (
              <MarketingRuledCell key={tier.key} className="flex flex-col">
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  {tier.name}
                </p>
                <p className="mt-5 font-instrument text-5xl leading-none font-normal tracking-[-0.02em]">
                  {tier.priceLabel}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {tier.summary}
                </p>
                <div className="mt-8 space-y-5 text-sm">
                  <div className="space-y-3">
                    <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                      Permitted
                    </p>
                    <ul className="space-y-2 text-foreground">
                      {tier.permitted.map((item) => (
                        <li className="flex gap-2" key={item}>
                          <span aria-hidden className="text-[#3A58F0]">
                            +
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3 border-t border-border pt-4">
                    <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                      Not permitted
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      {tier.notPermitted.map((item) => (
                        <li className="flex gap-2" key={item}>
                          <span aria-hidden className="text-muted-foreground">
                            −
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-auto pt-10">
                  {cta.kind === "buy" ? (
                    <PricingBuyLink
                      href={
                        material
                          ? `${cta.href}&material=${material}`
                          : cta.href
                      }
                      label={cta.label}
                      material={material}
                      plan={cta.plan}
                      primary={cta.primary}
                    />
                  ) : (
                    <Button
                      className="w-full"
                      nativeButton={false}
                      render={<Link href={cta.href} />}
                      size="lg"
                      variant={cta.primary ? "default" : "outline"}
                    >
                      {cta.label}
                    </Button>
                  )}
                </div>
              </MarketingRuledCell>
            );
          })}
        </MarketingRuledGrid>
      </MarketingSection>

      <MarketingSection>
        <MarketingPad className="mx-auto max-w-xl space-y-6 py-16 text-center lg:py-24">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Waitlist
          </p>
          <h2 className="font-instrument text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.02em] text-foreground">
            Get launch notes
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            New materials, pricing experiments, and registry access — no spam.
            Prefer a dedicated page?{" "}
            <Link
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              href="/waitlist"
            >
              /waitlist
            </Link>
            .
          </p>
          <WaitlistForm className="mx-auto max-w-md text-left" source="pricing" />
        </MarketingPad>
      </MarketingSection>

      <MarketingFooter />
    </MarketingShell>
  );
}

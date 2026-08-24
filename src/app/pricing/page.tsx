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
import { PricingBuyLink } from "@/components/pricing-buy-link";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/waitlist-form";
import { getPublicPricingPlans } from "@/lib/license-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free ($0) includes 1 copy per week. Screen is $9/mo, $49/y, or $150 lifetime for unlimited copies.",
};

const TIER_CTAS = {
  free: {
    kind: "browse" as const,
    href: "/free",
    label: "Browse free",
    primary: false,
  },
  screen: {
    kind: "subscribe" as const,
    plan: "screen" as const,
    label: "Sign monthly plan",
    primary: true,
  },
  screen_year: {
    kind: "subscribe" as const,
    plan: "screen_year" as const,
    label: "Sign yearly plan",
    primary: false,
  },
  screen_lifetime: {
    kind: "subscribe" as const,
    plan: "screen_lifetime" as const,
    label: "Buy lifetime",
    primary: false,
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
              $0 includes 1 free copy per week. Screen is $9/mo, $49/y, or
              $150 lifetime for unlimited copies.
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

        <MarketingRuledGrid className="md:grid-cols-2 lg:grid-cols-4">
          {getPublicPricingPlans()
            .filter(
              (tier): tier is (typeof tier) & { key: keyof typeof TIER_CTAS } =>
                tier.key in TIER_CTAS,
            )
            .map((tier) => {
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
                <div className="mt-auto space-y-6 pt-10">
                  {cta.kind === "subscribe" ? (
                    <PricingBuyLink
                      href={
                        material
                          ? `/checkout?plan=${cta.plan}&material=${encodeURIComponent(material)}`
                          : `/checkout?plan=${cta.plan}`
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

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

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free, Static ($19), Personal ($99), and Team ($299) licenses for Frameline materials — clear commercial rights, one-time purchase.",
};

const TIERS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Excellent free materials. Same craft bar as paid.",
    features: ["Free SKUs", "Copy / CLI install", "Commercial use"],
    cta: {
      kind: "link" as const,
      href: "/free",
      label: "Browse free",
      primary: false,
    },
  },
  {
    name: "Static",
    price: "$19",
    blurb: "Still exports for decks, social, and non-React surfaces.",
    features: [
      "Static frames / loops",
      "Decks, social, video",
      "No registry required",
    ],
    cta: {
      kind: "buy" as const,
      plan: "static" as const,
      href: "/checkout?plan=static",
      label: "Buy Static",
      primary: true,
    },
  },
  {
    name: "Personal",
    price: "$99",
    blurb: "All personal materials · commercial rights · updates.",
    features: [
      "All personal SKUs",
      "Registry access",
      "Commercial projects",
      "Email receipt + account",
    ],
    cta: {
      kind: "buy" as const,
      plan: "personal" as const,
      href: "/checkout?plan=personal",
      label: "Buy Personal",
      primary: true,
    },
  },
  {
    name: "Team",
    price: "$299",
    blurb: "Client-work rights · seats · invoice-ready.",
    features: [
      "Everything in Personal",
      "Client deliverables",
      "Multi-seat clarity",
      "Priority support",
    ],
    cta: {
      kind: "buy" as const,
      plan: "team" as const,
      href: "/checkout?plan=team",
      label: "Buy Team",
      primary: true,
    },
  },
] as const;

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
          {TIERS.map((tier) => (
            <MarketingRuledCell key={tier.name} className="flex flex-col">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {tier.name}
              </p>
              <p className="mt-5 font-instrument text-5xl leading-none font-normal tracking-[-0.02em]">
                {tier.price}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tier.blurb}
              </p>
              <ul className="mt-8 space-y-3 text-sm text-foreground">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0"
                  >
                    <span className="text-[#3A58F0]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                {tier.cta.kind === "buy" ? (
                  <PricingBuyLink
                    href={
                      material
                        ? `${tier.cta.href}&material=${material}`
                        : tier.cta.href
                    }
                    label={tier.cta.label}
                    material={material}
                    plan={tier.cta.plan}
                    primary={tier.cta.primary}
                  />
                ) : (
                  <Button
                    className="w-full"
                    nativeButton={false}
                    render={<Link href={tier.cta.href} />}
                    size="lg"
                    variant={tier.cta.primary ? "default" : "outline"}
                  >
                    {tier.cta.label}
                  </Button>
                )}
              </div>
            </MarketingRuledCell>
          ))}
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

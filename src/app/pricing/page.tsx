import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingSectionHeader,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Excellent free materials. Same craft bar as paid.",
    features: ["Free SKUs", "Copy / CLI install", "Commercial use"],
    cta: { href: "/materials", label: "Browse free", primary: false },
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
    cta: { href: "/checkout?plan=personal", label: "Buy Personal", primary: true },
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
    cta: { href: "/checkout?plan=team", label: "Buy Team", primary: true },
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
        <MarketingSectionHeader className="text-center">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Pricing
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose a license
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
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
          </p>
        </MarketingSectionHeader>

        <MarketingRuledGrid>
          {TIERS.map((tier) => (
            <MarketingRuledCell
              key={tier.name}
              className="flex flex-col"
            >
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {tier.name}
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold tracking-tight">
                {tier.price}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tier.blurb}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-foreground">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 border-t border-border pt-2 first:border-t-0 first:pt-0">
                    <span className="text-primary">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link
                      href={
                        material && tier.cta.primary
                          ? `${tier.cta.href}&material=${material}`
                          : tier.cta.href
                      }
                    />
                  }
                  variant={tier.cta.primary ? "default" : "outline"}
                >
                  {tier.cta.label}
                </Button>
              </div>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

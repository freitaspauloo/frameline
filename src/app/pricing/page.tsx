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

        <MarketingRuledGrid>
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
                  size="lg"
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

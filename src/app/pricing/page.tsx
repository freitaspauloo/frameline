import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";

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
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-relay-secondary">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose a license
          </h1>
          <p className="mt-4 text-base text-relay-secondary">
            Free to evaluate. Paid when you need signature depth and clear
            commercial rights.
            {material ? (
              <>
                {" "}
                Continuing from{" "}
                <Link
                  className="text-relay-blue hover:text-relay-blue-deep"
                  href={`/materials/${material}`}
                >
                  {material}
                </Link>
                .
              </>
            ) : null}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              className="flex flex-col rounded-relay-lg border border-relay-border bg-relay-panel p-6"
              key={tier.name}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-relay-secondary">
                {tier.name}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {tier.price}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-relay-secondary">
                {tier.blurb}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-relay-ink">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-relay-blue">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <RelayButton
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
                  variant={tier.cta.primary ? "primary" : "secondary"}
                >
                  {tier.cta.label}
                </RelayButton>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

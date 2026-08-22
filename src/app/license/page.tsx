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
import {
  getPublicPricingPlans,
  LICENSE_PLAN_VERSION,
} from "@/lib/license-plans";

export const metadata: Metadata = {
  title: "License",
  description:
    "Plain-language Free ($0, 1 copy per week) and Screen ($9) rights for Frameline. Full terms pin per order.",
};

export default function LicensePage() {
  const tiers = getPublicPricingPlans();

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

        <MarketingPad className="space-y-3 border-t border-border py-8">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            License version
          </p>
          <p className="font-mono text-sm text-foreground">
            {LICENSE_PLAN_VERSION}
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Checkout and fulfillment record this version with your order. If we
            revise the plans later, your purchase keeps the rights you bought
            under — see{" "}
            <Link
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              href="/docs/licensing"
            >
              /docs/licensing
            </Link>
            .
          </p>
        </MarketingPad>

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
                    <li className="flex gap-2" key={item}>
                      <span aria-hidden className="text-muted-foreground">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Not permitted
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  {plan.notPermitted.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span aria-hidden>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>

        <MarketingPad className="space-y-6 border-t border-border py-12">
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-medium tracking-tight text-foreground">
              Quick comparison
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Free is $0 with 1 copy per week. Screen is $9 for unlimited
              prompt + code copies of one template. Every tier forbids
              redistributing source packages.
            </p>
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  License tier comparison for Free and Screen
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 font-semibold text-foreground" scope="col">
                      Topic
                    </th>
                    {tiers.map((plan) => (
                      <th
                        className="px-4 py-3 font-semibold text-foreground"
                        key={plan.key}
                        scope="col"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <th
                      className="px-4 py-3 font-medium text-muted-foreground"
                      scope="row"
                    >
                      Price
                    </th>
                    {tiers.map((plan) => (
                      <td className="px-4 py-3 text-foreground" key={plan.key}>
                        {plan.priceLabel}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <th
                      className="px-4 py-3 font-medium text-muted-foreground"
                      scope="row"
                    >
                      Who it fits
                    </th>
                    {tiers.map((plan) => (
                      <td
                        className="px-4 py-3 text-muted-foreground"
                        key={plan.key}
                      >
                        {plan.summary}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border align-top">
                    <th
                      className="px-4 py-3 font-medium text-muted-foreground"
                      scope="row"
                    >
                      Permitted
                    </th>
                    {tiers.map((plan) => (
                      <td className="px-4 py-3 text-foreground" key={plan.key}>
                        <ul className="space-y-1.5">
                          {plan.permitted.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr className="align-top">
                    <th
                      className="px-4 py-3 font-medium text-muted-foreground"
                      scope="row"
                    >
                      Not permitted
                    </th>
                    {tiers.map((plan) => (
                      <td
                        className="px-4 py-3 text-muted-foreground"
                        key={plan.key}
                      >
                        <ul className="space-y-1.5">
                          {plan.notPermitted.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Screen ($9) is a one-time unlock for unlimited copies of a single
            template. See{" "}
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
            bundles. This page is a plain-language guide — license version{" "}
            <span className="font-mono text-foreground">
              {LICENSE_PLAN_VERSION}
            </span>{" "}
            attached to your order is the binding record.
          </p>
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

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

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Short terms of use for the Frameline storefront — browsing, demos, and purchases.",
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Terms for using the Frameline storefront. Material licenses are separate and version-pinned per order."
          eyebrow="Terms"
          title="Storefront terms"
        />
        <MarketingPad className="max-w-2xl space-y-10 py-14 lg:py-20">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Acceptance
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              By browsing frameline.ai, installing free materials, or completing
              checkout, you agree to these storefront terms and the applicable{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/license"
              >
                license
              </Link>{" "}
              for materials you use.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              The product
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Frameline sells licenses to installable materials and related
              exports. Live demos, docs, and marketing pages are provided as-is
              for evaluation. Demo checkout does not create a charge until
              payment is wired to a real provider.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Accounts &amp; access
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              You are responsible for the email and registry credentials tied to
              your purchases. Do not share registry tokens publicly. We may
              revoke access for abuse, chargebacks, or license violations.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Purchases
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Paid licenses are one-time unless stated otherwise. The license
              version in force at purchase is pinned to your order. Refunds, if
              offered, follow the policy stated at checkout. See{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/docs/licensing"
              >
                licensing docs
              </Link>{" "}
              for rights summaries.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Limitation
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Frameline is provided without warranties beyond those required by
              law. We are not liable for indirect or consequential damages from
              use of the storefront or materials. Privacy practices are described
              in our{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/privacy"
              >
                Privacy
              </Link>{" "}
              page.
            </p>
          </div>
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

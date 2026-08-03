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
  title: "Privacy",
  description:
    "How Frameline handles email, orders, and analytics. We do not sell your data.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Minimal collection. No sale of personal data. Written for buyers, not lawyers."
          eyebrow="Privacy"
          title="What we collect"
        />
        <MarketingPad className="max-w-2xl space-y-10 py-14 lg:py-20">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Email
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We store the email you provide at checkout, waitlist signup, or
              account sign-in — to deliver receipts, registry access, and
              product updates you opted into.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Orders
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Order records (plan, amount, entitlement scope, license version)
              are kept so we can restore access and honor the terms you bought
              under. Payment card data is handled by the payment provider — we
              do not store full card numbers.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Analytics
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We use lightweight analytics to understand catalog usage, install
              success, and funnel health. Aggregates help us improve materials;
              we do not sell personal data or build advertising profiles from
              Frameline activity.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Contact
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Questions about this policy or your data: reach out via the
              channels listed on{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/about"
              >
                About
              </Link>
              . See also{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/terms"
              >
                Terms
              </Link>
              .
            </p>
          </div>
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

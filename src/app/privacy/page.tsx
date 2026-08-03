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
              Email & waitlist
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We store the email you provide at checkout, waitlist signup, or
              account sign-in — to deliver receipts, registry access, and
              product updates you opted into. Waitlist entries are used only for
              drop notices and related product mail; you can ask to be removed.
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
              Contact
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Messages sent through{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/contact"
              >
                Contact
              </Link>{" "}
              include the email and note you submit so we can reply. On the
              hosted product those go to our support inbox; on a self-hosted
              demo they append to local demo storage (see below).
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Analytics & WTP signals
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We use lightweight analytics (for example Plausible when
              configured) to understand catalog usage, install success, and
              funnel health. Willingness-to-pay and pricing experiments are
              stored as aggregates — counts and conversion rates, not profiles
              of individual visitors. We do not sell personal data or build
              advertising profiles from Frameline activity.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Self-hosted demo storage
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              In the open demo / self-hosted setup, waitlist signups, contact
              notes, orders, entitlements, and catalog overrides may be written
              under a local <span className="font-mono text-foreground">.data/</span>{" "}
              directory on that instance (for example{" "}
              <span className="font-mono text-foreground">waitlist.json</span>,{" "}
              <span className="font-mono text-foreground">contact.json</span>,{" "}
              <span className="font-mono text-foreground">orders.json</span>).
              That data stays on the machine running the demo — it is not a
              shared Frameline cloud database unless you wire one up.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Questions
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Questions about this policy or your data: reach out via{" "}
              <Link
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="/contact"
              >
                Contact
              </Link>{" "}
              or the channels listed on{" "}
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

import type { Metadata } from "next";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Frameline makes surface as code — production materials you install, not generate from scratch.",
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Design assets for the AI era — shippable surface so builders don’t ship the default look."
          eyebrow="About"
          title="Surface as code"
        />
        <MarketingPad className="space-y-10 py-14 lg:py-20">
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Frameline is a storefront for animated shader materials —
              production-ready surfaces you browse live, tune in a
              configurator, and install into a React app in under a minute.
            </p>
            <p>
              Generative tools made starting easy. They also made everything
              look the same. Teams still spend days hand-crafting backgrounds,
              empty states, and loading shells — or ship the generic gradient
              and hope nobody notices. Frameline closes that gap: craft at the
              catalog level, code at the install level.
            </p>
          </div>

          <div className="max-w-2xl space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Craft first
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Every material ships to the same bar whether it is free or paid:
              live WebGL preview, token-friendly props, reduced-motion
              fallbacks, and paste-ready JSX. Free is not a trial — it is proof
              that the code quality holds in your build before money is
              discussed.
            </p>
          </div>

          <div className="max-w-2xl space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Surface as code
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Materials are packages, not screenshots. You get a component, a
              prop table, install commands, and license clarity on the same
              page. Registry access for paid SKUs is entitlement-gated — the
              source never sits on a public URL.
            </p>
          </div>

          <div className="max-w-2xl space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
              Solo-operable
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Frameline is built to ship and run with a small footprint: one
              catalog, clear tiers, guest checkout, and an account that exists
              to restore access — not to become another dashboard. The product
              stays focused so the craft stays high.
            </p>
          </div>
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

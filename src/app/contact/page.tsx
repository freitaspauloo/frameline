import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write the Frameline demo inbox — messages are stored locally for this storefront demo.",
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Questions about licensing, install, or catalog coverage — leave a note. This is a demo inbox: submissions append to .data/contact.json on this instance, not a live support mailbox."
          eyebrow="Contact"
          title="Demo inbox"
        />
        <MarketingPad className="py-14 lg:py-20">
          <div className="max-w-lg">
            <ContactForm />
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              For production launches we will wire this to email. Until then,
              treat replies as optional — the form exists so the storefront path
              is complete.
            </p>
          </div>
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

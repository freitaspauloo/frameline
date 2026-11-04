import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingFootnote,
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description="That route isn’t in the catalog. Try the materials index or go home."
          eyebrow="404"
          title="Page not found"
        />
        <MarketingPad className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 lg:py-16">
          <Button
            nativeButton={false}
            render={<Link href="/materials" />}
            size="lg"
          >
            Browse materials
          </Button>
          <Link
            className="text-sm underline underline-offset-4 hover:text-muted-foreground"
            href="/"
          >
            Home
          </Link>
        </MarketingPad>
      </MarketingSection>
      <MarketingFootnote>Frameline</MarketingFootnote>
    </MarketingShell>
  );
}

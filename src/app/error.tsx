"use client";

import Link from "next/link";
import { useEffect } from "react";

import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
  marketingPadX,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { captureException } from "@/lib/monitoring";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest });
  }, [error]);

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description="Something broke on this page. You can retry, or head back to the catalog."
          eyebrow="Error"
          title="Couldn’t render this page"
        />
        <MarketingPad className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 lg:py-16">
          <Button onClick={reset} size="lg" type="button">
            Try again
          </Button>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              className="underline underline-offset-4 hover:text-muted-foreground"
              href="/"
            >
              Home
            </Link>
            <Link
              className="underline underline-offset-4 hover:text-muted-foreground"
              href="/materials"
            >
              Materials
            </Link>
          </div>
          {error.digest ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              {error.digest}
            </p>
          ) : null}
        </MarketingPad>
      </MarketingSection>
      <div className={cn("border-t border-border py-6", marketingPadX)}>
        <p className="text-xs text-muted-foreground">Frameline</p>
      </div>
    </MarketingShell>
  );
}

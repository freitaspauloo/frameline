import type { Metadata } from "next";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import {
  isValidEmail,
  verifyNurtureToken,
} from "@/lib/nurture";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Stop biweekly Frameline product notes.",
  robots: { index: false, follow: false },
};

type Search = Promise<{
  email?: string;
  token?: string;
  done?: string;
  error?: string;
}>;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase() ?? "";
  const token = params.token?.trim() ?? "";
  const done = params.done === "1";
  const error = params.error;
  const valid =
    isValidEmail(email) && Boolean(token) && verifyNurtureToken(email, token);

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Biweekly product notes — materials, screens, and shipping. Receipts and license mail are separate."
          eyebrow="Email"
          title={done ? "You’re unsubscribed" : "Unsubscribe"}
        />
        <MarketingPad className="max-w-xl space-y-6 py-14 lg:py-20">
          {done ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {email ? (
                <>
                  <span className="font-mono text-foreground">{email}</span>{" "}
                  will no longer receive the 15-day notes.
                </>
              ) : (
                "You will no longer receive the 15-day notes."
              )}{" "}
              Order receipts and access links still go out when you buy.
            </p>
          ) : error === "invalid" || (email && token && !valid) ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              That unsubscribe link is invalid or expired. Reply to any
              Frameline note and ask to be removed, or use the link in the
              footer of the last email.
            </p>
          ) : error === "missing" ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              We could not find that address on the list. It may already be
              unsubscribed.
            </p>
          ) : valid ? (
            <>
              <p className="text-base leading-relaxed text-muted-foreground">
                Stop the biweekly notes for{" "}
                <span className="font-mono text-foreground">{email}</span>?
                You can still use the catalog and will still get receipts if
                you purchase.
              </p>
              <form action="/api/unsubscribe" method="post">
                <input name="email" type="hidden" value={email} />
                <input name="token" type="hidden" value={token} />
                <Button type="submit">Unsubscribe</Button>
              </form>
            </>
          ) : (
            <p className="text-base leading-relaxed text-muted-foreground">
              Open the unsubscribe link from a Frameline note to confirm.
            </p>
          )}
        </MarketingPad>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

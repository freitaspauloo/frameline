import type { Metadata } from "next";
import Link from "next/link";

import { AccountRegistryPanel } from "@/components/account-registry-panel";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { getDemoEmail } from "@/lib/auth";
import {
  getDemoEntitlements,
  partitionCatalogByAccess,
} from "@/lib/entitlements";
import { MATERIALS_CATALOG } from "@/materials";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Frameline licenses and registry access.",
};

export default async function AccountPage() {
  const email = await getDemoEmail();
  const entitlements = getDemoEntitlements(email ?? "you@studio.dev");
  const { entitled, locked } = partitionCatalogByAccess(
    MATERIALS_CATALOG,
    entitlements,
  );

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            email ? undefined : (
              <Button
                nativeButton={false}
                render={<Link href="/account/sign-in" />}
                size="sm"
              >
                Sign in
              </Button>
            )
          }
          description="Demo account — free materials are entitled. Paid SKUs stay locked until checkout grants access."
          eyebrow="Account"
          title="Your licenses"
        />

        <MarketingPad className="space-y-3 border-b border-border py-6">
          {email ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              Signed in as{" "}
              <span className="text-foreground">{email}</span>
              {" · "}
              demo auth (Clerk/Firebase later)
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Not signed in.{" "}
              <Link
                className="underline underline-offset-4 hover:text-foreground"
                href="/account/sign-in"
              >
                Sign in with a demo magic link
              </Link>
              . Demo — paid entitlements after checkout. Free materials below are
              installable now.
            </p>
          )}
        </MarketingPad>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] lg:divide-x lg:divide-border">
          <div className="divide-y divide-border">
            {entitled.map((item) => (
              <div
                key={item.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8 lg:px-12"
              >
                <div>
                  <p className="font-heading text-sm font-medium tracking-tight">
                    {item.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {item.tier} · v0.1.0 · entitled
                  </p>
                </div>
                <Button
                  className="shrink-0"
                  nativeButton={false}
                  render={
                    <Link href={`/docs/installation?material=${item.slug}`} />
                  }
                  size="sm"
                  variant="outline"
                >
                  Install
                </Button>
              </div>
            ))}

            {locked.map((item) => (
              <div
                key={item.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8 lg:px-12"
              >
                <div>
                  <p className="font-heading text-sm font-medium tracking-tight text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {item.tier} · locked until purchase
                  </p>
                </div>
                <Button
                  className="shrink-0"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/checkout?plan=${item.tier === "team" ? "team" : "personal"}&material=${item.slug}`}
                    />
                  }
                  size="sm"
                  variant="outline"
                >
                  Unlock
                </Button>
              </div>
            ))}
          </div>

          <AccountRegistryPanel email={email} />
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

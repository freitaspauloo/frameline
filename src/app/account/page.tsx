import type { Metadata } from "next";
import Link from "next/link";

import { AccountDeletePanel } from "@/components/account-delete-panel";
import { AccountRegistryPanel } from "@/components/account-registry-panel";
import { AccountPageActions } from "@/components/account-page-actions";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { resolveDemoUser } from "@/lib/auth";
import {
  getDemoEntitlements,
  partitionCatalogByAccess,
} from "@/lib/entitlements";
import { getV1LaunchCatalog } from "@/materials";
import { getMaterialThumbnailSrc } from "@/materials/thumbnails";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Frameline licenses and registry access.",
};

export default async function AccountPage() {
  const session = await resolveDemoUser();
  const email = session?.email ?? null;
  const entitlements = getDemoEntitlements(email ?? "you@studio.dev");
  const { entitled, locked } = partitionCatalogByAccess(
    getV1LaunchCatalog(),
    entitlements,
  );

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={<AccountPageActions serverEmail={email} />}
          description={
            email
              ? "Licenses and registry access for this account. Paid SKUs stay locked until checkout."
              : "Sign in to keep licenses on this account. Free materials below are installable now."
          }
          eyebrow="Account"
          title="Your licenses"
        />

        <MarketingPad className="space-y-3 border-b border-border py-6">
          {email ? (
            <p className="font-mono text-[0.6875rem] text-muted-foreground">
              Signed in as{" "}
              <span className="text-foreground">{email}</span>
              {session?.role === "admin" ? " · admin" : ""}
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Not signed in.{" "}
              <Link
                className="underline underline-offset-4 hover:text-foreground"
                href="/account/sign-in"
              >
                Sign in with Google or email
              </Link>
              . Paid entitlements unlock after checkout. Free materials below
              are installable now.
            </p>
          )}
        </MarketingPad>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] lg:divide-x lg:divide-border">
          <div className="divide-y divide-border">
            {entitled.map((item) => {
              const thumbSrc = getMaterialThumbnailSrc(item.slug);
              return (
                <div
                  key={item.slug}
                  className="flex flex-wrap items-center gap-3 px-6 py-5 sm:px-8 lg:px-12"
                >
                  <Link
                    className="group/preview relative aspect-[16/10] w-[4.75rem] shrink-0 overflow-hidden rounded border border-border bg-muted"
                    href={`/materials/${item.slug}`}
                  >
                    {thumbSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element -- pre-sized catalog stills
                      <img
                        alt=""
                        className="size-full object-cover transition-transform duration-200 group-hover/preview:scale-105"
                        src={thumbSrc}
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${item.fallbackColors.join(", ")})`,
                        }}
                      />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-medium tracking-tight">
                      {item.title}
                    </p>
                    <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
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
              );
            })}

            {locked.map((item) => {
              const thumbSrc = getMaterialThumbnailSrc(item.slug);
              return (
                <div
                  key={item.slug}
                  className="flex flex-wrap items-center gap-3 px-6 py-5 sm:px-8 lg:px-12"
                >
                  <Link
                    className="group/preview relative aspect-[16/10] w-[4.75rem] shrink-0 overflow-hidden rounded border border-border bg-muted opacity-85 grayscale-[35%]"
                    href={`/materials/${item.slug}`}
                  >
                    {thumbSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element -- pre-sized catalog stills
                      <img
                        alt=""
                        className="size-full object-cover transition-transform duration-200 group-hover/preview:scale-105"
                        src={thumbSrc}
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${item.fallbackColors.join(", ")})`,
                        }}
                      />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-medium tracking-tight text-muted-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
                      {item.tier} · locked until purchase
                    </p>
                  </div>
                  <Button
                    className="shrink-0"
                    nativeButton={false}
                    render={
                      <Link
                        href="/materials"
                      />
                    }
                    size="sm"
                    variant="outline"
                  >
                    Unlock
                  </Button>
                </div>
              );
            })}
          </div>

          <div>
            <AccountRegistryPanel email={email} />
            {/* Always mount — server email can lag cookies/Firebase; the panel reads client session too. */}
            <div className="px-6 pb-10 sm:px-8 lg:px-12">
              <AccountDeletePanel serverEmail={email} />
            </div>
          </div>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

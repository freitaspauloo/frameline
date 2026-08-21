"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
  marketingPadX,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { recordInstallIntent } from "@/lib/install-intent";
import { cn } from "@/lib/utils";
import type { ScreenCatalogEntry } from "@/screens/types";
import { SpacemanMoon } from "@/screens/spaceman-moon";

type AccessState = {
  owned: boolean;
  freeRemainingToday: number | null;
  message: string | null;
};

export function ScreenDetailPage({
  entry,
  unlocked = false,
  sessionId,
  email,
}: {
  entry: ScreenCatalogEntry;
  unlocked?: boolean;
  sessionId?: string;
  email?: string;
}) {
  const router = useRouter();
  const [access, setAccess] = React.useState<AccessState | null>(null);
  const [copied, setCopied] = React.useState<"prompt" | "code" | null>(null);
  const [busy, setBusy] = React.useState<"prompt" | "code" | null>(null);
  const [banner, setBanner] = React.useState<string | null>(
    unlocked ? "Unlocked — unlimited copies for this screen." : null,
  );
  const emailRef = React.useRef(email);

  const refreshAccess = React.useCallback(async () => {
    const qs = new URLSearchParams({ slug: entry.slug });
    if (emailRef.current) qs.set("email", emailRef.current);
    const res = await fetch(`/api/screens/access?${qs.toString()}`, {
      cache: "no-store",
    });
    const data = (await res.json()) as AccessState & { ok?: boolean };
    if (res.ok && data.ok !== false) {
      setAccess({
        owned: Boolean(data.owned),
        freeRemainingToday: data.freeRemainingToday,
        message: data.message,
      });
    }
  }, [entry.slug]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (emailRef.current) {
        try {
          await fetch("/api/auth/magic-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailRef.current }),
          });
        } catch {
          /* optional session bind */
        }
      }
      if (sessionId) {
        try {
          await fetch("/api/screens/fulfill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
        } catch {
          /* webhook backup may still land */
        }
      }
      if (!cancelled) await refreshAccess();
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, refreshAccess]);

  const gated = Boolean(
    access && !access.owned && access.freeRemainingToday === 0,
  );

  async function copyPath(path: "prompt" | "code") {
    setBusy(path);
    setBanner(null);
    try {
      const res = await fetch("/api/screens/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: entry.slug,
          path,
          email: emailRef.current,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        text?: string;
        reason?: string;
        message?: string;
      };

      if (data.reason === "pay" || (!res.ok && data.reason === "pay")) {
        setBanner(
          data.message ??
            "You’ve used today’s free copy. $9 unlocks unlimited prompt + code.",
        );
        await refreshAccess();
        router.push(
          `/checkout?plan=screen&material=${encodeURIComponent(entry.slug)}`,
        );
        return;
      }

      if (!res.ok || !data.ok || !data.text) {
        setBanner(data.message ?? "Could not copy — try again.");
        return;
      }

      await navigator.clipboard.writeText(data.text);
      recordInstallIntent({
        slug: entry.slug,
        source: "screen-detail",
        path,
      });
      setCopied(path);
      window.setTimeout(() => setCopied(null), 1600);
      await refreshAccess();
    } catch {
      setBanner("Network error — try again.");
    } finally {
      setBusy(null);
    }
  }

  function goPay() {
    router.push(
      `/checkout?plan=screen&material=${encodeURIComponent(entry.slug)}`,
    );
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <Button
              nativeButton={false}
              render={<Link href="/screens" />}
              size="sm"
              variant="outline"
            >
              <RiArrowLeftLine data-icon="inline-start" />
              All screens
            </Button>
          }
          description={entry.description}
          eyebrow={`Screen · ${entry.priceLabel} · one-time`}
          title={entry.title}
        />

        <div className="relative grid overflow-visible lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div
            className={cn(
              "border-b border-border lg:sticky lg:top-16 lg:self-start lg:border-b-0",
              marketingPad,
            )}
          >
            <div className="relative aspect-[9/16] max-h-[min(78dvh,820px)] overflow-hidden border border-border bg-[#140810] sm:aspect-[16/10] sm:max-h-none">
              {entry.slug === "spaceman-moon" ? (
                <div className="absolute inset-0 overflow-hidden">
                  <SpacemanMoon className="!min-h-full" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
            </div>
          </div>

          <div className={cn("space-y-8", marketingPad)}>
            <div className="space-y-3">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Get the source
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {access?.owned
                  ? "Unlimited copies unlocked for this screen."
                  : (access?.message ??
                    banner ??
                    "1 free copy today. Then $9 for unlimited.")}
              </p>
              {banner && !access?.owned ? (
                <p className="text-sm text-foreground" role="status">
                  {banner}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              {gated ? (
                <>
                  <Button size="lg" type="button" onClick={goPay}>
                    Get unlimited copies — $9
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    UTC day free slot used. Purchase unlocks Copy prompt + Copy
                    code with no daily limit.
                  </p>
                </>
              ) : (
                <>
                  <Button
                    disabled={busy !== null}
                    size="lg"
                    type="button"
                    variant="outline"
                    onClick={() => void copyPath("prompt")}
                  >
                    {copied === "prompt" ? (
                      <RiCheckLine data-icon="inline-start" />
                    ) : (
                      <RiFileCopyLine data-icon="inline-start" />
                    )}
                    {copied === "prompt"
                      ? "Copied"
                      : busy === "prompt"
                        ? "Copying…"
                        : "Copy prompt"}
                  </Button>
                  <Button
                    disabled={busy !== null}
                    size="lg"
                    type="button"
                    onClick={() => void copyPath("code")}
                  >
                    {copied === "code" ? (
                      <RiCheckLine data-icon="inline-start" />
                    ) : (
                      <RiFileCopyLine data-icon="inline-start" />
                    )}
                    {copied === "code"
                      ? "Copied"
                      : busy === "code"
                        ? "Copying…"
                        : "Copy code"}
                  </Button>
                </>
              )}
            </div>

            <dl className="grid gap-5 border-t border-border pt-8">
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Price
                </dt>
                <dd className="font-heading text-lg font-medium tracking-tight">
                  {entry.priceLabel} · one-time
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Includes
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  Agent prompt + full TSX + CSS module. No configurator — the
                  look is the product.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </MarketingSection>

      <div className={cn("py-10 text-center text-sm text-muted-foreground", marketingPadX)}>
        Live preview above. Install by pasting the copied code into your app.
      </div>

      <MarketingFooter />
    </MarketingShell>
  );
}

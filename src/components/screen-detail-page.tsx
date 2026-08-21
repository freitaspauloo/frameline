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
  marketingPadX,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { recordInstallIntent } from "@/lib/install-intent";
import { cn } from "@/lib/utils";
import type { ScreenCatalogEntry } from "@/screens/types";
import { SpacemanMoon } from "@/screens/spaceman-moon";

type AccessState = {
  owned: boolean;
  copiesLeftThisWeek: number | null;
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
  const [payOpen, setPayOpen] = React.useState(false);
  const emailRef = React.useRef(email);

  const refreshAccess = React.useCallback(async () => {
    const qs = new URLSearchParams({ slug: entry.slug });
    if (emailRef.current) qs.set("email", emailRef.current);
    const res = await fetch(`/api/screens/access?${qs.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = (await res.json()) as AccessState & {
      ok?: boolean;
      freeRemainingToday?: number | null;
    };
    if (res.ok && data.ok !== false) {
      const left = data.copiesLeftThisWeek ?? data.freeRemainingToday ?? null;
      setAccess({
        owned: Boolean(data.owned),
        copiesLeftThisWeek: left,
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
            credentials: "same-origin",
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
            credentials: "same-origin",
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

  const copiesLeftLabel = access?.owned
    ? "Unlimited copies"
    : access?.copiesLeftThisWeek === 0
      ? "0 copies left this week"
      : "1 copy left this week";

  function openPayGate(message?: string) {
    setBanner(
      message ??
        "You’ve used this week’s free copy. $9 unlocks unlimited prompt + code.",
    );
    setPayOpen(true);
  }

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
        credentials: "same-origin",
      });

      let data: {
        ok?: boolean;
        text?: string;
        reason?: string;
        message?: string;
        error?: string;
      } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setBanner(`Copy failed (${res.status}). Try again.`);
        return;
      }

      if (data.reason === "pay") {
        await refreshAccess();
        openPayGate(data.message);
        return;
      }

      if (!res.ok || !data.ok || !data.text) {
        setBanner(data.message ?? data.error ?? "Could not copy — try again.");
        await refreshAccess();
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
    } catch (err) {
      setBanner(
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Network error — try again.",
      );
    } finally {
      setBusy(null);
    }
  }

  function goPay() {
    setPayOpen(false);
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
            <div className="flex flex-wrap items-center gap-3">
              <p
                className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
                data-frameline-quota
              >
                {copiesLeftLabel}
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/screens" />}
                size="sm"
                variant="outline"
              >
                <RiArrowLeftLine data-icon="inline-start" />
                All screens
              </Button>
            </div>
          }
          description={entry.description}
          eyebrow={`Screen · ${entry.priceLabel} · one-time`}
          title={entry.title}
        />
      </MarketingSection>

      {/* Full-rail live stage with Frameline copy CTAs overlaid at the top */}
      <MarketingSection className="border-t-0">
        <div className="relative h-[min(100dvh,1100px)] min-h-[640px] w-full overflow-hidden bg-[#140810]">
          {entry.slug === "spaceman-moon" ? (
            <SpacemanMoon className="h-full w-full" embed />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}

          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end pt-[4.75rem] sm:pt-[5.25rem]",
              marketingPadX,
            )}
          >
            <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
              <Button
                className="border-white/25 bg-black/45 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white"
                disabled={busy !== null}
                size="sm"
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
                className="bg-white text-foreground hover:bg-white/90"
                disabled={busy !== null}
                size="sm"
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
            </div>
          </div>
        </div>
      </MarketingSection>

      {banner ? (
        <MarketingSection>
          <p
            className={cn(
              "py-4 text-sm text-muted-foreground",
              marketingPadX,
            )}
            role="status"
          >
            {banner}
          </p>
        </MarketingSection>
      ) : null}

      <MarketingFooter />

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock unlimited copies</DialogTitle>
            <DialogDescription>
              You’ve used this week’s free copy. Pay {entry.priceLabel} once for
              unlimited Copy prompt + Copy code on {entry.title}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPayOpen(false)}>
              Not now
            </Button>
            <Button type="button" onClick={goPay}>
              Continue to checkout — {entry.priceLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MarketingShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { useCopiesQuotaLabel } from "@/components/copies-quota-widget";
import { MarketingFooter } from "@/components/marketing-footer";
import { MaterialViewBeacon } from "@/components/site-analytics";
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
import { ScreenLivePreview } from "@/screens/preview";
import type { ScreenCatalogEntry } from "@/screens/types";

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
    : access == null
      ? "1 copy left this week"
      : access.copiesLeftThisWeek === 0
        ? "0 copies left this week"
        : "1 copy left this week";

  useCopiesQuotaLabel(copiesLeftLabel);

  function openPayGate(message?: string) {
    setBanner(
      message ??
        "You’ve used this week’s free copy. $9/mo or $49/y unlocks unlimited prompt + code.",
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
        copyId?: string;
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
        copyId: data.copyId,
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

  function goPay(plan: "screen" | "screen_year" | "screen_lifetime" = "screen") {
    setPayOpen(false);
    router.push(
      `/checkout?plan=${plan}&material=${encodeURIComponent(entry.slug)}`,
    );
  }

  return (
    <MarketingShell>
      <MaterialViewBeacon slug={entry.slug} />
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <Button
                className="self-end"
                nativeButton={false}
                render={<Link href="/materials" />}
                size="sm"
                variant="outline"
              >
                <RiArrowLeftLine data-icon="inline-start" />
                All materials
              </Button>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  className="border-[#3A58F0]/40 bg-[#EEF2FF] text-[#1A2A6B] hover:border-[#3A58F0] hover:bg-[#E0E7FF] hover:text-[#1A2A6B]"
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
                  className="bg-[#3A58F0] text-white hover:bg-[#2F4AD4]"
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
          }
          description={entry.description}
          eyebrow={`Screen · ${entry.priceLabel} · one-time`}
          title={entry.title}
        />
      </MarketingSection>

      <MarketingSection className="border-t-0">
        <div className="relative h-[min(100dvh,1100px)] min-h-[640px] w-full overflow-hidden bg-[#140810]">
          <ScreenLivePreview embed slug={entry.slug} />
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
              You’ve used this week’s free copy. Unlock unlimited Copy prompt +
              Copy code on {entry.title} for $9/mo, $49/y, or $150 lifetime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPayOpen(false)}
            >
              Not now
            </Button>
            <Button
              className="bg-[#3A58F0] text-white hover:bg-[#2F4AD4]"
              type="button"
              onClick={() => goPay("screen")}
            >
              $9/mo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goPay("screen_year")}
            >
              $49/y
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goPay("screen_lifetime")}
            >
              $150 lifetime
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MarketingShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
  marketingPadX,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isCartPlan,
  useCartStore,
  type CartPlan,
} from "@/lib/cart";
import {
  getLicensePlan,
  LICENSE_PLAN_VERSION,
} from "@/lib/license-plans";
import { cn } from "@/lib/utils";
import { recordWtpIntent } from "@/lib/wtp-intent";

/** Public checkout only — $0.50 smoke SKU gated via FRAMELINE_ALLOW_TEST_PLAN. */
const MATERIAL_PLAN_OPTIONS: CartPlan[] = ["static", "personal", "team"];
const SCREEN_PLAN_OPTIONS: CartPlan[] = ["screen"];

const CHIP =
  "border border-border px-4 py-2 text-[0.625rem] font-semibold tracking-widest uppercase transition-colors";

export function CheckoutForm({
  initialPlan,
  initialMaterial,
}: {
  initialPlan?: string;
  initialMaterial?: string;
}) {
  const router = useRouter();
  const plan = useCartStore((s) => s.plan);
  const materialSlug = useCartStore((s) => s.materialSlug);
  const email = useCartStore((s) => s.email);
  const setPlan = useCartStore((s) => s.setPlan);
  const setMaterial = useCartStore((s) => s.setMaterial);
  const setEmail = useCartStore((s) => s.setEmail);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [stripeMessage, setStripeMessage] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState(email ?? "you@studio.dev");

  useEffect(() => {
    if (isCartPlan(initialPlan) && initialPlan !== "test") {
      setPlan(initialPlan);
    } else if (initialPlan === "test") {
      setPlan("personal");
    } else if (useCartStore.getState().plan === "test") {
      // Persisted cart may still hold the old smoke SKU.
      setPlan("personal");
    }
    if (initialMaterial) {
      setMaterial(initialMaterial);
    }
    setHydrated(true);
  }, [initialPlan, initialMaterial, setPlan, setMaterial]);

  const activePlan = (() => {
    const raw =
      hydrated || !isCartPlan(initialPlan) || initialPlan === "test"
        ? plan
        : initialPlan;
    return raw === "test" ? "personal" : raw;
  })();
  const activeMaterial = hydrated
    ? materialSlug
    : (initialMaterial ?? materialSlug);
  const license = getLicensePlan(activePlan);
  const amount = license?.priceLabel ?? "$99";
  const planOptions =
    activePlan === "screen" || initialPlan === "screen"
      ? SCREEN_PLAN_OPTIONS
      : MATERIAL_PLAN_OPTIONS;
  const productHref =
    activePlan === "screen" && activeMaterial
      ? `/screens/${activeMaterial}`
      : activeMaterial
        ? `/materials/${activeMaterial}`
        : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setStripeMessage(null);
    setEmail(emailValue);
    recordWtpIntent({
      plan: activePlan,
      material: activeMaterial,
      email: emailValue,
      source: "checkout",
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: activePlan,
          email: emailValue,
          material: activeMaterial,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        mode?: "demo" | "stripe";
        redirectTo?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.redirectTo) {
        if (data.mode === "stripe") {
          window.location.href = data.redirectTo;
          return;
        }
        router.push(data.redirectTo);
        return;
      }
      setStatus("idle");
      setStripeMessage(data.message ?? "Checkout did not return a redirect.");
    } catch {
      setStatus("error");
      setError("Network error — try again");
    }
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description="Guest checkout. With Stripe keys, pays via Stripe Checkout; otherwise fulfills instantly into Postgres (or local demo store)."
          eyebrow="Checkout"
          title={`${license?.name ?? "Personal"} license`}
        />
        <MarketingPad className="mx-auto max-w-md space-y-8 py-12 lg:py-16">
          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="flex flex-wrap gap-2">
              {planOptions.map((key) => {
                const option = getLicensePlan(key);
                const selected = activePlan === key;
                return (
                  <button
                    key={key}
                    className={cn(
                      CHIP,
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "text-muted-foreground hover:border-foreground hover:text-foreground",
                    )}
                    type="button"
                    onClick={() => setPlan(key)}
                  >
                    {option?.name} · {option?.priceLabel}
                  </button>
                );
              })}
            </div>

            {activeMaterial && productHref ? (
              <p className="text-sm text-muted-foreground">
                Continuing from{" "}
                <Link
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  href={productHref}
                >
                  {activeMaterial}
                </Link>
                .
              </p>
            ) : null}

            <p className="text-sm leading-relaxed text-muted-foreground">
              {license?.summary}
            </p>

            <div className="space-y-4 border-t border-border pt-6">
              <label className="block space-y-2">
                <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Email
                </span>
                <Input
                  required
                  autoComplete="email"
                  className="border border-border border-b-border px-3 focus-visible:border-foreground"
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  onBlur={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Card
                </span>
                <Input
                  readOnly
                  className="border border-border border-b-border px-3 focus-visible:border-foreground"
                  defaultValue="•••• •••• •••• 4242"
                  type="text"
                />
              </label>
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {stripeMessage ? (
              <p className="text-sm text-muted-foreground" role="status">
                {stripeMessage}
              </p>
            ) : null}

            <Button
              className="w-full"
              disabled={status === "loading"}
              size="lg"
              type="submit"
            >
              {status === "loading" ? "Processing…" : `Pay ${amount}`}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            License plan version{" "}
            <span className="font-mono text-foreground">
              {LICENSE_PLAN_VERSION}
            </span>{" "}
            pins at purchase. See{" "}
            <Link
              className="underline underline-offset-4 hover:text-foreground"
              href="/license"
            >
              license
            </Link>
            .
          </p>
        </MarketingPad>
      </MarketingSection>
      <div className={cn("border-t border-border py-6", marketingPadX)}>
        <p className="text-xs text-muted-foreground">Frameline · demo commerce</p>
      </div>
    </MarketingShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DemoEmailSignInForm,
  FirebaseSignInForm,
  type AuthSessionUser,
} from "@/components/firebase-sign-in-form";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingPad,
  MarketingSection,
  MarketingShell,
  marketingPadX,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { getDemoSession } from "@/lib/auth-client";
import { useCartStore } from "@/lib/cart";
import {
  clientSignOut,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import {
  getLicensePlan,
  LICENSE_PLAN_VERSION,
} from "@/lib/license-plans";
import { cn } from "@/lib/utils";
import { recordWtpIntent } from "@/lib/wtp-intent";

function readStoredUser(): AuthSessionUser | null {
  if (typeof window === "undefined") return null;
  const fromCookie = getDemoSession();
  if (fromCookie) return fromCookie;
  try {
    const raw = sessionStorage.getItem("fl_demo_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSessionUser>;
    if (!parsed.email || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "buyer",
    };
  } catch {
    return null;
  }
}

export function CheckoutForm({
  initialPlan,
  initialMaterial,
}: {
  initialPlan?: string;
  initialMaterial?: string;
}) {
  const router = useRouter();
  const materialSlug = useCartStore((s) => s.materialSlug);
  const setPlan = useCartStore((s) => s.setPlan);
  const setMaterial = useCartStore((s) => s.setMaterial);
  const setEmail = useCartStore((s) => s.setEmail);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [stripeMessage, setStripeMessage] = useState<string | null>(null);

  useEffect(() => {
    setPlan("screen");
    if (initialMaterial) {
      setMaterial(initialMaterial);
    }
    setUser(readStoredUser());
    setHydrated(true);
  }, [initialPlan, initialMaterial, setPlan, setMaterial]);

  const activePlan = "screen" as const;
  const activeMaterial = hydrated
    ? materialSlug
    : (initialMaterial ?? materialSlug);
  const license = getLicensePlan(activePlan);
  const amount = license?.priceLabel ?? "$9";
  const productHref = activeMaterial ? `/screens/${activeMaterial}` : null;
  const firebaseReady = isFirebaseClientConfigured();
  const signedIn = Boolean(user?.email);

  async function startPayment(email: string) {
    setStatus("loading");
    setError(null);
    setStripeMessage(null);
    setEmail(email);
    recordWtpIntent({
      plan: activePlan,
      material: activeMaterial,
      email,
      source: "checkout",
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: activePlan,
          email,
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

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    const email = (user?.email ?? "").trim().toLowerCase();
    if (!email.includes("@")) {
      setError("Sign in or enter a valid email to continue.");
      return;
    }
    if (!signedIn) {
      setError("Sign in before paying.");
      return;
    }
    await startPayment(email);
  }

  function onAuthSuccess(next: AuthSessionUser) {
    setUser(next);
    setEmail(next.email);
    setError(null);
  }

  async function onUseDifferentAccount() {
    try {
      await clientSignOut();
    } catch {
      // still clear Frameline session
    }
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } catch {
      // ignore network errors — local clear still applies
    }
    sessionStorage.removeItem("fl_demo_user");
    setUser(null);
    setError(null);
    setStripeMessage(null);
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          align="center"
          description={
            signedIn
              ? "You’re signed in. Continue to Stripe to pay — card details are collected there."
              : "Sign in or create an account first. Stripe asks for your card on the next step."
          }
          eyebrow="Checkout"
          title={`Screen · ${amount}`}
        />
        <MarketingPad className="mx-auto max-w-md space-y-8 py-12 lg:py-16">

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

          {/* —— Auth gate (required for screens) —— */}
          {!signedIn ? (
            <div className="space-y-4 border-t border-border pt-6">
              <div className="space-y-1">
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Step 1 · Sign in
                </p>
                <p className="text-sm text-muted-foreground">
                  Create an account or log in so we can unlock unlimited copies
                  after payment.
                </p>
              </div>
              {firebaseReady ? (
                <FirebaseSignInForm
                  showClearSession={false}
                  onSuccess={onAuthSuccess}
                />
              ) : (
                <DemoEmailSignInForm onSuccess={onAuthSuccess} />
              )}
            </div>
          ) : null}

          {/* —— Pay step —— */}
          {signedIn && (
            <form
              className="space-y-6 border-t border-border pt-6"
              onSubmit={onPay}
            >
              <div className="space-y-1">
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Step 2 · Pay
                </p>
                <p className="text-sm text-muted-foreground">
                  Signed in as{" "}
                  <span className="font-medium text-foreground">
                    {user?.email}
                  </span>
                  . You’ll enter card details on Stripe.
                </p>
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
                className="w-full bg-[#3A58F0] text-white hover:bg-[#2F4AD4]"
                disabled={status === "loading"}
                size="lg"
                type="submit"
              >
                {status === "loading"
                  ? "Redirecting to Stripe…"
                  : `Continue to Stripe · ${amount}`}
              </Button>

              {signedIn ? (
                <button
                  className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  type="button"
                  onClick={() => void onUseDifferentAccount()}
                >
                  Use a different account
                </button>
              ) : null}
            </form>
          )}

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
        <p className="text-xs text-muted-foreground">
          Frameline · Stripe Checkout handles card entry
        </p>
      </div>
    </MarketingShell>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FirebaseSignInForm } from "@/components/firebase-sign-in-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { isFirebaseClientConfigured } from "@/lib/firebase-client";

function DemoSignInForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        user?: { email: string; role: string };
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Could not send magic link");
        return;
      }
      if (data.user) {
        sessionStorage.setItem("fl_demo_user", JSON.stringify(data.user));
      }
      router.push("/account");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Network error — try again");
    }
  }

  return (
    <form
      className="mx-auto max-w-md space-y-6 border-t border-border pt-10"
      onSubmit={onSubmit}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Demo fallback (no Firebase web config). Use{" "}
        <span className="font-mono text-foreground">admin@frameline.ai</span>{" "}
        for admin shell access.
      </p>
      <label className="block space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Email
        </span>
        <input
          required
          autoComplete="email"
          className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="you@studio.dev"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        className="w-full"
        disabled={status === "loading"}
        size="lg"
        type="submit"
      >
        {status === "loading" ? "Signing in…" : "Continue"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          className="underline underline-offset-4 hover:text-foreground"
          href="/account"
        >
          Back to account
        </Link>
      </p>
    </form>
  );
}

export default function SignInPage() {
  const firebaseReady = isFirebaseClientConfigured();

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description={
            firebaseReady
              ? "Sign in with Google or email via Firebase Auth."
              : "Firebase Admin is configured. Add the web app keys to enable Google/email sign-in — demo fallback stays available."
          }
          eyebrow="Account"
          title="Sign in"
        />
        <div className={marketingPad}>
          {firebaseReady ? <FirebaseSignInForm /> : <DemoSignInForm />}
          {firebaseReady ? null : (
            <div className="mx-auto mt-10 max-w-md">
              <FirebaseSignInForm />
            </div>
          )}
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

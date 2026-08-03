"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
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
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description="Enter the email used at purchase. Demo auth issues a session cookie immediately — real magic links come later."
          eyebrow="Account"
          title="Sign in"
        />
        <div className={marketingPad}>
          <form
            className="mx-auto max-w-md space-y-6 border-t border-border pt-10"
            onSubmit={onSubmit}
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Demo auth — real provider later (Clerk/Firebase). Use{" "}
              <span className="font-mono text-foreground">admin@frameline.ai</span>{" "}
              or any email containing{" "}
              <span className="font-mono text-foreground">admin</span> for the
              admin shell.
            </p>

            <label className="block space-y-2">
              <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Email
              </span>
              <input
                required
                autoComplete="email"
                className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                placeholder="you@studio.dev"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              className="w-full"
              disabled={status === "loading"}
              size="lg"
              type="submit"
            >
              {status === "loading" ? "Sending…" : "Send magic link"}
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
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

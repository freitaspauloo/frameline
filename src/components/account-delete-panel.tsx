"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clientSignOut,
  getIdToken,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import { cn } from "@/lib/utils";

function readSessionEmail(): string | null {
  try {
    const raw = sessionStorage.getItem("fl_demo_user");
    if (!raw) return null;
    const u = JSON.parse(raw) as { email?: string };
    return typeof u.email === "string" ? u.email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

export function AccountDeletePanel({
  serverEmail,
  className,
}: {
  serverEmail: string | null;
  className?: string;
}) {
  const router = useRouter();
  const firebase = isFirebaseClientConfigured();
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const hintEmail = serverEmail?.trim().toLowerCase() ?? readSessionEmail();

  async function deleteAccount() {
    setBusy(true);
    setError(null);
    try {
      const normalized = confirm.trim().toLowerCase();
      if (!normalized || !normalized.includes("@")) {
        setError("Enter a valid email.");
        return;
      }
      if (hintEmail && normalized !== hintEmail) {
        setError("Must match the address you are signed in with.");
        return;
      }

      let idToken: string | undefined;
      if (firebase) {
        const t = await getIdToken(true);
        if (!t) {
          setError("You are not signed in — refresh and try again.");
          return;
        }
        idToken = t;
      }

      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: normalized, idToken }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not delete account");
        return;
      }

      sessionStorage.removeItem("fl_demo_user");
      await fetch("/api/auth/sign-out", { method: "POST" });
      if (firebase) {
        try {
          await clientSignOut();
        } catch {
          // User may already be removed server-side — ignore.
        }
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error — try again");
    } finally {
      setBusy(false);
    }
  }

  if (!hintEmail) return null;

  return (
    <div
      className={cn(
        "space-y-4 border-t border-destructive/30 pt-8",
        className,
      )}
    >
      <h2 className="font-heading text-sm font-medium tracking-tight text-destructive">
        Delete account
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Removes your Frameline profile, marketing subscriptions, and registry
        access for this email. Purchases stay on file for tax and legal
        records; active licenses are revoked so tokens stop working. This cannot
        be undone from the app — you would need to create a new account to sign
        in again.
      </p>
      <label className="block space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Type your email to confirm
        </span>
        <Input
          autoComplete="email"
          className="border border-border px-3"
          type="email"
          value={confirm}
          placeholder={hintEmail}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        className="w-full border-destructive text-destructive hover:bg-destructive/10"
        disabled={busy}
        size="sm"
        type="button"
        variant="outline"
        onClick={deleteAccount}
      >
        {busy ? "Deleting…" : "Delete my account permanently"}
      </Button>
    </div>
  );
}

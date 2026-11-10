"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useOptionalAuthSession } from "@/components/auth-session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearClientSession,
  getDemoSession,
  suppressAuthRestore,
} from "@/lib/auth-client";
import {
  clientSignOut,
  getIdToken,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import { cn } from "@/lib/utils";

function readSessionEmail(): string | null {
  const fromCookie = getDemoSession()?.email ?? null;
  if (fromCookie) return fromCookie;
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
  const auth = useOptionalAuthSession();
  const firebase = isFirebaseClientConfigured();
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const hintEmail =
    serverEmail?.trim().toLowerCase() ??
    auth?.user?.email ??
    readSessionEmail();

  async function deleteAccount() {
    setBusy(true);
    setError(null);
    suppressAuthRestore(true);
    try {
      const normalized = confirm.trim().toLowerCase();
      if (!normalized || !normalized.includes("@")) {
        setError("Enter a valid email.");
        suppressAuthRestore(false);
        return;
      }
      if (hintEmail && normalized !== hintEmail) {
        setError("Must match the address you are signed in with.");
        suppressAuthRestore(false);
        return;
      }

      let idToken: string | undefined;
      if (firebase) {
        try {
          idToken = (await getIdToken(true)) ?? undefined;
        } catch {
          idToken = undefined;
        }
      }

      const res = await fetch("/api/account", {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: normalized, idToken }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        suppressAuthRestore(false);
        setError(data.error ?? "Could not delete account");
        return;
      }

      clearClientSession();
      try {
        await clientSignOut();
      } catch {
        // User may already be removed server-side — ignore.
      }
      try {
        await fetch("/api/auth/sign-out", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
      } catch {
        // Best-effort — DELETE already expired cookies on that response.
      }
      suppressAuthRestore(false);
      router.push("/");
      router.refresh();
    } catch {
      suppressAuthRestore(false);
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
      id="delete-account"
    >
      <h2 className="font-heading text-sm font-medium tracking-tight text-destructive">
        Delete account
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Removes your Frameline profile, login, marketing subscriptions, and
        registry access for this email. You will get a confirmation email.
        Purchases stay on file for tax and legal records; active licenses are
        revoked so tokens stop working. This cannot be undone from the app —
        signing in again creates a new account.
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

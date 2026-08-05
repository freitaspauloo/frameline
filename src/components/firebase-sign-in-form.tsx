"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  clientSignOut,
  getIdToken,
  isFirebaseClientConfigured,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/firebase-client";

async function exchangeSession(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    error?: string;
    user?: { email: string; role: string };
  };
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Could not create session");
  }
  return data;
}

export function FirebaseSignInForm() {
  const router = useRouter();
  const configured = isFirebaseClientConfigured();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"signin" | "register">("signin");
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [error, setError] = React.useState<string | null>(null);

  if (!configured) {
    return (
      <div className="space-y-3 border border-border p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Firebase web config missing</p>
        <p>
          Admin SDK is ready for project{" "}
          <span className="font-mono text-foreground">frameline-b89ac</span>.
          Paste these from Firebase Console → Project settings → Your apps:
        </p>
        <ul className="list-inside list-disc space-y-1 font-mono text-[11px]">
          <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
          <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
          <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
        </ul>
      </div>
    );
  }

  async function finish(userToken?: string) {
    const idToken = userToken ?? (await getIdToken(true));
    if (!idToken) throw new Error("No Firebase ID token");
    const data = await exchangeSession(idToken);
    if (data.user) {
      sessionStorage.setItem("fl_demo_user", JSON.stringify(data.user));
    }
    router.push("/account");
    router.refresh();
  }

  async function onGoogle() {
    setStatus("loading");
    setError(null);
    try {
      const user = await signInWithGoogle();
      await finish(await user.getIdToken());
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Google sign-in failed");
    }
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const user =
        mode === "register"
          ? await registerWithEmail(email, password)
          : await signInWithEmail(email, password);
      await finish(await user.getIdToken());
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 border-t border-border pt-10">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Firebase Auth · project{" "}
        <span className="font-mono text-foreground">frameline-b89ac</span>
      </p>

      <Button
        className="w-full"
        disabled={status === "loading"}
        size="lg"
        type="button"
        variant="outline"
        onClick={onGoogle}
      >
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
        <div className="h-px flex-1 bg-border" />
        or email
        <div className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-4" onSubmit={onEmail}>
        <label className="block space-y-2">
          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Email
          </span>
          <input
            required
            autoComplete="email"
            className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Password
          </span>
          <input
            required
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {status === "loading"
            ? "Working…"
            : mode === "register"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <button
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        type="button"
        onClick={() =>
          setMode((m) => (m === "signin" ? "register" : "signin"))
        }
      >
        {mode === "signin"
          ? "Need an account? Register"
          : "Have an account? Sign in"}
      </button>

      <button
        className="block text-xs text-muted-foreground"
        type="button"
        onClick={() => void clientSignOut()}
      >
        Clear local Firebase session
      </button>
    </div>
  );
}

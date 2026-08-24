"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getIdToken,
  isFirebaseClientConfigured,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/firebase-client";
import { cn } from "@/lib/utils";

export type AuthSessionUser = { email: string; role: string };

async function exchangeSession(
  idToken: string,
  authMethod: "google" | "email",
) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, authMethod }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    error?: string;
    user?: AuthSessionUser;
  };
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Could not create session");
  }
  return data;
}

export function FirebaseSignInForm({
  onSuccess,
  className,
}: {
  /** When set, stay on page instead of navigating to /account */
  onSuccess?: (user: AuthSessionUser) => void;
  className?: string;
}) {
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
      <div
        className={cn(
          "space-y-3 border border-border p-5 text-sm text-muted-foreground",
          className,
        )}
      >
        <p className="font-medium text-foreground">Firebase web config missing</p>
        <p>
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

  async function finish(userToken?: string, authMethod: "google" | "email" = "email") {
    const idToken = userToken ?? (await getIdToken(true));
    if (!idToken) throw new Error("No Firebase ID token");
    const data = await exchangeSession(idToken, authMethod);
    if (data.user) {
      sessionStorage.setItem("fl_demo_user", JSON.stringify(data.user));
      if (onSuccess) {
        onSuccess(data.user);
        return;
      }
    }
    router.push("/account");
    router.refresh();
  }

  async function onGoogle() {
    setStatus("loading");
    setError(null);
    try {
      const user = await signInWithGoogle();
      await finish(await user.getIdToken(), "google");
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
      await finish(await user.getIdToken(), "email");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Button
        className="w-full"
        disabled={status === "loading"}
        size="lg"
        type="button"
        variant="outline"
        onClick={onGoogle}
      >
        <GoogleMark aria-hidden data-icon="inline-start" />
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
          <Input
            required
            autoComplete="email"
            className="border border-border px-3"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Password
          </span>
          <Input
            required
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            className="border border-border px-3"
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          className="w-full bg-[#3A58F0] text-white hover:bg-[#2F4AD4]"
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
          ? "Need an account? Create one"
          : "Have an account? Sign in"}
      </button>
    </div>
  );
}

function GoogleMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Email-only demo session when Firebase web keys aren’t present. */
export function DemoEmailSignInForm({
  onSuccess,
  className,
}: {
  onSuccess?: (user: AuthSessionUser) => void;
  className?: string;
}) {
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
        user?: AuthSessionUser;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Could not sign in");
        return;
      }
      if (data.user) {
        sessionStorage.setItem("fl_demo_user", JSON.stringify(data.user));
        if (onSuccess) {
          onSuccess(data.user);
          return;
        }
      }
      router.push("/account");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Network error — try again");
    }
  }

  return (
    <form className={cn("space-y-4", className)} onSubmit={onSubmit}>
      <p className="text-sm text-muted-foreground">
        Demo sign-in (Firebase web config missing). Enter your email to
        continue.
      </p>
      <label className="block space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Email
        </span>
        <Input
          required
          autoComplete="email"
          className="border border-border px-3"
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
        className="w-full bg-[#3A58F0] text-white hover:bg-[#2F4AD4]"
        disabled={status === "loading"}
        size="lg"
        type="submit"
      >
        {status === "loading" ? "Signing in…" : "Continue"}
      </Button>
    </form>
  );
}

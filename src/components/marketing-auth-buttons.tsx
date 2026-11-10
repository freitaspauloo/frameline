"use client";

import * as React from "react";
import Link from "next/link";

import { useOptionalAuthSession } from "@/components/auth-session-provider";
import { Button } from "@/components/ui/button";

function displayEmail(email: string) {
  const [local = email, domain = ""] = email.split("@");
  if (local.length <= 14) return email;
  return `${local.slice(0, 10)}…@${domain}`;
}

export function MarketingAuthButtons() {
  const session = useOptionalAuthSession();
  const user = session?.user ?? null;
  const [signingOut, setSigningOut] = React.useState(false);

  async function logOut() {
    if (!session) return;
    setSigningOut(true);
    try {
      await session.signOut();
    } finally {
      setSigningOut(false);
    }
  }

  if (user) {
    return (
      <>
        <Button
          className="hidden max-w-[14rem] truncate sm:inline-flex"
          nativeButton={false}
          render={<Link href="/account" />}
          size="sm"
          variant="ghost"
        >
          {displayEmail(user.email)}
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/account" />}
          size="sm"
        >
          Account
        </Button>
        <Button
          disabled={signingOut}
          size="sm"
          type="button"
          variant="outline"
          onClick={() => void logOut()}
        >
          {signingOut ? "Logging out…" : "Log out"}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        className="hidden sm:inline-flex"
        nativeButton={false}
        render={<Link href="/account/sign-in" />}
        size="sm"
        variant="ghost"
      >
        Log in
      </Button>
      <Button
        nativeButton={false}
        render={<Link href="/account/sign-in" />}
        size="sm"
      >
        Sign up
      </Button>
    </>
  );
}

export function MarketingMobileAuthLink() {
  const session = useOptionalAuthSession();
  const user = session?.user ?? null;
  const [signingOut, setSigningOut] = React.useState(false);

  async function logOut() {
    if (!session) return;
    setSigningOut(true);
    try {
      await session.signOut();
    } finally {
      setSigningOut(false);
    }
  }

  if (user) {
    return (
      <>
        <Link
          className="block border-t border-border px-4 py-2.5 text-[0.75rem] font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-foreground sm:hidden"
          href="/account"
        >
          Account
        </Link>
        <button
          className="block w-full border-t border-border px-4 py-2.5 text-left text-[0.75rem] font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 sm:hidden"
          disabled={signingOut}
          type="button"
          onClick={() => void logOut()}
        >
          {signingOut ? "Logging out…" : "Log out"}
        </button>
      </>
    );
  }

  return (
    <Link
      className="block border-t border-border px-4 py-2.5 text-[0.75rem] font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-foreground sm:hidden"
      href="/account/sign-in"
    >
      Log in
    </Link>
  );
}

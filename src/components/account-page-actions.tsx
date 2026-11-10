"use client";

import Link from "next/link";

import { useOptionalAuthSession } from "@/components/auth-session-provider";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import { Button } from "@/components/ui/button";

/** Header actions on /account — uses client session when the server cookie lags. */
export function AccountPageActions({
  serverEmail,
}: {
  serverEmail: string | null;
}) {
  const auth = useOptionalAuthSession();
  const email = serverEmail ?? auth?.user?.email ?? null;

  if (!email) {
    return (
      <Button
        nativeButton={false}
        render={<Link href="/account/sign-in" />}
        size="sm"
      >
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        className="hidden text-destructive hover:text-destructive sm:inline-flex"
        nativeButton={false}
        render={<Link href="#delete-account" />}
        size="sm"
        variant="ghost"
      >
        Delete account
      </Button>
      <AccountSignOutButton size="sm" />
    </div>
  );
}

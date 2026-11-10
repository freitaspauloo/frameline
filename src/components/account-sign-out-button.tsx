"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useOptionalAuthSession } from "@/components/auth-session-provider";
import { Button } from "@/components/ui/button";

export function AccountSignOutButton({
  className,
  size = "sm",
  variant = "outline",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "ghost" | "secondary";
}) {
  const router = useRouter();
  const auth = useOptionalAuthSession();
  const [signingOut, setSigningOut] = React.useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      if (auth) {
        await auth.signOut();
      } else {
        await fetch("/api/auth/sign-out", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
      }
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Button
      className={className}
      disabled={signingOut}
      size={size}
      type="button"
      variant={variant}
      onClick={() => void signOut()}
    >
      {signingOut ? "Signing out…" : "Log out"}
    </Button>
  );
}

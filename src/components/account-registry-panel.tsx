"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function mintRegistryToken() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `fl_demo_${hex}`;
}

export function AccountRegistryPanel({ email }: { email: string | null }) {
  const router = useRouter();
  const [token, setToken] = React.useState("fl_demo_••••••••••••••••");
  const [signingOut, setSigningOut] = React.useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      sessionStorage.removeItem("fl_demo_user");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="space-y-4 border-t border-border px-6 py-8 sm:px-8 lg:border-t-0 lg:px-12 lg:py-12">
      <h2 className="font-heading text-sm font-medium tracking-tight">
        Registry token
      </h2>
      <pre
        className={cn(
          "overflow-x-auto border border-border bg-foreground p-4 font-mono text-[11px] text-background",
        )}
      >
        {token}
      </pre>
      <Button
        className="w-full"
        size="sm"
        type="button"
        variant="outline"
        onClick={() => setToken(mintRegistryToken())}
      >
        Regenerate token
      </Button>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Demo <span className="font-mono">fl_demo_</span> token — real tokens
        mint after paid checkout. Free installs do not require a registry token.
      </p>

      {email ? (
        <Button
          className="w-full"
          disabled={signingOut}
          size="sm"
          type="button"
          variant="outline"
          onClick={signOut}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      ) : (
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/account/sign-in" />}
          size="sm"
        >
          Sign in
        </Button>
      )}
    </div>
  );
}

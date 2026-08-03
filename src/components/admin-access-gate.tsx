"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function AdminAccessGate({
  children,
  serverAllowed,
}: {
  children: React.ReactNode;
  serverAllowed: boolean;
}) {
  const searchParams = useSearchParams();
  const demoBypass = searchParams.get("demo") === "1";

  if (serverAllowed || demoBypass) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md space-y-4 border border-border p-6">
      <h1 className="text-lg font-medium">Admin access required</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Sign in with an admin email, or open this route with{" "}
        <span className="font-mono text-foreground">?demo=1</span> for a local
        bypass. Demo admin:{" "}
        <span className="font-mono text-foreground">admin@frameline.ai</span>.
      </p>
      <Link
        className="inline-flex text-sm underline underline-offset-4 hover:text-muted-foreground"
        href="/account/sign-in"
      >
        Go to sign in
      </Link>
    </div>
  );
}

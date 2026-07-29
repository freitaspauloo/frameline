import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-relay-canvas text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-md px-6 py-16 lg:px-8">
        <div className="rounded-relay-lg border border-relay-border bg-relay-white p-6 shadow-relay-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Recover access
          </h1>
          <p className="mt-2 text-sm text-relay-secondary">
            Enter the email used at purchase. We send a magic link — no
            password.
          </p>

          <label className="mt-6 block space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-relay-secondary">
              Email
            </span>
            <input
              className="h-11 w-full rounded-relay-md border border-relay-border bg-relay-panel px-3 text-sm outline-none focus:border-relay-blue focus:ring-3 focus:ring-ring"
              placeholder="you@studio.dev"
              type="email"
            />
          </label>

          <RelayButton
            className="mt-4 w-full"
            nativeButton={false}
            render={<Link href="/account" />}
          >
            Send magic link
          </RelayButton>
        </div>
      </main>
    </div>
  );
}

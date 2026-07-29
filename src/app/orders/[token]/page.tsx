import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ plan?: string; material?: string }>;
}) {
  const { token } = await params;
  const { plan = "personal", material = "ink-dither" } = await searchParams;

  return (
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <div className="space-y-6 rounded-relay-lg border border-relay-border bg-relay-panel p-6 shadow-relay-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-relay-blue text-sm font-medium text-relay-white">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              You&apos;re in
            </h1>
            <p className="text-sm leading-relaxed text-relay-secondary">
              {plan === "team" ? "Team" : "Personal"} license confirmed. Install
              below — Account keeps this for reinstalls.
            </p>
          </div>

          <pre className="overflow-x-auto rounded-relay-md bg-relay-ink p-4 font-mono text-[12px] leading-relaxed text-relay-white">
            {`npx shadcn@latest add @frameline/${material}\n# order ${token}`}
          </pre>

          <div className="flex flex-wrap gap-3">
            <RelayButton
              nativeButton={false}
              render={
                <Link href={`/docs/installation?material=${material}`} />
              }
            >
              Open install docs
            </RelayButton>
            <RelayButton
              nativeButton={false}
              render={<Link href="/account" />}
              variant="secondary"
            >
              Go to account
            </RelayButton>
          </div>
        </div>
      </main>
    </div>
  );
}

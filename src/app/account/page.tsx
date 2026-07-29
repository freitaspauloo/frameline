import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";
import { MATERIALS_CATALOG } from "@/materials";

export default function AccountPage() {
  return (
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-8">
        <div className="max-w-xl space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Your licenses
          </h1>
          <p className="text-base text-relay-secondary">
            Reinstall anytime. No separate return flow — this is the place.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="space-y-3">
            {MATERIALS_CATALOG.map((item) => (
              <li key={item.slug}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-relay-lg border border-relay-border bg-relay-panel px-4 py-4">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="font-mono text-[11px] text-relay-secondary">
                      {item.tier} · v0.1.0
                    </p>
                  </div>
                  <RelayButton
                    className="shrink-0"
                    nativeButton={false}
                    render={
                      <Link
                        href={`/docs/installation?material=${item.slug}`}
                      />
                    }
                    variant="secondary"
                  >
                    Install
                  </RelayButton>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-4 rounded-relay-lg border border-relay-border bg-relay-panel p-5">
            <h2 className="text-sm font-medium">Registry token</h2>
            <pre className="rounded-relay-md bg-relay-ink p-3 font-mono text-[11px] text-relay-white">
              fl_live_••••••••••••••••
            </pre>
            <RelayButton className="w-full" variant="secondary">
              Regenerate token
            </RelayButton>
            <p className="text-sm text-relay-secondary">
              Use with the Frameline registry CLI after purchase.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";

export default async function InstallationDocsPage({
  searchParams,
}: {
  searchParams: Promise<{ material?: string }>;
}) {
  const { material = "aurora-mesh" } = await searchParams;

  return (
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-12 lg:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-relay-secondary">
          Docs · Installation
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Install {material}
        </h1>
        <p className="mt-4 text-base text-relay-secondary">
          CLI or copy-paste. Source lands in your codebase — you own it.
        </p>

        <pre className="mt-8 overflow-x-auto rounded-relay-lg bg-relay-ink p-5 font-mono text-[13px] leading-relaxed text-relay-white">
          {`# shadcn-compatible registry\nnpx shadcn@latest add @frameline/${material}`}
        </pre>

        <div className="mt-6 rounded-relay-lg border border-relay-border bg-relay-panel p-5 space-y-3">
          <p className="text-sm font-medium">Then import</p>
          <pre className="overflow-x-auto rounded-relay-md bg-relay-ink p-4 font-mono text-[12px] text-relay-white">
            {`import { ${material
              .split("-")
              .map((w) => w[0]?.toUpperCase() + w.slice(1))
              .join("")} } from "@/components/ui/${material}"`}
          </pre>
          <div className="flex flex-wrap gap-3 pt-2">
            <RelayButton
              nativeButton={false}
              render={<Link href={`/materials/${material}`} />}
            >
              Back to material
            </RelayButton>
            <RelayButton
              nativeButton={false}
              render={<Link href="/materials" />}
              variant="secondary"
            >
              Browse catalog
            </RelayButton>
          </div>
        </div>
      </main>
    </div>
  );
}

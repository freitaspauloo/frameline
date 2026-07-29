import Link from "next/link";

import { WireframeMaterialPreview } from "@/components/wireframes/material-preview";
import {
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

const COLLECTIONS = [
  {
    slug: "hero-surfaces",
    title: "Hero surfaces",
    count: 3,
    preview: "aurora-mesh",
  },
  {
    slug: "quiet-fields",
    title: "Quiet fields",
    count: 2,
    preview: "grain-field",
  },
] as const;

export default function WireframeCollectionsPage() {
  return (
    <WireframeShell
      flow="Shared"
      nextHref="/wireframes/materials"
      nextLabel="Catalog"
      route="/wireframes/collections"
      title="Collections"
    >
      <div className="mb-8 max-w-xl space-y-2">
        <WfTitle>Collections</WfTitle>
        <WfMuted>Editorial drops — curated sets off the main catalog.</WfMuted>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2">
        {COLLECTIONS.map((c) => (
          <li key={c.slug}>
            <Link
              className="block overflow-hidden rounded-relay-lg border border-relay-border bg-relay-white hover:shadow-relay-sm"
              href="/wireframes/materials"
            >
              <div className="relative aspect-[21/9] bg-relay-ink">
                <WireframeMaterialPreview slug={c.preview} />
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <p className="text-sm font-medium text-relay-ink">{c.title}</p>
                <p className="font-mono text-[11px] text-relay-secondary">
                  {c.count} materials
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </WireframeShell>
  );
}

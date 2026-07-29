import Link from "next/link";

import { WireframeMaterialPreview } from "@/components/wireframes/material-preview";
import {
  WfBadge,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";
import { MATERIALS_CATALOG } from "@/materials";

export default function WireframeCatalogPage() {
  return (
    <WireframeShell
      flow="Main"
      nextHref="/wireframes/materials/aurora-mesh"
      nextLabel="Material"
      route="/wireframes/materials"
      title="Catalog"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <WfTitle>Materials</WfTitle>
          <WfMuted>
            Live grid · free and paid · open any material to install or buy
          </WfMuted>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-relay-border bg-relay-white px-3 py-1.5 font-mono text-[11px] text-relay-secondary">
            All
          </span>
          <span className="rounded-full border border-relay-border bg-relay-white px-3 py-1.5 font-mono text-[11px] text-relay-secondary">
            Free
          </span>
          <span className="rounded-full border border-relay-border bg-relay-white px-3 py-1.5 font-mono text-[11px] text-relay-secondary">
            Paid
          </span>
        </div>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MATERIALS_CATALOG.map((item) => {
          const isFree = item.tier === "free";
          const href = isFree
            ? `/wireframes/materials/${item.slug}`
            : `/wireframes/materials/${item.slug}?tier=paid`;

          return (
            <li key={item.slug}>
              <Link
                className="group block overflow-hidden rounded-relay-lg border border-relay-border bg-relay-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-relay-sm"
                href={href}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-relay-ink">
                  <WireframeMaterialPreview slug={item.slug} />
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-relay-border px-4 py-4">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-relay-ink">
                      {item.title}
                    </p>
                    <p className="line-clamp-2 text-sm text-relay-secondary">
                      {item.description}
                    </p>
                  </div>
                  <WfBadge tone={isFree ? "free" : "paid"}>
                    {isFree ? "Free" : "Paid"}
                  </WfBadge>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </WireframeShell>
  );
}

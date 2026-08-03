import Link from "next/link";

import { MATERIALS_COLLECTIONS } from "@/materials";

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Collections
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Browse hubs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Featured groupings on the storefront.
        </p>
      </div>

      <ul className="divide-y divide-border border border-border">
        {MATERIALS_COLLECTIONS.map((collection) => (
          <li
            className="flex flex-wrap items-start justify-between gap-4 px-4 py-4"
            key={collection.slug}
          >
            <div className="min-w-0 space-y-1">
              <p className="font-medium">{collection.title}</p>
              <p className="text-sm text-muted-foreground">
                {collection.description}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {collection.slug}
                {collection.featured ? " · featured" : ""}
                {" · "}
                {collection.materialSlugs.length} materials
              </p>
            </div>
            <Link
              className="shrink-0 text-sm underline underline-offset-4 hover:text-muted-foreground"
              href={`/collections/${collection.slug}`}
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

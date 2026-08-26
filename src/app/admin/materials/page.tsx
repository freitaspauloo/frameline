import Link from "next/link";

import { AdminMaterialsTable } from "@/components/admin-materials-table";
import {
  getResolvedCatalog,
  readCatalogOverrides,
} from "@/lib/demo-catalog";

export default async function AdminMaterialsPage() {
  const [catalog, overrides] = await Promise.all([
    getResolvedCatalog({ includeDrafts: true }),
    readCatalogOverrides(),
  ]);

  const rows = catalog.map((entry) => ({
    entry,
    status: overrides[entry.slug]?.status ?? ("published" as const),
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Materials
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Catalog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Storefront materials — same set and order as{" "}
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href="/materials"
          >
            /materials
          </Link>{" "}
          and the homepage. Edit title, description, tier, and status via demo
          overrides in{" "}
          <span className="font-mono">.data/catalog-overrides.json</span>.
          Reorder writes to{" "}
          <span className="font-mono">.data/catalog-order.json</span>. Card
          stills live in the{" "}
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href="/studio/thumbnails"
          >
            thumbnail studio
          </Link>
          .
        </p>
      </div>

      <AdminMaterialsTable
        rows={rows}
        slugs={catalog.map((entry) => entry.slug)}
      />
    </div>
  );
}

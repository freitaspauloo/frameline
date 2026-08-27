import Link from "next/link";

import { AdminMaterialsTable } from "@/components/admin-materials-table";
import {
  getResolvedCatalog,
  readCatalogOverrides,
} from "@/lib/demo-catalog";
import { MATERIALS_CATALOG } from "@/materials";

export default async function AdminMaterialsPage() {
  const [allMaterials, storefrontMaterials, overrides] = await Promise.all([
    getResolvedCatalog({ all: true, includeDrafts: true }),
    getResolvedCatalog({ includeDrafts: true }),
    readCatalogOverrides(),
  ]);

  const storefrontSlugs = new Set(storefrontMaterials.map((entry) => entry.slug));
  const rest = allMaterials.filter((entry) => !storefrontSlugs.has(entry.slug));
  const catalog = [...storefrontMaterials, ...rest];

  const rows = catalog.map((entry) => ({
    entry,
    status: overrides[entry.slug]?.status ?? ("published" as const),
    onStorefront: storefrontSlugs.has(entry.slug),
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Materials
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Catalog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Full repo catalog ({MATERIALS_CATALOG.length} materials). The top{" "}
          {storefrontMaterials.length} rows match the public storefront — same
          order as{" "}
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href="/materials"
          >
            /materials
          </Link>{" "}
          and the homepage. Reorder only affects that storefront set (
          <span className="font-mono">.data/catalog-order.json</span>). Edit
          title, description, tier, and status via{" "}
          <span className="font-mono">.data/catalog-overrides.json</span>. Card
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
        storefrontSlugs={storefrontMaterials.map((entry) => entry.slug)}
      />
    </div>
  );
}

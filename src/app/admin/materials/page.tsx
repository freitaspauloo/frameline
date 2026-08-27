import Link from "next/link";

import { AdminCatalogTable } from "@/components/admin-catalog-table";
import {
  getAdminCatalogRows,
  getResolvedCatalog,
} from "@/lib/demo-catalog";
import { MATERIALS_CATALOG } from "@/materials";
import { listAllScreenEntries, SCREENS_CATALOG } from "@/screens/catalog";

export default async function AdminMaterialsPage() {
  const [rows, storefrontMaterials] = await Promise.all([
    getAdminCatalogRows(),
    getResolvedCatalog({ includeDrafts: true }),
  ]);

  const storefrontCount = rows.filter((row) => row.onStorefront).length;
  const screenCount = SCREENS_CATALOG.length;
  const materialCount = MATERIALS_CATALOG.length;
  const hiddenScreenCount =
    listAllScreenEntries().length - SCREENS_CATALOG.length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Catalog
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">
          Storefront & back catalog
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Top {storefrontCount} rows match the public{" "}
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href="/materials"
          >
            /materials
          </Link>{" "}
          grid and homepage: {screenCount} screens +{" "}
          {storefrontMaterials.length} launch materials ({materialCount}{" "}
          shader materials and {hiddenScreenCount} hidden screens in the back
          catalog). Select rows for bulk draft, publish, or delete (hide from
          storefront). Edits persist in{" "}
          <span className="font-mono">.data/catalog-overrides.json</span>.
          Material reorder only affects the launch set (
          <span className="font-mono">.data/catalog-order.json</span>).
        </p>
      </div>

      <AdminCatalogTable
        rows={rows}
        storefrontMaterialSlugs={storefrontMaterials.map((entry) => entry.slug)}
      />
    </div>
  );
}

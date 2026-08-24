import Link from "next/link";

import { AdminMaterialEditForm } from "@/components/admin-material-edit-form";
import { AdminMaterialThumb } from "@/components/admin-material-thumb";
import {
  getResolvedCatalog,
  readCatalogOverrides,
} from "@/lib/demo-catalog";

export default async function AdminMaterialsPage() {
  const [catalog, overrides] = await Promise.all([
    getResolvedCatalog({ all: true }),
    readCatalogOverrides(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Materials
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Catalog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit title, description, and tier via demo overrides in{" "}
          <span className="font-mono">.data/catalog-overrides.json</span> —
          source catalog stays untouched. Card stills live in the{" "}
          <Link
            className="underline underline-offset-4 hover:text-foreground"
            href="/studio/thumbnails"
          >
            thumbnail studio
          </Link>
          .
        </p>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="w-24 px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Preview
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Title
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Slug
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Type
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Tier
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Storefront
              </th>
              <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((item) => {
              const status = overrides[item.slug]?.status ?? "published";
              return (
                <tr
                  className="border-b border-border align-middle last:border-b-0"
                  key={item.slug}
                >
                  <td className="px-3 py-2.5">
                    <AdminMaterialThumb
                      entry={item}
                      href={`/materials/${item.slug}`}
                    />
                  </td>
                  <td className="px-3 py-2.5 font-medium">{item.title}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                    {item.slug}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {item.type}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {item.tier}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                    {status}
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      className="underline underline-offset-4 hover:text-muted-foreground"
                      href={`/materials/${item.slug}`}
                    >
                      View
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <AdminMaterialEditForm entry={item} status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

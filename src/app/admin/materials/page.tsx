import Link from "next/link";

import { MATERIALS_CATALOG } from "@/materials";

export default function AdminMaterialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Materials
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Catalog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All published storefront materials. Status is demo-published until CMS
          lands.
        </p>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {MATERIALS_CATALOG.map((item) => (
              <tr className="border-b border-border last:border-b-0" key={item.slug}>
                <td className="px-3 py-2.5 font-medium">{item.title}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                  {item.slug}
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px]">{item.type}</td>
                <td className="px-3 py-2.5 font-mono text-[11px]">{item.tier}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                  published
                </td>
                <td className="px-3 py-2.5">
                  <Link
                    className="underline underline-offset-4 hover:text-muted-foreground"
                    href={`/materials/${item.slug}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

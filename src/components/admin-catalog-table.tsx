"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiMoreLine } from "@remixicon/react";

import { AdminCatalogEditDialog } from "@/components/admin-catalog-edit-form";
import { AdminCatalogThumb } from "@/components/admin-catalog-thumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminCatalogRow } from "@/lib/demo-catalog";

type Props = {
  rows: AdminCatalogRow[];
  /** V1 material slugs on the storefront — reorder arrows only apply here. */
  storefrontMaterialSlugs: string[];
};

type BulkAction = "draft" | "published" | "delete" | "reset";

export function AdminCatalogTable({ rows, storefrontMaterialSlugs }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const editRow = rows.find((row) => row.slug === editSlug);
  const allSlugs = useMemo(() => rows.map((row) => row.slug), [rows]);
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0;

  const storefrontCount = rows.filter((row) => row.onStorefront).length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allSlugs));
  }

  function toggleSlug(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function persistOrder(nextSlugs: string[]) {
    startTransition(async () => {
      const res = await fetch("/api/admin/materials/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: nextSlugs }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) return;
      router.refresh();
    });
  }

  function move(slug: string, direction: -1 | 1) {
    const index = storefrontMaterialSlugs.indexOf(slug);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= storefrontMaterialSlugs.length) return;
    const next = [...storefrontMaterialSlugs];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  function runBulk(action: BulkAction, slugsArg?: string[]) {
    const slugs = slugsArg ?? [...selected];
    if (slugs.length === 0) return;

    if (action === "delete") {
      const ok = window.confirm(
        `Hide ${slugs.length} item${slugs.length === 1 ? "" : "s"} from the storefront? Source files stay in the repo — status becomes draft.`,
      );
      if (!ok) return;
    }

    if (action === "reset") {
      const ok = window.confirm(
        `Reset overrides for ${slugs.length} item${slugs.length === 1 ? "" : "s"}? Title, description, tier, and status revert to source catalog.`,
      );
      if (!ok) return;
    }

    startTransition(async () => {
      const res = await fetch("/api/admin/catalog/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, slugs }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) return;
      setSelected(new Set());
      router.refresh();
    });
  }

  function setStatus(slug: string, status: "draft" | "published") {
    startTransition(async () => {
      const res = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) return;
      router.refresh();
    });
  }

  return (
    <>
      {someSelected ? (
        <div className="flex flex-wrap items-center gap-3 border border-border bg-muted/30 px-3 py-2.5">
          <p className="font-mono text-[11px] text-muted-foreground">
            {selected.size} selected
          </p>
          <button
            className="border border-border px-2.5 py-1 text-[0.625rem] font-semibold tracking-widest uppercase disabled:opacity-50"
            disabled={pending}
            onClick={() => runBulk("published")}
            type="button"
          >
            Publish
          </button>
          <button
            className="border border-border px-2.5 py-1 text-[0.625rem] font-semibold tracking-widest uppercase disabled:opacity-50"
            disabled={pending}
            onClick={() => runBulk("draft")}
            type="button"
          >
            Draft
          </button>
          <button
            className="border border-red-600/40 px-2.5 py-1 text-[0.625rem] font-semibold tracking-widest text-red-700 uppercase disabled:opacity-50"
            disabled={pending}
            onClick={() => runBulk("delete")}
            type="button"
          >
            Delete
          </button>
          <button
            className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground disabled:opacity-50"
            disabled={pending}
            onClick={() => runBulk("reset")}
            type="button"
          >
            Reset overrides
          </button>
          <button
            className="ml-auto text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground"
            onClick={() => setSelected(new Set())}
            type="button"
          >
            Clear
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="w-10 px-2 py-2">
                <input
                  aria-label="Select all"
                  checked={allSelected}
                  className="size-3.5 accent-foreground"
                  onChange={toggleAll}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  type="checkbox"
                />
              </th>
              <th className="w-16 px-2 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Order
              </th>
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
                Kind
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
              <th className="w-12 px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isDraft = row.status === "draft";
              const isStorefrontMaterial =
                row.kind === "material" && row.onStorefront;
              const materialOrderIndex = isStorefrontMaterial
                ? storefrontMaterialSlugs.indexOf(row.slug)
                : -1;
              const showStorefrontDivider =
                index === storefrontCount && storefrontCount < rows.length;

              return (
                <Fragment key={row.slug}>
                  {showStorefrontDivider ? (
                    <tr className="border-b border-border bg-muted/20">
                      <td
                        className="px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase"
                        colSpan={10}
                      >
                        Back catalog — not on public storefront grid
                      </td>
                    </tr>
                  ) : null}
                  <tr className="border-b border-border align-middle last:border-b-0">
                    <td className="px-2 py-2.5">
                      <input
                        aria-label={`Select ${row.title}`}
                        checked={selected.has(row.slug)}
                        className="size-3.5 accent-foreground"
                        onChange={() => toggleSlug(row.slug)}
                        type="checkbox"
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      {isStorefrontMaterial ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            aria-label={`Move ${row.title} up`}
                            className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                            disabled={pending || materialOrderIndex === 0}
                            onClick={() => move(row.slug, -1)}
                            type="button"
                          >
                            <RiArrowUpSLine className="size-4" />
                          </button>
                          <button
                            aria-label={`Move ${row.title} down`}
                            className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                            disabled={
                              pending ||
                              materialOrderIndex ===
                                storefrontMaterialSlugs.length - 1
                            }
                            onClick={() => move(row.slug, 1)}
                            type="button"
                          >
                            <RiArrowDownSLine className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="block text-center font-mono text-[10px] text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <AdminCatalogThumb
                        fallbackColors={row.material?.fallbackColors}
                        href={
                          row.onStorefront && !isDraft
                            ? `/materials/${row.slug}`
                            : undefined
                        }
                        poster={row.poster}
                        slug={row.slug}
                        title={row.title}
                      />
                    </td>
                    <td className="px-3 py-2.5 font-medium">{row.title}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {row.slug}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px]">
                      {row.typeLabel}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px]">
                      {row.tier}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {row.status}
                    </td>
                    <td className="px-3 py-2.5">
                      {isDraft || !row.onStorefront ? (
                        <span className="text-muted-foreground">
                          {isDraft ? "Hidden" : "Not on storefront"}
                        </span>
                      ) : (
                        <Link
                          className="underline underline-offset-4 hover:text-muted-foreground"
                          href={`/materials/${row.slug}`}
                        >
                          View
                        </Link>
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${row.title}`}
                          className="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                          disabled={pending}
                        >
                          <RiMoreLine className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom">
                          <DropdownMenuItem onClick={() => setEditSlug(row.slug)}>
                            Edit
                          </DropdownMenuItem>
                          {!isDraft ? (
                            <DropdownMenuItem
                              onClick={() => setStatus(row.slug, "draft")}
                            >
                              Draft
                            </DropdownMenuItem>
                          ) : null}
                          {isDraft ? (
                            <DropdownMenuItem
                              onClick={() => setStatus(row.slug, "published")}
                            >
                              Publish
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            onClick={() => runBulk("delete", [row.slug])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {editRow ? (
        <AdminCatalogEditDialog
          onOpenChange={(open) => {
            if (!open) setEditSlug(null);
          }}
          open
          row={editRow}
        />
      ) : null}
    </>
  );
}

/** @deprecated Use AdminCatalogTable */
export { AdminCatalogTable as AdminMaterialsTable };

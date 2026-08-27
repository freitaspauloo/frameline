"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiMoreLine } from "@remixicon/react";

import { AdminMaterialEditDialog } from "@/components/admin-material-edit-form";
import { AdminMaterialThumb } from "@/components/admin-material-thumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MaterialCatalogEntry } from "@/materials";

type Row = {
  entry: MaterialCatalogEntry;
  status: "draft" | "published";
  onStorefront: boolean;
};

type Props = {
  rows: Row[];
  /** V1 storefront slugs — reorder arrows only apply to this subset. */
  storefrontSlugs: string[];
};

export function AdminMaterialsTable({ rows, storefrontSlugs }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const editRow = rows.find((row) => row.entry.slug === editSlug);

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
    const index = storefrontSlugs.indexOf(slug);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= storefrontSlugs.length) return;
    const next = [...storefrontSlugs];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
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
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
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
              <th className="w-12 px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { entry, status, onStorefront } = row;
              const isDraft = status === "draft";
              const storefrontIndex = storefrontSlugs.indexOf(entry.slug);
              return (
                <tr
                  className="border-b border-border align-middle last:border-b-0"
                  key={entry.slug}
                >
                  <td className="px-2 py-2.5">
                    {onStorefront ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          aria-label={`Move ${entry.title} up`}
                          className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={pending || storefrontIndex === 0}
                          onClick={() => move(entry.slug, -1)}
                          type="button"
                        >
                          <RiArrowUpSLine className="size-4" />
                        </button>
                        <button
                          aria-label={`Move ${entry.title} down`}
                          className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={
                            pending ||
                            storefrontIndex === storefrontSlugs.length - 1
                          }
                          onClick={() => move(entry.slug, 1)}
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
                    <AdminMaterialThumb
                      entry={entry}
                      href={
                        onStorefront && !isDraft
                          ? `/materials/${entry.slug}`
                          : undefined
                      }
                    />
                  </td>
                  <td className="px-3 py-2.5 font-medium">{entry.title}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                    {entry.slug}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {entry.type}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {entry.tier}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                    {status}
                  </td>
                  <td className="px-3 py-2.5">
                    {isDraft || !onStorefront ? (
                      <span className="text-muted-foreground">
                        {isDraft ? "Hidden" : "Not on storefront"}
                      </span>
                    ) : (
                      <Link
                        className="underline underline-offset-4 hover:text-muted-foreground"
                        href={`/materials/${entry.slug}`}
                      >
                        View
                      </Link>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${entry.title}`}
                        className="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                        disabled={pending}
                      >
                        <RiMoreLine className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="bottom">
                        <DropdownMenuItem onClick={() => setEditSlug(entry.slug)}>
                          Edit
                        </DropdownMenuItem>
                        {!isDraft ? (
                          <DropdownMenuItem onClick={() => setStatus(entry.slug, "draft")}>
                            Draft
                          </DropdownMenuItem>
                        ) : null}
                        {isDraft ? (
                          <DropdownMenuItem onClick={() => setStatus(entry.slug, "published")}>
                            Post
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editRow ? (
        <AdminMaterialEditDialog
          entry={editRow.entry}
          onOpenChange={(open) => {
            if (!open) setEditSlug(null);
          }}
          open
          status={editRow.status}
        />
      ) : null}
    </>
  );
}

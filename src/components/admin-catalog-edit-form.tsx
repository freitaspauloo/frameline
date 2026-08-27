"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminCatalogRow } from "@/lib/demo-catalog";
import type { MaterialTier } from "@/materials";

type Props = {
  row: AdminCatalogRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TIERS: MaterialTier[] = ["free", "personal", "team"];

export function AdminCatalogEditDialog({ row, open, onOpenChange }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description);
  const [tier, setTier] = useState(row.tier);
  const [publishStatus, setPublishStatus] = useState(row.status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setTitle(row.title);
    setDescription(row.description);
    setTier(row.tier);
    setPublishStatus(row.status);
    setError(null);
  }, [open, row]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const body: Record<string, string> = {
        slug: row.slug,
        title,
        description,
        status: publishStatus,
      };
      if (row.kind === "material") {
        body.tier = tier;
      }

      const res = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {row.kind === "screen" ? "screen" : "material"}
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px]">
            {row.slug}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block space-y-1">
            <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Title
            </span>
            <input
              className="w-full border border-border bg-background px-2 py-1.5 text-sm"
              onChange={(e) => setTitle(e.target.value)}
              required
              value={title}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Description
            </span>
            <textarea
              className="w-full border border-border bg-background px-2 py-1.5 text-sm"
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              value={description}
            />
          </label>
          {row.kind === "material" ? (
            <label className="block space-y-1">
              <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Tier
              </span>
              <select
                className="w-full border border-border bg-background px-2 py-1.5 font-mono text-[11px]"
                onChange={(e) => setTier(e.target.value as MaterialTier)}
                value={tier}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="font-mono text-[11px] text-muted-foreground">
              Tier: paid (screens)
            </p>
          )}
          <label className="block space-y-1">
            <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Status
            </span>
            <select
              className="w-full border border-border bg-background px-2 py-1.5 font-mono text-[11px]"
              onChange={(e) =>
                setPublishStatus(e.target.value as "draft" | "published")
              }
              value={publishStatus}
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
          </label>
          {error ? (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3 pt-1">
            <button
              className="border border-border bg-foreground px-3 py-1.5 text-[0.625rem] font-semibold tracking-widest text-background uppercase disabled:opacity-50"
              disabled={pending}
              type="submit"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** @deprecated Use AdminCatalogEditDialog */
export function AdminMaterialEditDialog({
  entry,
  status,
  open,
  onOpenChange,
}: {
  entry: { slug: string; title: string; description: string; type: string; tier: string };
  status: "draft" | "published";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AdminCatalogEditDialog
      onOpenChange={onOpenChange}
      open={open}
      row={{
        kind: "material",
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        typeLabel: entry.type,
        tier: entry.tier,
        status,
        onStorefront: true,
        material: entry as never,
      }}
    />
  );
}

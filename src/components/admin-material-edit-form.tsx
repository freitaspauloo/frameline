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
import type { MaterialCatalogEntry, MaterialTier } from "@/materials";

type Props = {
  entry: MaterialCatalogEntry;
  status: "draft" | "published";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TIERS: MaterialTier[] = ["free", "personal", "team"];

export function AdminMaterialEditDialog({
  entry,
  status,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description);
  const [tier, setTier] = useState<MaterialTier>(entry.tier);
  const [publishStatus, setPublishStatus] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setTitle(entry.title);
    setDescription(entry.description);
    setTier(entry.tier);
    setPublishStatus(status);
    setError(null);
  }, [open, entry, status]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: entry.slug,
          title,
          description,
          tier,
          status: publishStatus,
        }),
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
          <DialogTitle>Edit material</DialogTitle>
          <DialogDescription className="font-mono text-[11px]">
            {entry.slug}
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

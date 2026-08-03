import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Frameline materials.",
};

/** Canonical search lives on the catalog with `?q=`. */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  redirect(`/materials${params.size ? `?${params}` : ""}`);
}

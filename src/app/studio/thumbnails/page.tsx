import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ThumbnailStudio,
  type ThumbnailStudioItem,
} from "@/components/thumbnail-studio";
import { getStudioToken, isStudioAuthorized } from "@/lib/studio-auth";
import { readThumbnailManifest } from "@/lib/thumbnail-store";
import { listThumbnailTargets } from "@/lib/thumbnail-targets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thumbnail studio",
  robots: { index: false, follow: false },
};

export default async function ThumbnailStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  if (!(await isStudioAuthorized(key))) notFound();

  const manifest = await readThumbnailManifest();
  const items: ThumbnailStudioItem[] = listThumbnailTargets().map((target) => ({
    ...target,
    thumbnail: manifest[target.slug],
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <ThumbnailStudio items={items} studioKey={key ?? getStudioToken() ?? ""} />
    </main>
  );
}

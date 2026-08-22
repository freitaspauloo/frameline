import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getScreenBySlug, listAllScreenEntries } from "@/screens/catalog";
import { ScreenLivePreview } from "@/screens/preview";

/** Poster capture surface — the screen full-bleed, no storefront chrome. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return listAllScreenEntries().map((screen) => ({ slug: screen.slug }));
}

export default async function CaptureRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getScreenBySlug(slug);
  if (!entry) notFound();

  return (
    <>
      {/* Both are portaled to body, so they would otherwise land in the poster. */}
      <style>{`[data-frameline-quota], nextjs-portal { display: none !important; }`}</style>
      <ScreenLivePreview embed={false} slug={entry.slug} />
    </>
  );
}

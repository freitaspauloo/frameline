import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getScreenBySlug, listAllScreenEntries } from "@/screens/catalog";
import { isForgeAiScreenSlug } from "@/screens/fifty-x-hero/forgeai-stage";
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

  const forgeai = isForgeAiScreenSlug(entry.slug);

  return (
    <>
      {/* Both are portaled to body, so they would otherwise land in the poster. */}
      <style>{`[data-frameline-quota], nextjs-portal { display: none !important; }`}</style>
      <div className={forgeai ? "w-full bg-[#000105]" : undefined}>
        <ScreenLivePreview embed={forgeai} slug={entry.slug} posterCapture />
      </div>
    </>
  );
}

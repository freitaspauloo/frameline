import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getScreenBySlug, listScreens } from "@/screens/catalog";
import { ScreenLivePreview } from "@/screens/preview";

/** Full-bleed live screen — no catalog chrome, navbar, or copy actions. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return listScreens().flatMap((screen) => [
    { slug: screen.slug },
    ...(screen.aliases ?? []).map((alias) => ({ slug: alias })),
  ]);
}

export default async function LiveScreenRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getScreenBySlug(slug);
  if (!entry) notFound();

  return (
    <>
      <style>{`[data-frameline-quota], nextjs-portal { display: none !important; }`}</style>
      <div className="min-h-dvh w-full bg-[#000105]">
        <ScreenLivePreview embed={false} slug={entry.slug} />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScreenDetailPage } from "@/components/screen-detail-page";
import { getScreenBySlug, listAllScreenEntries } from "@/screens/catalog";

export function generateStaticParams() {
  return listAllScreenEntries().flatMap((screen) => [
    { slug: screen.slug },
    ...(screen.aliases ?? []).map((alias) => ({ slug: alias })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getScreenBySlug(slug);
  if (!entry) return { title: "Screen" };
  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function ScreenDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    unlocked?: string;
    session_id?: string;
    cancelled?: string;
    email?: string;
  }>;
}) {
  const { slug } = await params;
  const entry = getScreenBySlug(slug);
  if (!entry) notFound();

  const sp = await searchParams;

  return (
    <ScreenDetailPage
      email={sp.email}
      entry={entry}
      sessionId={sp.session_id}
      unlocked={sp.unlocked === "1"}
    />
  );
}

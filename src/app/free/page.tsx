import type { Metadata } from "next";

import { FreeFunnelPage } from "@/components/free-funnel-page";
import { getResolvedCatalog } from "@/lib/demo-catalog";

export const metadata: Metadata = {
  title: "Free materials",
  description:
    "Install free Frameline materials — same craft bar as paid, CLI or copy-paste, no account required. Evaluate surface in your own build under 60 seconds.",
  openGraph: {
    title: "Free materials · Frameline",
    description:
      "Excellent free materials with install CTAs. Same craft bar as paid — no account required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free materials · Frameline",
    description:
      "Excellent free materials with install CTAs. Same craft bar as paid — no account required.",
  },
};

export default async function FreePage() {
  const catalog = await getResolvedCatalog();
  const free = catalog
    .filter((m) => m.tier === "free")
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  return <FreeFunnelPage materials={free} />;
}

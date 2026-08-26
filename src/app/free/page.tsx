import type { Metadata } from "next";

import { FreeFunnelPage } from "@/components/free-funnel-page";
import { getResolvedCatalog } from "@/lib/demo-catalog";

export const metadata: Metadata = {
  title: "Free materials",
  description:
    "Install free Frameline materials — same craft bar as paid. Sign in to copy CLI or JSX into your repo under 60 seconds.",
  openGraph: {
    title: "Free materials · Frameline",
    description:
      "Excellent free materials with install CTAs. Sign in to copy — same craft bar as paid.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free materials · Frameline",
    description:
      "Excellent free materials with install CTAs. Sign in to copy — same craft bar as paid.",
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

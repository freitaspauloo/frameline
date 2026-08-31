"use client";

import { FiftyXHero, ForgeAiLimeHero, ForgeAiPinkHero } from "@/screens/fifty-x-hero";
import { HealthAiHero } from "@/screens/health-ai";
import { RunningAppHero } from "@/screens/running-app";
import { getScreenBySlug } from "@/screens/catalog";

/** Storefront + review previews — shipped heroes only. */
export function ScreenLivePreview({
  embed = true,
  slug,
}: {
  embed?: boolean;
  slug: string;
}) {
  const canonical = getScreenBySlug(slug)?.slug ?? slug;

  switch (canonical) {
    case "health-ai":
      return <HealthAiHero className="h-full w-full" embed={embed} />;
    case "passo":
      return <RunningAppHero className="h-full w-full" embed={embed} />;
    case "forgeai-pink":
      return <ForgeAiPinkHero className="h-full w-full" embed={embed} />;
    case "forgeai":
      return <FiftyXHero className="h-full w-full" embed={embed} />;
    case "forgeai-lime":
      return <ForgeAiLimeHero className="h-full w-full" embed={embed} />;
    default:
      return <div className="absolute inset-0 bg-muted" />;
  }
}

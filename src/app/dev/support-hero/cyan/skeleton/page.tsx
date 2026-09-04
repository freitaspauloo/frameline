"use client";

import { SupportHeroSkeleton } from "@/screens/support-hero/support-hero-skeleton";
import { SUPPORT_HERO_THEME_CYAN } from "@/screens/support-hero/themes";

export default function DevSupportHeroCyanSkeletonPage() {
  return <SupportHeroSkeleton theme={SUPPORT_HERO_THEME_CYAN} />;
}

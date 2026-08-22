"use client";

import { BuiltForYield } from "@/screens/built-for-yield";
import { CatchKillerDefects } from "@/screens/catch-killer-defects";
import { DefectCapture } from "@/screens/defect-capture";
import { FeaturesSkeleton } from "@/screens/features-skeleton";
import { InsightsSkeletonScreen } from "@/screens/insights-skeleton";
import { Blueprint } from "@/screens/layouts/blueprint";
import { BrowserFrame } from "@/screens/layouts/browser-frame";
import { FeatureRail } from "@/screens/layouts/feature-rail";
import { LightRays } from "@/screens/layouts/light-rays";
import { MagentaLandscape } from "@/screens/layouts/magenta-landscape";
import { PromptBar } from "@/screens/layouts/prompt-bar";
import { SpacemanMoon } from "@/screens/spaceman-moon";
import { YieldSkeleton } from "@/screens/yield-skeleton";
import { getScreenBySlug } from "@/screens/catalog";

export function ScreenLivePreview({
  embed = true,
  slug,
}: {
  embed?: boolean;
  slug: string;
}) {
  const canonical = getScreenBySlug(slug)?.slug ?? slug;

  switch (canonical) {
    case "orb":
      return <BuiltForYield embed={embed} />;
    case "feature-cards":
      return <CatchKillerDefects embed={embed} />;
    case "insights":
      return <DefectCapture embed={embed} />;
    case "magenta-landscape":
      return <MagentaLandscape embed={embed} />;
    case "browser-frame":
      return <BrowserFrame embed={embed} />;
    case "feature-rail":
      return <FeatureRail embed={embed} />;
    case "blueprint":
      return <Blueprint embed={embed} />;
    case "spaceman-moon":
      return <SpacemanMoon className="h-full w-full" embed={embed} />;
    case "light-rays":
      return <LightRays embed={embed} />;
    case "prompt-bar":
      return <PromptBar embed={embed} />;
    case "yield-skeleton":
      return <YieldSkeleton embed={embed} />;
    case "features-skeleton":
      return <FeaturesSkeleton embed={embed} />;
    case "insights-skeleton":
      return <InsightsSkeletonScreen embed={embed} />;
    default:
      return <div className="absolute inset-0 bg-muted" />;
  }
}

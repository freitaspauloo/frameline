"use client";

import { BuiltForYield } from "@/screens/built-for-yield";
import { CatchKillerDefects } from "@/screens/catch-killer-defects";
import { DefectCapture } from "@/screens/defect-capture";
import { FeaturesSkeleton } from "@/screens/features-skeleton";
import { InsightsSkeletonScreen } from "@/screens/insights-skeleton";
import { SpacemanMoon } from "@/screens/spaceman-moon";
import { YieldSkeleton } from "@/screens/yield-skeleton";

export function ScreenLivePreview({
  embed = true,
  slug,
}: {
  embed?: boolean;
  slug: string;
}) {
  switch (slug) {
    case "spaceman-moon":
      return <SpacemanMoon className="h-full w-full" embed={embed} />;
    case "built-for-yield":
      return <BuiltForYield embed={embed} />;
    case "catch-killer-defects":
      return <CatchKillerDefects embed={embed} />;
    case "defect-capture":
      return <DefectCapture embed={embed} />;
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

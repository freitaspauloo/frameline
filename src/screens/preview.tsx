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
import { ReticleAsciiHero, ReticleAsciiHeroSkeleton } from "@/screens/ascii-hero";
import { BridgeDither, BridgeDitherSkeleton } from "@/screens/bridge-dither";
import { DarkPillHero, DarkPillHeroSkeleton } from "@/screens/dark-pill-hero";
import { MexinHero, MexinHeroSkeleton } from "@/screens/mexin-hero";
import { RunningAppHero, RunningAppHeroMono, RunningAppSkeleton, RunningAppSkeletonMono } from "@/screens/running-app";
import { ReticleLoginPage, ReticleLoginCyanPage, ReticleLoginSkeleton, ReticleLoginCyanSkeleton } from "@/screens/miracle-login";
import { FiftyXHero, FiftyXHeroSkeleton, ForgeAiLimeHero, ForgeAiLimeSkeleton, ForgeAiPinkHero, ForgeAiPinkSkeleton } from "@/screens/fifty-x-hero";
import { HealthAiHero, HealthAiSkeleton } from "@/screens/health-ai";
import { Softwave, SoftwaveSkeleton } from "@/screens/softwave";
import { SoftwaveFeatureCards, SoftwaveFeatureCardsSkeleton } from "@/screens/softwave-features";
import { SpacemanMoon } from "@/screens/spaceman-moon";
import { YieldSkeleton } from "@/screens/yield-skeleton";
import { getScreenBySlug } from "@/screens/catalog";

export function ScreenLivePreview({
  embed = true,
  slug,
  posterCapture = false,
}: {
  embed?: boolean;
  slug: string;
  /** Headless poster capture — static assets where video → WebGL is unreliable. */
  posterCapture?: boolean;
}) {
  const canonical = getScreenBySlug(slug)?.slug ?? slug;

  switch (canonical) {
    case "passo-mono-skeleton":
      return <RunningAppSkeletonMono className="h-full w-full" embed={embed} />;
    case "passo-skeleton":
      return <RunningAppSkeleton className="h-full w-full" embed={embed} />;
    case "passo-mono":
      return <RunningAppHeroMono className="h-full w-full" embed={embed} />;
    case "passo":
      return <RunningAppHero className="h-full w-full" embed={embed} />;
    case "health-ai-skeleton":
      return <HealthAiSkeleton className="h-full w-full" embed={embed} />;
    case "health-ai":
      return (
        <HealthAiHero
          className="h-full w-full"
          embed={embed}
          staticHero={posterCapture}
        />
      );
    case "forgeai-pink-skeleton":
      return <ForgeAiPinkSkeleton className="h-full w-full" embed={embed} />;
    case "forgeai-lime-skeleton":
      return <ForgeAiLimeSkeleton className="h-full w-full" embed={embed} />;
    case "forgeai-pink":
      return <ForgeAiPinkHero className="h-full w-full" embed={embed} />;
    case "forgeai-lime":
      return <ForgeAiLimeHero className="h-full w-full" embed={embed} />;
    case "forgeai":
      return <FiftyXHero className="h-full w-full" embed={embed} />;
    case "forgeai-skeleton":
      return <FiftyXHeroSkeleton className="h-full w-full" embed={embed} />;
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
    case "ascii-hero":
      return <ReticleAsciiHero className="h-full w-full" embed={embed} />;
    case "dark-pill-hero":
      return <DarkPillHero className="h-full w-full" embed={embed} />;
    case "softwave":
      return <Softwave className="h-full w-full" embed={embed} />;
    case "softwave-features":
      return <SoftwaveFeatureCards className="h-full w-full" embed={embed} />;
    case "bridge-dither":
      return <BridgeDither className="h-full w-full" embed={embed} />;
    case "mexin-hero":
      return <MexinHero className="h-full w-full" embed={embed} />;
    case "miracle-login":
      return <ReticleLoginPage className="h-full w-full" embed={embed} />;
    case "miracle-login-cyan":
      return <ReticleLoginCyanPage className="h-full w-full" embed={embed} />;
    case "yield-skeleton":
      return <YieldSkeleton embed={embed} />;
    case "features-skeleton":
      return <FeaturesSkeleton embed={embed} />;
    case "insights-skeleton":
      return <InsightsSkeletonScreen embed={embed} />;
    case "ascii-hero-skeleton":
      return <ReticleAsciiHeroSkeleton className="h-full w-full" embed={embed} />;
    case "dark-pill-hero-skeleton":
      return <DarkPillHeroSkeleton className="h-full w-full" embed={embed} />;
    case "softwave-skeleton":
      return <SoftwaveSkeleton className="h-full w-full" embed={embed} />;
    case "softwave-features-skeleton":
      return <SoftwaveFeatureCardsSkeleton className="h-full w-full" embed={embed} />;
    case "bridge-dither-skeleton":
      return <BridgeDitherSkeleton className="h-full w-full" embed={embed} />;
    case "mexin-hero-skeleton":
      return <MexinHeroSkeleton className="h-full w-full" embed={embed} />;
    case "miracle-login-cyan-skeleton":
      return <ReticleLoginCyanSkeleton className="h-full w-full" embed={embed} />;
    case "miracle-login-skeleton":
      return <ReticleLoginSkeleton className="h-full w-full" embed={embed} />;
    default:
      return <div className="absolute inset-0 bg-muted" />;
  }
}

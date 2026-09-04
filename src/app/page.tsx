import { FramelineHomePageV2 } from "@/components/frameline-home-page-v2";
import { getResolvedCatalog, getResolvedScreens } from "@/lib/demo-catalog";

export const dynamic = "force-dynamic";

/** Production homepage — Phase-03 landing (formerly /v2). */
export default async function Home() {
  const [catalog, screens] = await Promise.all([
    getResolvedCatalog(),
    getResolvedScreens(),
  ]);
  return <FramelineHomePageV2 catalog={catalog} screens={screens} />;
}

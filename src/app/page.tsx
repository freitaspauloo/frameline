import { FramelineHomePageV2 } from "@/components/frameline-home-page-v2";
import { getResolvedCatalog } from "@/lib/demo-catalog";

/** Production homepage — Phase-03 landing (formerly /v2). */
export default async function Home() {
  const catalog = await getResolvedCatalog();
  return <FramelineHomePageV2 catalog={catalog} />;
}

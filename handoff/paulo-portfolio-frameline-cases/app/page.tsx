import { EnterpriseSection } from "@/src/components/EnterpriseSection";
import { HomeFeaturedWork } from "@/src/components/HomeFeaturedWork";
import { HomeFramelineWork } from "@/src/components/HomeFramelineWork";
import { HomeHero } from "@/src/components/HomeHero";

export default function HomePage() {
  return (
    <div className="frame-home">
      <HomeHero />
      <HomeFeaturedWork />
      <HomeFramelineWork />
      <EnterpriseSection variant="frame" />
    </div>
  );
}

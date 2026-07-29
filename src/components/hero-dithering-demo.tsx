"use client"

import {
  AISDKIcon,
  HeroDithering,
  HeroDitheringActions,
  HeroDitheringBadges,
  HeroDitheringContainer,
  HeroDitheringContent,
  HeroDitheringDescription,
  HeroDitheringHeading,
  HeroDitheringMobileVisual,
  HeroDitheringRoot,
  HeroDitheringVisual,
  NextjsIcon,
} from "@/components/ui/hero-dithering"

const heroContainerClassName =
  "relative z-10 mx-auto w-full max-w-7xl grid gap-6 pb-16 sm:gap-8 sm:pb-20 lg:grid-cols-[1fr_minmax(320px,560px)] lg:items-center lg:gap-12 lg:pb-24 xl:grid-cols-[1fr_1fr]"

export function HeroDitheringDemo() {
  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Default</h3>
        <HeroDithering
          className="min-h-[720px] pb-28 lg:pb-0"
          containerClassName={heroContainerClassName}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Configured Via Props</h3>
        <HeroDitheringRoot
          className="min-h-[720px] pb-28 lg:pb-0"
          ctaProps={{
            href: "#",
            label: "Try NewCopy for marketing",
          }}
          description="Human-in-the-loop marketing copy software that helps teams draft, review, and ship high-converting campaigns with confidence."
          desktopShaderProps={{
            colorFront: "#8b5cf6",
            scale: 0.8,
            speed: 0.7,
          }}
          mobileShaderProps={{
            colorFront: "#8b5cf6",
            speed: 0.65,
          }}
          srTitle="Composable hero"
          subtitle="Marketing"
          techStack={[
            { name: "Next.js", version: "v16" },
            { name: "AI SDK", version: "v6" },
            { name: "Tailwind", version: "v4" },
          ]}
          title="Cursor for"
        >
          <HeroDitheringContainer className={heroContainerClassName}>
            <HeroDitheringContent>
              <HeroDitheringHeading />
              <HeroDitheringDescription />
              <HeroDitheringActions />
              <div
                className="flex justify-center lg:justify-start"
                data-slot="hero-dithering-badges-wrap"
              >
                <HeroDitheringBadges
                  techStack={[
                    { name: "Next.js", version: "v16", icon: NextjsIcon },
                    { name: "AI SDK", version: "v6", icon: AISDKIcon },
                  ]}
                />
              </div>
            </HeroDitheringContent>
            <HeroDitheringVisual />
          </HeroDitheringContainer>
          <HeroDitheringMobileVisual />
        </HeroDitheringRoot>
      </div>
    </div>
  )
}

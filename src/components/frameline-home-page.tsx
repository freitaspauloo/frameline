"use client";

import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";
import { AuroraMesh } from "@/materials";

const HERO_COLORS = ["#F4F7FA", "#C5D8EA", "#2D6BFF", "#0B1220"];

export function FramelineHomePage() {
  return (
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <section className="relative isolate min-h-dvh overflow-hidden">
        <div className="frameline-material-in absolute inset-0 -z-10">
          <AuroraMesh
            className="absolute inset-0 h-full w-full"
            colors={HERO_COLORS}
            distortion={0.72}
            scale={0.78}
            speed={0.32}
            swirl={0.42}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(105deg,rgba(252,252,253,0.88)_0%,rgba(252,252,253,0.55)_42%,rgba(252,252,253,0.12)_72%,transparent_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-relay-white to-transparent"
          />
        </div>

        <MarketingNavbar tone="overlay" />

        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col justify-end px-6 pb-16 pt-10 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="max-w-3xl space-y-7">
            <p
              className="frameline-rise font-heading text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-relay-ink"
              style={{ animationDelay: "60ms" }}
            >
              Frameline
            </p>

            <h1
              className="frameline-rise max-w-[16ch] font-heading text-[clamp(1.85rem,4.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-relay-ink"
              style={{ animationDelay: "160ms" }}
            >
              Design assets for the AI era
            </h1>

            <p
              className="frameline-rise max-w-[36ch] text-pretty text-base leading-relaxed text-relay-ink/70 sm:text-lg"
              style={{ animationDelay: "260ms" }}
            >
              Shippable surface — so you don’t ship the default AI look.
            </p>

            <div
              className="frameline-rise flex flex-wrap gap-3 pt-1"
              style={{ animationDelay: "360ms" }}
            >
              <RelayButton
                className="h-11 px-6 transition-transform duration-300 ease-[var(--ease-emil)] hover:-translate-y-0.5"
                nativeButton={false}
                render={<Link href="/materials" />}
              >
                Browse materials
              </RelayButton>
              <RelayButton
                className="h-11 px-6 bg-relay-white/80 backdrop-blur-sm transition-transform duration-300 ease-[var(--ease-emil)] hover:-translate-y-0.5"
                nativeButton={false}
                render={<Link href="/pricing" />}
                variant="secondary"
              >
                Pricing
              </RelayButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-relay-border bg-relay-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Surface that installs as code
            </h2>
            <p className="max-w-[48ch] text-base leading-relaxed text-relay-secondary">
              Gradients, textures, and motion — typed React components, token-bound,
              production-safe. Free to evaluate. Buy when you need depth.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                title: "Free to evaluate",
                body: "Excellent free materials. Same craft bar as paid.",
              },
              {
                title: "Install as source",
                body: "CLI or copy JSX. You own the component in your repo.",
              },
              {
                title: "Buy for depth",
                body: "Paid unlocks signature materials and commercial clarity.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2 border-t border-relay-border pt-5">
                <h3 className="font-heading text-base font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-relay-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div>
            <RelayButton
              className="h-11 px-6"
              nativeButton={false}
              render={<Link href="/materials" />}
            >
              Open catalog
            </RelayButton>
          </div>
        </div>
      </section>
    </div>
  );
}

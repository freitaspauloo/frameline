import { LogoMark } from "@/components/relay-ui";
import {
  MarketingRailCross,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingSectionHeader,
  MarketingSectionSpacer,
  MarketingShell,
  MarketingSplit,
  marketingPadX,
} from "@/components/marketing-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function NavLinkSkeleton() {
  return <Skeleton className="h-3 w-16 rounded-none" />;
}

function CatalogCardSkeleton() {
  return (
    <div className="border border-border">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
    </div>
  );
}

function SectionIntroSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-3 w-20 rounded-none" />
        <Skeleton className="h-9 w-72 max-w-full rounded-none sm:h-10" />
        <Skeleton className="h-4 w-full max-w-[48ch] rounded-none" />
        <Skeleton className="h-4 w-3/4 max-w-[36ch] rounded-none" />
      </div>
      {withAction ? <Skeleton className="h-9 w-28 rounded-none" /> : null}
    </div>
  );
}

/**
 * Full-page loading shell that mirrors the Frameline marketing homepage:
 * rails, centered mark, hero, catalog grid, and footer placeholders.
 */
export function FramelineHomeSkeleton() {
  return (
    <MarketingShell>
      <div aria-busy="true" aria-label="Loading Frameline" role="status">
        <span className="sr-only">Loading page content…</span>

        {/* —— Hero —— */}
        <section className="relative isolate flex min-h-dvh flex-col bg-background">
          <header className="sticky top-0 z-50 overflow-visible border-b border-border bg-white">
            <div className="relative mx-auto max-w-7xl overflow-visible">
              <MarketingRailCross edge="bottom" />
              <div
                className={cn(
                  "grid h-16 grid-cols-[1fr_auto_1fr] items-center",
                  marketingPadX,
                )}
              >
                <nav
                  aria-hidden
                  className="hidden items-center gap-4 md:flex"
                >
                  <NavLinkSkeleton />
                  <NavLinkSkeleton />
                  <NavLinkSkeleton />
                  <NavLinkSkeleton />
                </nav>

                <div className="justify-self-center">
                  <LogoMark className="size-10" />
                </div>

                <div
                  aria-hidden
                  className="flex items-center justify-end gap-2"
                >
                  <Skeleton className="hidden h-8 w-16 rounded-none sm:block" />
                  <Skeleton className="h-8 w-32 rounded-none" />
                </div>
              </div>
            </div>
          </header>

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div
              className={cn(
                "flex flex-col items-center pt-16 pb-12 text-center sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16",
                marketingPadX,
              )}
            >
              <div className="flex w-full max-w-3xl flex-col items-center space-y-7">
                <div className="flex w-full flex-col items-center gap-3">
                  <Skeleton className="h-12 w-[min(100%,28rem)] rounded-none sm:h-14 lg:h-16" />
                  <Skeleton className="h-12 w-[min(90%,22rem)] rounded-none sm:h-14 lg:h-16" />
                </div>
                <Skeleton className="h-5 w-[min(100%,24rem)] rounded-none" />
                <Skeleton className="mt-3 h-11 w-44 rounded-none" />
              </div>
            </div>
          </div>

          <div className="relative mt-auto min-h-[min(62dvh,720px)] w-full flex-1 overflow-visible px-6 pb-10 sm:px-8 lg:px-12">
            <div className="mx-auto flex h-full max-w-5xl flex-col justify-end">
              <Skeleton className="aspect-[16/10] w-full rounded-none border border-border" />
            </div>
          </div>
        </section>

        {/* —— Credits —— */}
        <MarketingSection>
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-10",
              marketingPadX,
            )}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-3 w-16 rounded-none sm:w-20"
              />
            ))}
          </div>
        </MarketingSection>

        <MarketingSectionSpacer size="lg" />

        {/* —— Catalog —— */}
        <MarketingSection>
          <MarketingSectionHeader>
            <SectionIntroSkeleton />
          </MarketingSectionHeader>

          <div
            className={cn(
              "grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:gap-x-12 lg:gap-y-12",
              marketingPadX,
              "pt-10 pb-2 lg:pt-14",
            )}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <CatalogCardSkeleton key={i} />
            ))}
          </div>

          <div className={cn("flex justify-center py-10", marketingPadX)}>
            <Skeleton className="h-11 w-44 rounded-none" />
          </div>
        </MarketingSection>

        <MarketingSectionSpacer size="lg" />

        {/* —— Collections —— */}
        <MarketingSection>
          <MarketingSectionHeader>
            <SectionIntroSkeleton withAction />
          </MarketingSectionHeader>

          <MarketingRuledGrid cols={2}>
            {Array.from({ length: 2 }, (_, i) => (
              <MarketingRuledCell
                key={i}
                className="p-0 sm:p-0 lg:p-0"
              >
                <Skeleton className="aspect-[21/9] w-full rounded-none" />
                <div className="flex items-center justify-between gap-4 border-t border-border p-6 sm:p-8">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 rounded-none" />
                    <Skeleton className="h-4 w-56 max-w-full rounded-none" />
                  </div>
                  <Skeleton className="h-3 w-16 shrink-0 rounded-none" />
                </div>
              </MarketingRuledCell>
            ))}
          </MarketingRuledGrid>
        </MarketingSection>

        <MarketingSectionSpacer size="lg" />

        {/* —— Install —— */}
        <MarketingSection>
          <MarketingSplit
            left={
              <div className="space-y-5">
                <Skeleton className="h-3 w-16 rounded-none" />
                <Skeleton className="h-9 w-56 max-w-full rounded-none" />
                <Skeleton className="h-4 w-full max-w-[42ch] rounded-none" />
                <Skeleton className="h-4 w-3/4 max-w-[32ch] rounded-none" />
                <div className="flex flex-wrap gap-3 pt-1">
                  <Skeleton className="h-11 w-40 rounded-none" />
                  <Skeleton className="h-11 w-36 rounded-none" />
                </div>
              </div>
            }
            right={
              <Skeleton className="min-h-[12rem] w-full rounded-none border border-border sm:min-h-[14rem]" />
            }
          />
        </MarketingSection>

        <MarketingSectionSpacer size="lg" />

        {/* —— Why —— */}
        <MarketingSection>
          <MarketingSectionHeader>
            <SectionIntroSkeleton />
          </MarketingSectionHeader>

          <MarketingRuledGrid closeBottom>
            {Array.from({ length: 3 }, (_, i) => (
              <MarketingRuledCell key={i} className="space-y-3">
                <Skeleton className="h-5 w-32 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-4 w-4/5 rounded-none" />
              </MarketingRuledCell>
            ))}
          </MarketingRuledGrid>
        </MarketingSection>

        <MarketingSectionSpacer size="lg" />

        {/* —— Footer —— */}
        <MarketingSection>
          <MarketingRuledGrid
            cols={2}
            className="lg:grid-cols-[1.2fr_2fr]"
          >
            <MarketingRuledCell className="space-y-4 lg:col-span-1">
              <div className="inline-flex items-center gap-2">
                <LogoMark className="size-8" />
                <Skeleton className="h-4 w-24 rounded-none" />
              </div>
              <Skeleton className="h-4 w-full max-w-[28ch] rounded-none" />
              <Skeleton className="h-4 w-4/5 max-w-[22ch] rounded-none" />
            </MarketingRuledCell>

            <MarketingRuledCell>
              <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, col) => (
                  <div key={col} className="space-y-3">
                    <Skeleton className="h-3 w-16 rounded-none" />
                    <ul className="space-y-2">
                      {Array.from({ length: 4 }, (_, row) => (
                        <li key={row}>
                          <Skeleton className="h-3.5 w-20 rounded-none" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </MarketingRuledCell>
          </MarketingRuledGrid>
        </MarketingSection>
      </div>
    </MarketingShell>
  );
}

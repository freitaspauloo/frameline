"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import {
  AuroraMesh,
  GrainField,
  InkDither,
  getMaterial,
  type MaterialCatalogEntry,
} from "@/materials";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
};

const ACCENT = "#3A58F0";

function buildJsxSnippet(slug: string, props: Record<string, unknown>) {
  const entries = Object.entries(props).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  const propsStr = entries
    .map(([k, v]) => {
      if (typeof v === "number") return `  ${k}={${v}}`;
      if (typeof v === "boolean") return v ? `  ${k}` : null;
      if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
      return `  ${k}=${JSON.stringify(String(v))}`;
    })
    .filter(Boolean)
    .join("\n");

  const name =
    slug === "aurora-mesh"
      ? "AuroraMesh"
      : slug === "ink-dither"
        ? "InkDither"
        : "GrainField";

  return `import { ${name} } from "@/materials";\n\n<${name}\n${propsStr}\n  className="absolute inset-0"\n/>`;
}

function LivePreview({
  entry,
  props,
}: {
  entry: MaterialCatalogEntry;
  props: Record<string, unknown>;
}) {
  const common = "absolute inset-0 h-full w-full";
  switch (entry.slug) {
    case "aurora-mesh":
      return (
        <AuroraMesh
          className={common}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
          swirl={props.swirl as number | undefined}
        />
      );
    case "ink-dither":
      return (
        <InkDither
          className={common}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "grain-field":
      return (
        <GrainField
          className={common}
          colors={props.colors as string[] | undefined}
          intensity={props.intensity as number | undefined}
          noise={props.noise as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    default:
      return null;
  }
}

function useMaterialControls(slug: string) {
  if (slug === "aurora-mesh") {
    return {
      defaults: {
        speed: 0.47,
        distortion: 0.8,
        swirl: 0.5,
        scale: 0.69,
        colors: ["#E3FFFE", "#C5F0FF", "#FF008D", "#B700FF"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "distortion", label: "Distortion", min: 0, max: 1, step: 0.01 },
        { key: "swirl", label: "Swirl", min: 0, max: 1, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
    };
  }
  if (slug === "ink-dither") {
    return {
      defaults: {
        speed: 0.35,
        size: 3,
        colorBack: "#0A0A0A",
        colorFront: "#2D6BFF",
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "size", label: "Size", min: 1, max: 12, step: 0.5 },
      ],
      colors: [
        { key: "colorBack", label: "Back" },
        { key: "colorFront", label: "Front" },
      ],
    };
  }
  return {
    defaults: {
      speed: 0.4,
      softness: 0.65,
      intensity: 0.45,
      noise: 0.35,
      colors: ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"],
    },
    fields: [
      { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
      { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
      { key: "intensity", label: "Intensity", min: 0, max: 1, step: 0.01 },
      { key: "noise", label: "Noise", min: 0, max: 1, step: 0.01 },
    ],
  };
}

/** Small ruled panel used down the configurator column. */
function Panel({
  action,
  children,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className={marketingPad}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function MaterialDetailPage({ slug }: Props) {
  const entry = getMaterial(slug);
  if (!entry) notFound();

  const controls = useMaterialControls(slug);
  const [props, setProps] = React.useState(controls.defaults);
  const [copied, setCopied] = React.useState(false);

  const snippet = React.useMemo(
    () => buildJsxSnippet(slug, props),
    [slug, props],
  );

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <Button
              nativeButton={false}
              render={<Link href="/materials" />}
              size="sm"
              variant="outline"
            >
              <RiArrowLeftLine data-icon="inline-start" />
              All materials
            </Button>
          }
          description={entry.description}
          eyebrow={`Material · ${entry.type} · ${entry.tier === "free" ? "Free" : "Paid"}`}
          title={entry.title}
        />

        <div className="relative grid overflow-visible lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-border">
          <div
            className={cn(
              "border-b border-border lg:border-b-0",
              marketingPad,
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-border bg-foreground">
              <LivePreview entry={entry} props={props} />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-3">
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Type
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  {entry.type}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Contexts
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  {entry.useContexts.join(" · ")}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Tags
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  {entry.tags.join(" · ")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="divide-y divide-border">
            <Panel title="Configurator">
              <div className="space-y-6">
                {controls.fields.map((field) => (
                  <label className="block" key={field.key}>
                    <span className="flex justify-between font-mono text-[11px] text-muted-foreground">
                      <span>{field.label}</span>
                      <span className="text-foreground tabular-nums">
                        {Number(
                          props[field.key as keyof typeof props],
                        ).toFixed(2)}
                      </span>
                    </span>
                    <input
                      className="mt-3 w-full"
                      max={field.max}
                      min={field.min}
                      step={field.step}
                      style={{ accentColor: ACCENT }}
                      type="range"
                      value={Number(props[field.key as keyof typeof props])}
                      onChange={(e) =>
                        setProps((prev) => ({
                          ...prev,
                          [field.key]: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                ))}
                {"colors" in controls &&
                  controls.colors?.map((c) => (
                    <label
                      className="flex items-center justify-between gap-3 border-t border-border pt-5"
                      key={c.key}
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {c.label}
                      </span>
                      <input
                        className="size-7 cursor-pointer border border-border bg-transparent"
                        type="color"
                        value={String(props[c.key as keyof typeof props])}
                        onChange={(e) =>
                          setProps((prev) => ({
                            ...prev,
                            [c.key]: e.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
              </div>
            </Panel>

            <Panel
              action={
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {entry.tier}
                </span>
              }
              title={entry.tier === "free" ? "Install" : "Get access"}
            >
              <div className="space-y-3">
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link
                      href={
                        entry.tier === "free"
                          ? `/docs/installation?material=${entry.slug}`
                          : `/pricing?material=${entry.slug}`
                      }
                    />
                  }
                  size="lg"
                >
                  {entry.tier === "free" ? "Install material" : "Buy license"}
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={copySnippet}
                >
                  {copied
                    ? "Copied JSX"
                    : entry.tier === "free"
                      ? "Copy JSX"
                      : "Copy preview JSX"}
                </Button>
                <p className="pt-2 text-sm leading-relaxed text-muted-foreground">
                  {entry.tier === "free"
                    ? "Free — no account required. Source lands in your repo."
                    : "Install unlocks after purchase. Preview JSX is for evaluation."}
                </p>
              </div>
            </Panel>

            <Panel title="JSX">
              <pre className="overflow-x-auto bg-foreground p-5 font-mono text-[11px] leading-relaxed text-background">
                {snippet}
              </pre>
            </Panel>
          </div>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

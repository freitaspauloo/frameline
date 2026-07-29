"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  AuroraMesh,
  GrainField,
  InkDither,
  getMaterial,
  type MaterialCatalogEntry,
} from "@/materials";
import { RelayButton } from "@/components/relay-ui";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
};

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
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-24 pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:px-8">
        <div>
          <Link
            className="font-mono text-[12px] text-relay-secondary hover:text-relay-ink"
            href="/materials"
          >
            ← Materials
          </Link>
          <h1 className="mt-3 font-display text-4xl tracking-tight">
            {entry.title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-relay-secondary">
            {entry.description}
          </p>

          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-relay-lg border border-relay-border bg-relay-ink shadow-relay-sm">
            <LivePreview entry={entry} props={props} />
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-relay-lg border border-relay-border bg-relay-panel p-5">
            <h2 className="text-sm font-medium tracking-tight">Configurator</h2>
            <div className="mt-4 space-y-4">
              {controls.fields.map((field) => (
                <label className="block" key={field.key}>
                  <span className="flex justify-between font-mono text-[11px] text-relay-secondary">
                    <span>{field.label}</span>
                    <span>{Number(props[field.key as keyof typeof props]).toFixed(2)}</span>
                  </span>
                  <input
                    className="mt-2 w-full accent-relay-blue"
                    max={field.max}
                    min={field.min}
                    step={field.step}
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
                  <label className="flex items-center justify-between gap-3" key={c.key}>
                    <span className="font-mono text-[11px] text-relay-secondary">
                      {c.label}
                    </span>
                    <input
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
          </section>

          <section className="rounded-relay-lg border border-relay-border bg-relay-panel p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium tracking-tight">
                {entry.tier === "free" ? "Install" : "Get access"}
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wide text-relay-secondary">
                {entry.tier}
              </span>
            </div>
            {entry.tier === "free" ? (
              <div className="mt-4 space-y-3">
                <RelayButton
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link href={`/docs/installation?material=${entry.slug}`} />
                  }
                >
                  Install material
                </RelayButton>
                <RelayButton
                  className="w-full"
                  onClick={copySnippet}
                  variant="secondary"
                >
                  {copied ? "Copied JSX" : "Copy JSX"}
                </RelayButton>
                <p className="text-sm text-relay-secondary">
                  Free — no account required. Source lands in your repo.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <RelayButton
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link href={`/pricing?material=${entry.slug}`} />
                  }
                >
                  Buy license
                </RelayButton>
                <RelayButton
                  className="w-full"
                  onClick={copySnippet}
                  variant="secondary"
                >
                  {copied ? "Copied preview JSX" : "Copy preview JSX"}
                </RelayButton>
                <p className="text-sm text-relay-secondary">
                  Install unlocks after purchase. Preview JSX is for evaluation.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-relay-lg border border-relay-border bg-relay-panel p-5">
            <h2 className="text-sm font-medium tracking-tight">JSX</h2>
            <pre
              className={cn(
                "mt-3 overflow-x-auto rounded-relay-md bg-relay-ink p-4",
                "font-mono text-[11px] leading-relaxed text-relay-white",
              )}
            >
              {snippet}
            </pre>
            <p className="mt-3 font-mono text-[11px] text-relay-secondary">
              contexts: {entry.useContexts.join(", ")}
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}

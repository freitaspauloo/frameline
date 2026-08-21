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
import { Slider } from "@/components/ui/slider";
import { recordInstallIntent } from "@/lib/install-intent";
import { getLicensePlan } from "@/lib/license-plans";
import { cn } from "@/lib/utils";
import {
  getMaterial,
  getMaterialPropDefaults,
  getMaterialProps,
  type MaterialCatalogEntry,
  type MaterialPropDef,
} from "@/materials";
import {
  getMaterialComponentName,
  renderMaterial,
} from "@/materials/renderers";

type Props = {
  slug: string;
  initialParams?: Record<string, string | string[] | undefined>;
  /** Resolved catalog entry (with demo overrides). Falls back to source catalog. */
  entry?: MaterialCatalogEntry;
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

  const name = getMaterialComponentName(slug);

  return `import { ${name} } from "@/materials";\n\n<${name}\n${propsStr}\n  className="absolute inset-0"\n/>`;
}

function LivePreview({
  entry,
  forceStatic = false,
  props,
}: {
  entry: MaterialCatalogEntry;
  forceStatic?: boolean;
  props: Record<string, unknown>;
}) {
  return renderMaterial(entry.slug, {
    className: "absolute inset-0 h-full w-full",
    forceStatic,
    props,
  });
}

type ControlField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
};

type ColorField = { key: string; label: string };

type MaterialControls = {
  defaults: Record<string, unknown>;
  fields: ControlField[];
  colors?: ColorField[];
};

function mergePropsFromSearchParams(
  defaults: Record<string, unknown>,
  fields: ControlField[],
  colorFields: ColorField[] | undefined,
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): Record<string, unknown> {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(key) ?? undefined;
    }
    const raw = params[key];
    if (Array.isArray(raw)) return raw[0];
    return raw;
  };

  const next = { ...defaults };
  for (const field of fields) {
    const raw = get(field.key);
    if (raw == null || raw === "") continue;
    const n = Number(raw);
    if (!Number.isFinite(n)) continue;
    next[field.key] = Math.min(field.max, Math.max(field.min, n));
  }
  for (const c of colorFields ?? []) {
    const raw = get(c.key);
    if (raw && /^#[0-9A-Fa-f]{6}$/.test(raw)) {
      next[c.key] = raw;
    }
  }
  return next;
}

function propsToSearchParams(
  props: Record<string, unknown>,
  fields: ControlField[],
  colorFields: ColorField[] | undefined,
  defaults?: Record<string, unknown>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const field of fields) {
    const v = props[field.key];
    if (typeof v === "number" && Number.isFinite(v)) {
      if (defaults && defaults[field.key] === v) continue;
      params.set(field.key, String(v));
    }
  }
  for (const c of colorFields ?? []) {
    const v = props[c.key];
    if (typeof v === "string" && v) {
      if (defaults && defaults[c.key] === v) continue;
      params.set(c.key, v);
    }
  }
  return params;
}

function useMaterialControls(slug: string): MaterialControls {
  const defs = getMaterialProps(slug);
  const defaults: Record<string, unknown> = {};
  const fields: ControlField[] = [];
  const colorFields: ColorField[] = [];

  for (const def of defs) {
    defaults[def.key] = def.defaultValue;
    if (def.kind === "number" && def.min != null && def.max != null) {
      fields.push({
        key: def.key,
        label: def.label,
        min: def.min,
        max: def.max,
        step: def.step ?? 0.01,
      });
    } else if (def.kind === "color") {
      colorFields.push({ key: def.key, label: def.label });
    }
  }

  return {
    defaults,
    fields,
    colors: colorFields.length ? colorFields : undefined,
  };
}

function formatPropDefault(value: MaterialPropDef["defaultValue"]): string {
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
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

export function MaterialDetailPage({ slug, initialParams, entry: entryProp }: Props) {
  const entry = entryProp ?? getMaterial(slug);
  if (!entry) notFound();

  const controls = useMaterialControls(slug);
  const [props, setProps] = React.useState(() =>
    mergePropsFromSearchParams(
      controls.defaults,
      controls.fields,
      controls.colors,
      initialParams ?? {},
    ),
  );
  const [copied, setCopied] = React.useState(false);
  const [copiedCli, setCopiedCli] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  /** Explicit reduced-motion toggle → CSS shell fallback (separate from Pause). */
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const urlSyncReady = React.useRef(false);
  const license = getLicensePlan("free");
  const cliSnippet = `npx shadcn@latest add @frameline/${entry.slug}`;
  const pastePath = `components/ui/${entry.slug}.tsx`;
  const forceStaticPreview = paused || reducedMotion;

  React.useEffect(() => {
    // Allow one frame so initial URL write doesn't fight hydration.
    const id = window.setTimeout(() => {
      urlSyncReady.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  React.useEffect(() => {
    if (!urlSyncReady.current) return;
    const handle = window.setTimeout(() => {
      const params = propsToSearchParams(
        props,
        controls.fields,
        controls.colors,
        controls.defaults,
      );
      const qs = params.toString();
      const next = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
      const current = `${window.location.pathname}${window.location.search}`;
      if (next !== current) {
        window.history.replaceState(null, "", next);
      }
    }, 200);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on prop values only
  }, [props, slug]);

  const snippet = React.useMemo(
    () => buildJsxSnippet(slug, props),
    [slug, props],
  );

  function resetConfigurator() {
    setProps({ ...getMaterialPropDefaults(slug) });
    window.history.replaceState(null, "", window.location.pathname);
  }

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    recordInstallIntent({
      slug,
      source: "material-detail",
      path: "jsx",
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function copyCli() {
    await navigator.clipboard.writeText(cliSnippet);
    recordInstallIntent({
      slug,
      source: "material-detail",
      path: "cli",
    });
    setCopiedCli(true);
    window.setTimeout(() => setCopiedCli(false), 1600);
  }

  async function shareConfig() {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    window.setTimeout(() => setCopiedShare(false), 1600);
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
          eyebrow={`Material · ${entry.type} · Free`}
          title={entry.title}
        />

        <div className="relative grid overflow-visible lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div
            className={cn(
              "border-b border-border lg:sticky lg:top-16 lg:self-start lg:border-b-0",
              marketingPad,
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-border bg-foreground">
              <LivePreview
                entry={entry}
                forceStatic={forceStaticPreview}
                props={props}
              />
              <div className="absolute right-3 bottom-3 z-10 flex flex-wrap justify-end gap-2">
                <Button
                  aria-label={paused ? "Play preview" : "Pause preview"}
                  aria-pressed={paused}
                  size="sm"
                  type="button"
                  variant="outline"
                  className="border-border bg-background/90 text-foreground backdrop-blur-sm hover:bg-background"
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? "Play" : "Pause"}
                </Button>
                <Button
                  aria-label="Toggle reduced motion shell fallback"
                  aria-pressed={reducedMotion}
                  size="sm"
                  type="button"
                  variant="outline"
                  className="border-border bg-background/90 text-foreground backdrop-blur-sm hover:bg-background"
                  onClick={() => setReducedMotion((v) => !v)}
                >
                  {reducedMotion ? "Motion on" : "Reduced motion"}
                </Button>
              </div>
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
              {entry.perfNotes ? (
                <div className="col-span-2 space-y-1.5 sm:col-span-3">
                  <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                    Perf
                  </dt>
                  <dd className="font-mono text-[11px] leading-relaxed text-foreground">
                    {entry.renderingTechnique
                      ? `${entry.renderingTechnique} · ${entry.perfNotes}`
                      : entry.perfNotes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="divide-y divide-border lg:border-l lg:border-border">
            <Panel
              action={
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    aria-label="Reset configurator to defaults"
                    size="xs"
                    type="button"
                    variant="outline"
                    onClick={resetConfigurator}
                  >
                    Reset
                  </Button>
                  <Button
                    aria-label="Copy page URL with current config"
                    size="xs"
                    type="button"
                    variant="outline"
                    onClick={shareConfig}
                  >
                    {copiedShare ? "Copied link" : "Share config"}
                  </Button>
                </div>
              }
              title="Configurator"
            >
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Tune the live preview — values sync to the page URL as you
                edit. Reset restores catalog defaults; Share config copies a
                link to this exact setup.
              </p>
              <div className="space-y-6">
                {controls.fields.map((field) => {
                  const value = Number(props[field.key as keyof typeof props]);
                  const labelId = `config-${slug}-${field.key}`;
                  return (
                    <div key={field.key}>
                      <div className="flex items-baseline justify-between font-mono text-[11px]">
                        <span className="text-muted-foreground" id={labelId}>
                          {field.label}
                        </span>
                        <span className="text-foreground tabular-nums">
                          {value.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        aria-labelledby={labelId}
                        className="mt-3 py-1"
                        max={field.max}
                        min={field.min}
                        step={field.step}
                        value={[value]}
                        onValueChange={(next) => {
                          const v = Array.isArray(next) ? next[0] : next;
                          if (typeof v !== "number" || !Number.isFinite(v)) {
                            return;
                          }
                          setProps((prev) => ({ ...prev, [field.key]: v }));
                        }}
                      />
                    </div>
                  );
                })}
                {"colors" in controls &&
                  controls.colors?.map((c) => {
                    const hex = String(props[c.key as keyof typeof props]);
                    return (
                      <div
                        className="flex items-center justify-between gap-3 border-t border-border pt-5"
                        key={c.key}
                      >
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {c.label}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-foreground uppercase tabular-nums">
                            {hex}
                          </span>
                          <input
                            aria-label={c.label}
                            className="size-8 cursor-pointer border border-border bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-moz-color-swatch]:rounded-none [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-none [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                            type="color"
                            value={hex}
                            onChange={(e) =>
                              setProps((prev) => ({
                                ...prev,
                                [c.key]: e.target.value,
                              }))
                            }
                          />
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Panel>

            <Panel
              action={
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {entry.tier}
                </span>
              }
              title="Install"
            >
              <div className="space-y-4">
                <p
                  className="border border-border bg-muted/30 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground"
                  data-install-speed="under-60s"
                >
                  Install under 60s — CLI or copy-paste, no account required.
                </p>

                <div className="space-y-2">
                  <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                    CLI
                  </p>
                  <div className="flex items-start gap-2">
                    <pre className="min-w-0 flex-1 overflow-x-auto bg-foreground p-3 font-mono text-[11px] leading-relaxed text-background">
                      {cliSnippet}
                    </pre>
                    <Button
                      aria-label="Copy CLI install command"
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={copyCli}
                    >
                      {copiedCli ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                    Copy-paste path
                  </p>
                  <p className="font-mono text-[11px] text-foreground">
                    {pastePath}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Drop source beside your UI kit, or paste JSX from the panel
                    below after install.
                  </p>
                </div>

                <Button
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/docs/installation?material=${entry.slug}`}
                    />
                  }
                  size="lg"
                >
                  Installation docs
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={copySnippet}
                >
                  {copied ? "Copied JSX" : "Copy JSX"}
                </Button>
                <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                  Free — no account required. Source lands in your repo.{" "}
                  <Link
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    href={`/docs/installation?material=${entry.slug}`}
                  >
                    Full install guide
                  </Link>
                  .
                </p>
              </div>
            </Panel>

            {license ? (
              <Panel
                action={
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {license.priceLabel}
                  </span>
                }
                title="License"
              >
                <div className="space-y-4">
                  <div>
                    <p className="font-heading text-base font-medium tracking-tight">
                      {license.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {license.summary}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                        Permitted
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground">
                        {license.permitted.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                        Not permitted
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                        {license.notPermitted.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Compare Free and Screen on{" "}
                    <Link
                      className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      href="/pricing"
                    >
                      Pricing
                    </Link>
                    .
                  </p>
                </div>
              </Panel>
            ) : null}

            <Panel title="JSX">
              <pre className="overflow-x-auto bg-foreground p-5 font-mono text-[11px] leading-relaxed text-background">
                {snippet}
              </pre>
            </Panel>

            <Panel title="Props">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 pr-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Name
                      </th>
                      <th className="pb-3 pr-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Type
                      </th>
                      <th className="pb-3 pr-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Default
                      </th>
                      <th className="pb-3 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMaterialProps(slug).map((def) => (
                      <tr className="border-b border-border last:border-b-0" key={def.key}>
                        <td className="py-3 pr-4 align-top font-mono text-[11px] text-foreground">
                          {def.key}
                        </td>
                        <td className="py-3 pr-4 align-top font-mono text-[11px] text-muted-foreground">
                          {def.kind}
                        </td>
                        <td className="max-w-[10rem] truncate py-3 pr-4 align-top font-mono text-[11px] text-foreground">
                          {formatPropDefault(def.defaultValue)}
                        </td>
                        <td className="py-3 align-top text-[11px] leading-relaxed text-muted-foreground">
                          {def.description ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

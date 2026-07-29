"use client";

import type { ReactNode } from "react";

import { HeroDitheringDemo } from "@/components/hero-dithering-demo";
import {
  IconAgents,
  IconBolt,
  IconBranch,
  IconCheck,
  IconSparkle,
  Logo01,
  Logo02,
  LogoLockupHorizontal,
  LogoLockupStacked,
  LogoMark,
  PixelDiamond,
  RelayAvatar,
  RelayButton,
  RelayChip,
  RelayCommandBar,
  RelayIcon,
  RelayIconButton,
  RelayInput,
  RelayModelChip,
  RelayNavItem,
  RelayNode,
  RelayPromptInput,
  RelayPromptToolbar,
  RelaySendArrow,
  RelayStatusPill,
} from "@/components/relay-ui";
import {
  relayColors,
  relayComponentCatalog,
  relayElevation,
  relayIconCatalog,
  relayRadii,
  relaySpacing,
  relayTypography,
  relayVoice,
} from "@/lib/relay-tokens";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-relay-border py-12 last:border-b-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-relay-tertiary">
        {eyebrow}
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-relay-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({
  name,
  value,
  css,
}: {
  name: string;
  value: string;
  css: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-[76px] w-[120px] rounded-relay-md border border-relay-border"
        style={{ backgroundColor: value }}
      />
      <div>
        <p className="text-sm text-relay-ink">{name}</p>
        <p className="font-mono text-xs text-relay-tertiary">{value}</p>
        <p className="font-mono text-xs text-relay-tertiary">{css}</p>
      </div>
    </div>
  );
}

function ComponentCard({
  name,
  figma,
  variants,
  children,
}: {
  name: string;
  figma: string;
  variants: readonly string[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-relay-lg border border-relay-border bg-relay-white p-6 shadow-relay-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-relay-ink">{name}</h3>
          <p className="mt-1 text-xs text-relay-tertiary">
            Figma {figma} · {variants.join(", ")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export function DesignSystemPage() {
  const allColors = [
    ...Object.values(relayColors.brand),
    ...Object.values(relayColors.text),
    ...Object.values(relayColors.surface),
    ...Object.values(relayColors.fill),
    ...Object.values(relayColors.border),
  ];

  return (
    <div className="min-h-screen bg-relay-canvas pb-24 text-relay-ink">
      <header className="border-b border-relay-border bg-relay-white px-8 py-10">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <LogoMark className="size-10" />
          <h1 className="font-pixel-square text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            Relay
          </h1>
        </div>
      </header>

      <section className="border-b border-relay-border py-12">
        <div className="mx-auto max-w-7xl px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-relay-tertiary">
            Components
          </p>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-relay-ink">
            Hero dithering
          </h2>
          <HeroDitheringDemo />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-8 py-4">
        <Section eyebrow="Brand" title="Logos">
          <p className="mb-6 max-w-xl text-sm text-relay-secondary">
            Two nodes, one connection. Passing work from one step to the next.
            Figma Brand · Logos (35:8).
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center gap-4 rounded-relay-lg border border-relay-border bg-relay-panel p-8">
              <Logo01 className="w-40" />
              <div className="text-center">
                <p className="text-sm font-medium text-relay-ink">Logo/01</p>
                <p className="text-xs text-relay-tertiary">Primary · blue tile</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-relay-lg border border-relay-border bg-relay-white p-8">
              <Logo02 className="w-40" />
              <div className="text-center">
                <p className="text-sm font-medium text-relay-ink">Logo/02</p>
                <p className="text-xs text-relay-tertiary">Inverse · on light</p>
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow="Brand" title="Premise">
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <p className="text-sm font-medium text-relay-ink">Positioning</p>
            <p className="text-sm leading-relaxed text-relay-secondary">
              Relay is the AI agent builder for people who think in outcomes, not
              nodes. Describe it, see it, run it.
            </p>
            <p className="text-sm font-medium text-relay-ink">Tagline</p>
            <p className="text-[40px] font-semibold tracking-tight text-relay-ink">
              Describe it. See it. Run it.
            </p>
          </div>
        </Section>

        <Section eyebrow="Tokens" title="Color">
          <div className="flex flex-wrap gap-6">
            {allColors.map((color) => (
              <Swatch
                key={color.css}
                css={color.css}
                name={color.label}
                value={color.value}
              />
            ))}
          </div>
        </Section>

        <Section eyebrow="Tokens" title="Typography">
          <div className="flex flex-col gap-8">
            {Object.values(relayTypography).map((type) => (
              <div
                key={type.label}
                className="grid gap-4 border-b border-relay-border pb-8 last:border-b-0 md:grid-cols-[200px_1fr]"
              >
                <p className="text-xs text-relay-tertiary">{type.label}</p>
                <p
                  className="text-relay-ink"
                  style={{
                    fontSize: type.size,
                    fontWeight: type.weight,
                    letterSpacing: type.tracking,
                  }}
                >
                  {type.sample}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Tokens" title="Radius & spacing">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-medium">Radius</p>
              <div className="flex flex-wrap gap-4">
                {Object.values(relayRadii).map((radius) => (
                  <div key={radius.label} className="text-center">
                    <div
                      className="mb-2 size-16 border border-relay-border bg-relay-white"
                      style={{ borderRadius: radius.value }}
                    />
                    <p className="text-xs text-relay-secondary">{radius.label}</p>
                    <p className="font-mono text-xs text-relay-tertiary">
                      {radius.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-sm font-medium">Spacing</p>
              <div className="flex flex-col gap-3">
                {Object.values(relaySpacing).map((space) => (
                  <div key={space.label} className="flex items-center gap-3">
                    <div
                      className="h-3 rounded-relay-sm bg-relay-blue"
                      style={{ width: space.value }}
                    />
                    <span className="font-mono text-xs text-relay-tertiary">
                      {space.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow="Tokens" title="Elevation">
          <div className="flex flex-wrap gap-8">
            {Object.values(relayElevation).map((elevation) => (
              <div key={elevation.label}>
                <div
                  className="mb-3 flex h-24 w-40 items-center justify-center rounded-relay-lg border border-relay-border bg-relay-white"
                  style={{ boxShadow: elevation.value }}
                >
                  <span className="text-xs text-relay-tertiary">{elevation.label}</span>
                </div>
                <p className="max-w-[200px] font-mono text-xs text-relay-tertiary">
                  {elevation.value}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Assets" title="Pixel diamond">
          <p className="mb-6 max-w-xl text-sm text-relay-secondary">
            Code-generated pixel art with radial gradient. 13×13 grid, Fable 5
            tokens — no raster file required.
          </p>
          <div className="flex flex-wrap items-end gap-10 rounded-relay-lg border border-relay-border bg-relay-white p-8 shadow-relay-sm">
            <div className="flex flex-col items-center gap-3">
              <PixelDiamond className="size-16" />
              <span className="text-xs text-relay-tertiary">64px</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PixelDiamond className="size-32" />
              <span className="text-xs text-relay-tertiary">128px</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PixelDiamond className="size-48" />
              <span className="text-xs text-relay-tertiary">192px</span>
            </div>
          </div>
        </Section>

        <Section eyebrow="Assets" title="Icons">
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
            {relayIconCatalog.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-relay-md border border-relay-border bg-relay-white p-4"
              >
                <RelayIcon className="text-relay-secondary" name={name} />
                <span className="text-[10px] text-relay-tertiary">{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Voice" title="Brand voice">
          <div className="grid gap-6 md:grid-cols-2">
            {relayVoice.map((item) => (
              <div
                key={item.title}
                className="rounded-relay-lg border border-relay-border bg-relay-white p-5"
              >
                <p className="text-sm font-medium text-relay-ink">{item.title}</p>
                <p className="mt-1 text-sm text-relay-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Components" title="Library">
          <div className="grid gap-6">
            <ComponentCard
              figma="38:2"
              name="Button"
              variants={["Primary", "Secondary", "Ghost"]}
            >
              <RelayButton variant="primary">Primary</RelayButton>
              <RelayButton variant="secondary">Secondary</RelayButton>
              <RelayButton variant="ghost">Ghost</RelayButton>
            </ComponentCard>

            <ComponentCard figma="38:3" name="Input" variants={["Text"]}>
              <RelayInput />
            </ComponentCard>

            <ComponentCard figma="22:15" name="Chip" variants={["Default"]}>
              <RelayChip>Agents</RelayChip>
              <RelayModelChip />
            </ComponentCard>

            <ComponentCard figma="22:17" name="StatusPill" variants={["Running"]}>
              <RelayStatusPill />
            </ComponentCard>

            <ComponentCard figma="22:21" name="CommandBar" variants={["Default"]}>
              <RelayCommandBar />
            </ComponentCard>

            <ComponentCard
              figma="111:285"
              name="PromptInput"
              variants={["Empty state"]}
            >
              <RelayPromptInput className="max-w-[520px]">
                <span className="text-base text-relay-tertiary">Ask anything</span>
                <div className="min-h-6 flex-1" />
                <RelayPromptToolbar>
                  <RelayIconButton variant="muted">
                    <span className="text-relay-secondary">+</span>
                  </RelayIconButton>
                  <RelayModelChip />
                  <div className="flex-1" />
                  <RelayIconButton size="send">
                    <RelaySendArrow />
                  </RelayIconButton>
                </RelayPromptToolbar>
              </RelayPromptInput>
            </ComponentCard>

            <ComponentCard
              figma="38:4"
              name="Node"
              variants={["Trigger", "AI", "Condition", "Action"]}
            >
              <RelayNode icon={<IconBolt />} title="New lead" type="trigger" />
              <RelayNode icon={<IconSparkle />} title="Classify" type="ai" />
              <RelayNode icon={<IconBranch />} title="Qualified?" type="condition" />
              <RelayNode icon={<IconCheck />} title="Send email" type="action" />
            </ComponentCard>

            <ComponentCard
              figma="51:27"
              name="NavItem"
              variants={["Active", "Default"]}
            >
              <RelayNavItem active icon={<IconAgents className="text-relay-blue" />}>
                Agents
              </RelayNavItem>
              <RelayNavItem icon={<IconAgents />}>Templates</RelayNavItem>
            </ComponentCard>

            <ComponentCard figma="51:28" name="IconButton" variants={["Muted", "Send"]}>
              <RelayIconButton variant="muted">
                <span>+</span>
              </RelayIconButton>
              <RelayIconButton size="send">
                <RelaySendArrow />
              </RelayIconButton>
            </ComponentCard>

            <ComponentCard figma="51:32" name="Avatar" variants={["Initial"]}>
              <RelayAvatar />
            </ComponentCard>

            <ComponentCard figma="36:2" name="Logo/01" variants={["Primary"]}>
              <Logo01 className="w-24" />
            </ComponentCard>

            <ComponentCard figma="36:3" name="Logo/02" variants={["Inverse"]}>
              <Logo02 className="w-24" />
            </ComponentCard>

            <ComponentCard figma="47:15" name="Logo/Mark" variants={["Default"]}>
              <LogoMark className="size-12" />
            </ComponentCard>

            <ComponentCard
              figma="47:18"
              name="Logo/Lockup-horizontal"
              variants={["Default"]}
            >
              <LogoLockupHorizontal className="h-[34px]" />
            </ComponentCard>

            <ComponentCard
              figma="47:22"
              name="Logo/Lockup-stacked"
              variants={["Default"]}
            >
              <LogoLockupStacked className="h-[84px]" />
            </ComponentCard>
          </div>
        </Section>

        <Section eyebrow="Catalog" title="Figma component index">
          <div className="overflow-hidden rounded-relay-lg border border-relay-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-relay-panel text-relay-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Component</th>
                  <th className="px-4 py-3 font-medium">Variants</th>
                  <th className="px-4 py-3 font-medium">Node</th>
                </tr>
              </thead>
              <tbody>
                {relayComponentCatalog.map((item) => (
                  <tr key={item.name} className="border-t border-relay-border">
                    <td className="px-4 py-3 font-medium text-relay-ink">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-relay-secondary">
                      {item.variants.join(", ")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-relay-tertiary">
                      {item.figma}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}

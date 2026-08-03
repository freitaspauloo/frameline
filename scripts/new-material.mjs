#!/usr/bin/env node
/**
 * Scaffold a new Frameline material component + catalog stub.
 *
 * Usage:
 *   node scripts/new-material.mjs --slug foo-bar --title "Foo Bar" --type mesh --tier free --shader MeshGradient
 *
 * Writes:
 *   - src/materials/<slug>.tsx  (MaterialShell boilerplate)
 *   - Appends a TODO catalog stub to src/materials/_drafts/catalog-stubs.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TYPES = new Set(["mesh", "dither", "grain"]);
const TIERS = new Set(["free", "personal", "team"]);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = true;
      continue;
    }
    out[key] = next;
    i++;
  }
  return out;
}

function toPascalCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function usage() {
  console.error(`Usage:
  node scripts/new-material.mjs --slug foo-bar --title "Foo Bar" --type mesh --tier free --shader MeshGradient

Options:
  --slug     kebab-case material id (required)
  --title    Display title (default: title-cased slug)
  --type     mesh | dither | grain (default: mesh)
  --tier     free | personal | team (default: free)
  --shader   @paper-design/shaders-react export name (default: MeshGradient)
  --force    Overwrite existing component file
  --dry-run  Print files without writing`);
}

function componentTemplate({ componentName, shader, title }) {
  const shaderImport =
    shader === componentName
      ? `{ ${shader} as ${shader}Shader }`
      : `{ ${shader} }`;
  const shaderTag = shader === componentName ? `${shader}Shader` : shader;

  return `"use client";

import ${shaderImport} from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type ${componentName}Props = MaterialSurfaceProps & {
  colors?: string[];
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#F4F1EA", "#2D6BFF", "#0A0A0A"];

/**
 * ${title} — TODO: one-line surface description.
 */
export function ${componentName}({
  className,
  style,
  colors = DEFAULT_COLORS,
  speed = 0.5,
  scale = 1,
  forceStatic = false,
}: ${componentName}Props) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <${shaderTag}
        colors={colors}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
`;
}

function catalogStub({ slug, title, type, tier, componentName }) {
  return `
// TODO: paste into src/materials/catalog.ts and wire exports / detail preview
// Component: ${componentName}  →  src/materials/${slug}.tsx
{
  slug: "${slug}",
  title: "${title}",
  description: "TODO: one-sentence description for browse + detail.",
  type: "${type}",
  useContexts: ["section"],
  tier: "${tier}",
  tags: ["${type}", "motion"],
  fallbackColors: ["#F4F1EA", "#2D6BFF", "#0A0A0A"],
  renderingTechnique: "webgl",
  perfNotes: "TODO: GPU cost note — one hero ok / prefer forceStatic in lists.",
},
`;
}

function propsStub({ slug }) {
  return `
  // TODO: add to MATERIAL_PROPS in src/materials/props.ts
  "${slug}": [
    { key: "speed", label: "Speed", kind: "number", min: 0, max: 2, step: 0.01, defaultValue: 0.5, description: "Animation speed" },
    { key: "scale", label: "Scale", kind: "number", min: 0.2, max: 2, step: 0.01, defaultValue: 1, description: "Pattern scale" },
    { key: "colors", label: "Colors", kind: "colors", defaultValue: ["#F4F1EA", "#2D6BFF", "#0A0A0A"], description: "Color stops" },
  ],
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    usage();
    process.exit(0);
  }

  const slug = args.slug;
  if (!slug || typeof slug !== "string") {
    usage();
    process.exit(1);
  }
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(slug)) {
    console.error(`Invalid --slug "${slug}". Use kebab-case (e.g. foo-bar).`);
    process.exit(1);
  }

  const title =
    typeof args.title === "string"
      ? args.title
      : slug
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
  const type = typeof args.type === "string" ? args.type : "mesh";
  const tier = typeof args.tier === "string" ? args.tier : "free";
  const shader =
    typeof args.shader === "string" ? args.shader : "MeshGradient";
  const dryRun = Boolean(args["dry-run"]);
  const force = Boolean(args.force);

  if (!TYPES.has(type)) {
    console.error(`Invalid --type "${type}". Expected: ${[...TYPES].join(", ")}`);
    process.exit(1);
  }
  if (!TIERS.has(tier)) {
    console.error(`Invalid --tier "${tier}". Expected: ${[...TIERS].join(", ")}`);
    process.exit(1);
  }

  const componentName = toPascalCase(slug);
  const componentPath = path.join(ROOT, "src/materials", `${slug}.tsx`);
  const draftsDir = path.join(ROOT, "src/materials/_drafts");
  const stubsPath = path.join(draftsDir, "catalog-stubs.ts");

  const componentSrc = componentTemplate({ componentName, shader, title });
  const stub = catalogStub({ slug, title, type, tier, componentName });
  const props = propsStub({ slug });

  console.log(`\nScaffold: ${componentName} (${slug})\n`);
  console.log(`  component → ${path.relative(ROOT, componentPath)}`);
  console.log(`  stub      → ${path.relative(ROOT, stubsPath)}`);
  console.log("");

  if (dryRun) {
    console.log("--- component ---");
    console.log(componentSrc);
    console.log("--- catalog stub ---");
    console.log(stub);
    console.log("--- props stub ---");
    console.log(props);
    console.log("Dry run — nothing written.");
    return;
  }

  if (fs.existsSync(componentPath) && !force) {
    console.error(
      `Refusing to overwrite ${path.relative(ROOT, componentPath)} (pass --force).`,
    );
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(componentPath), { recursive: true });
  fs.writeFileSync(componentPath, componentSrc, "utf8");
  console.log(`Wrote ${path.relative(ROOT, componentPath)}`);

  fs.mkdirSync(draftsDir, { recursive: true });
  if (!fs.existsSync(stubsPath)) {
    fs.writeFileSync(
      stubsPath,
      `/**
 * Draft catalog / props stubs from \`scripts/new-material.mjs\`.
 * Paste entries into catalog.ts / props.ts, then delete the block.
 * This file is not imported by the app.
 */

export {};
`,
      "utf8",
    );
  }

  const marker = `\n/* === ${slug} === */\n`;
  const existing = fs.readFileSync(stubsPath, "utf8");
  if (existing.includes(`/* === ${slug} === */`)) {
    console.log(`Stub for ${slug} already in drafts — left unchanged.`);
  } else {
    fs.appendFileSync(
      stubsPath,
      `${marker}/* catalog */\n${stub}\n/* props */\n${props}\n`,
      "utf8",
    );
    console.log(`Appended stub to ${path.relative(ROOT, stubsPath)}`);
  }

  console.log(`
Next (see docs/AUTHORING.md):
  1. Tune shader props in src/materials/${slug}.tsx
  2. Export from src/materials/index.ts
  3. Paste catalog + props stubs; add LivePreview + COMPONENT_NAMES in material-detail-page.tsx
  4. Smoke-check /materials/${slug}
`);
}

main();

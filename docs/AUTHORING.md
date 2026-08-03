# Authoring a material

Ship a new Frameline material in a few focused hours, not days. Follow this checklist in order.

## 0. Scaffold (5 min)

```bash
node scripts/new-material.mjs \
  --slug foo-bar \
  --title "Foo Bar" \
  --type mesh \
  --tier free \
  --shader MeshGradient
```

This writes `src/materials/foo-bar.tsx` and appends catalog/props stubs to `src/materials/_drafts/catalog-stubs.ts`.

`--type` is `mesh` | `dither` | `grain`. `--tier` is `free` | `personal` | `team`. `--shader` is an export from `@paper-design/shaders-react` (see existing materials for names).

## 1. Component (~30–60 min)

- Open the generated file. Wire real shader props (not just speed/scale/colors).
- Keep `MaterialShell` for mount + reduced-motion fallback.
- Export a `*Props` type extending `MaterialSurfaceProps`.
- Match defaults to what you want on the detail page preview.

Reference: `src/materials/aurora-mesh.tsx`.

## 2. Catalog (~10 min)

- Paste the stub from `_drafts` into `src/materials/catalog.ts`.
- Fill `description`, `useContexts`, `tags`, `fallbackColors`, `perfNotes`.
- `renderingTechnique` is usually `"webgl"`.

## 3. Props registry (~15 min)

- Paste the props stub into `MATERIAL_PROPS` in `src/materials/props.ts`.
- Every tunable preview prop gets a `MaterialPropDef` (`number` | `color` | `colors`).
- Numbers with `min`/`max`/`step` become configurator sliders. `color` becomes a color picker. `colors` arrays are defaults-only unless you add UI later.
- Keep `description` short — it shows in the detail **Props** table.

## 4. Public exports (~5 min)

In `src/materials/index.ts`:

```ts
export { FooBar } from "./foo-bar";
export type { FooBarProps } from "./foo-bar";
```

## 5. Detail wiring (~20 min)

In `src/components/material-detail-page.tsx`:

1. Import the component.
2. Add `COMPONENT_NAMES["foo-bar"] = "FooBar"`.
3. Add a `LivePreview` case that passes props from the registry keys.

Configurator + Props table read `getMaterialProps(slug)` automatically once the registry entry exists.

## 6. Preview smoke (~15 min)

```bash
pnpm dev
```

Open `/materials/foo-bar`. Check:

- Live WebGL (and Pause → static fallback)
- Sliders / colors update the preview and URL query
- JSX snippet + Props table look right
- Reduced-motion / `forceStatic` still shows the CSS gradient

## 7. Perf note (~5 min)

Write an honest one-liner in catalog `perfNotes` (hero-only, avoid stacking, prefer `forceStatic` in lists, etc.). Prefer pausing off-screen when the surface is heavy.

## 8. Collection (optional, ~10 min)

If it belongs in a browse hub, add the slug to `src/materials/collections.ts`. Skip if unsure — catalog alone is enough to ship.

## Done when

- [ ] Component + `MaterialShell`
- [ ] Catalog entry
- [ ] `MATERIAL_PROPS` entry
- [ ] `index.ts` export
- [ ] Detail `LivePreview` + `COMPONENT_NAMES`
- [ ] Smoke-checked detail page
- [ ] Perf note filled
- [ ] Draft stub removed from `_drafts` (or left for later cleanup)

Delete the draft block in `_drafts/catalog-stubs.ts` once pasted. That file is not imported by the app.

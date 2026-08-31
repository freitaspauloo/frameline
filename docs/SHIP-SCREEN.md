# Ship a screen to the Frameline catalog

Checklist for publishing a new **screen** (Reticle landing page) to the storefront.

## 1. Build the screen module

- Source lives under `src/screens/<module>/` (component, CSS, skeleton if any, `index.ts`).
- Dev preview at `src/app/dev/<slug>/page.tsx` (+ optional `skeleton/page.tsx`).
- Hero renders inside `ScreenStage` when `embed` — use `h-full min-h-0` on the root, not `100dvh`, so detail previews and posters match the 1920×1080 plate.
- Static assets (video, PNG, SVG) go in `public/screens/<slug>/`.

## 2. Wire the storefront

| File | What to add |
|------|-------------|
| `src/screens/catalog.ts` | **Prepend** entries to `SCREENS_CATALOG` (newest first). Include skeleton as a separate slug if you ship one. Set `poster: "/screens/<slug>/poster.png"`. |
| `src/screens/preview.tsx` | Import component; add `case "<slug>":` in `ScreenLivePreview` (use `className="h-full w-full"` + `embed={embed}` for heroes). |
| `src/screens/copy-payload.ts` | Add file list + prompt for buyer copy/export (hero + skeleton slugs). |

Optional: add slug to `DEFAULT_SLUGS` in `scripts/capture-posters.mjs` for batch poster runs.

## 3. Capture the poster

Posters are **always 1920×1080 (16:9)** — catalog tiles use `aspect-[16/9]` + `object-cover`.

```bash
pnpm dev                    # another terminal, localhost:3000
pnpm posters <slug>         # e.g. pnpm posters forgeai
```

- Writes `public/screens/<slug>/poster.png`.
- Uses `/capture/<slug>` (no storefront chrome). Waits ~4s for GSAP/shaders to settle.
- Requires Chrome (or set `CHROME_PATH`).

**Tips for a good thumb:** let entrance animations finish; avoid open dropdowns; check `/capture/<slug>` in the browser before shooting.

Skeleton screens can share the hero poster (same `poster` path in catalog) or run `pnpm posters <skeleton-slug>` if you want a distinct thumb.

## 4. Verify

- `/screens/<slug>` — detail page + live preview
- `/screens` — tile appears at the **top** of the grid (catalog order)
- `/capture/<slug>` — full-bleed plate, no chrome

## 5. Commit

Include:

- `src/screens/catalog.ts`, `preview.tsx`, `copy-payload.ts`
- Screen source + `public/screens/<slug>/` (assets + `poster.png`)
- Dev route under `src/app/dev/<slug>/` if new

Do **not** commit `.next/` or local `.data/`.

---

**Accent variants:** add tokens in `src/screens/<module>/accents.ts`, wire CSS variables on the root, export thin wrappers (see `ForgeAiPinkHero` / `ForgeAiLimeHero`), and prepend separate catalog slugs. Reuse shared assets; capture one poster per slug.

---

**Example:** FORGE.AI hero → slug `forgeai`, assets in `public/screens/forgeai/`, dev at `/dev/forgeai`, **full-bleed preview at `/live/forgeai`**, catalog alias `fifty-x-hero`. Pink/lime variants → `forgeai-pink`, `forgeai-lime` (live at `/live/forgeai-pink`, `/live/forgeai-lime`).

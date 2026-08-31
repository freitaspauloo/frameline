# Ship a screen to the Frameline catalog

**Read first:** [SCREEN-LIFECYCLE.md](./SCREEN-LIFECYCLE.md) — dev vs review vs shipped surfaces. Skeletons never go in the catalog.

Checklist for publishing a **hero** to the storefront after review approval.

## 1. Build the screen module

- Source under `src/screens/<module>/` (hero component, CSS, optional skeleton for copy bundle, `index.ts`).
- **Dev WIP:** `src/app/dev/<slug>/page.tsx` with `fillViewport`.
- **Dev skeleton:** `src/app/dev/<slug>/skeleton/page.tsx` — not listed in catalog.
- Hero inside `ScreenStage` when `embed` — `h-full min-h-0` on root, not `100dvh`.
- Assets in `public/screens/<slug>/` at **original artboard dimensions**.

### Plate sizes

| Type | Size |
|------|------|
| Most heroes | 1920×1080 |
| FORGE.AI family | 1440×1080 |

## 2. Review (before catalog)

| URL | Purpose |
|-----|---------|
| `/dev/<slug>` | Design iteration |
| `/live/<slug>` | Full-bleed review (no storefront chrome) |
| `/capture/<slug>` | Poster plate — must match shipped crop |

Log the review in Notion **Screen Ship Queue** before shipping.

## 3. Wire the storefront (hero only)

| File | What to add |
|------|-------------|
| `src/screens/catalog.ts` | **Prepend** hero to `SCREENS_CATALOG`. No skeleton slugs. `poster: "/screens/<slug>/poster.png"`. |
| `src/screens/preview.tsx` | Hero `case` in `ScreenLivePreview` only. |
| `src/screens/copy-payload.ts` | File list + prompt (skeleton source files OK in bundle, not as catalog slug). |

Optional: hero slug in `DEFAULT_SLUGS` in `scripts/capture-posters.mjs`.

## 4. Capture the poster

Posters must match plate size exactly (see `posterDimensions()` in capture script).

```bash
pnpm dev                    # another terminal
pnpm posters <slug>
```

- Writes `public/screens/<slug>/poster.png`.
- Waits for GSAP/shaders (8s for video heroes like `health-ai`).
- Requires Chrome (`CHROME_PATH` on CI).

## 5. Verify

- `/screens/<slug>` — detail + live preview
- `/screens` — tile at **top** of grid
- `/capture/<slug>` — full-bleed, no chrome
- `/dev/<slug>/skeleton` — still works locally, **404** on `/screens/*-skeleton`

## 6. Commit

Include catalog, preview, copy-payload, hero source, assets + `poster.png`, dev routes. Update `scripts/smoke-catalog.mjs` screen count.

Do **not** commit skeleton catalog rows or skeleton posters to the storefront.

---

**Accent variants:** separate catalog slugs (`forgeai-pink`, `forgeai-lime`), shared assets under `public/screens/forgeai/`, one poster per shipped slug.

**Example:** Pulse → slug `health-ai`, dev `/dev/health-ai`, review `/live/health-ai`, alias `pulse`. Skeleton at `/dev/health-ai/skeleton` only.

# Screen lifecycle — dev, review, ship

Every **screen** (Reticle landing page) moves through three surfaces. Only the shipped hero appears on [frameline.ai/screens](https://frameline.ai/screens).

## Three surfaces

| Surface | Route | Audience | In catalog? |
|---------|-------|----------|-------------|
| **Dev (WIP)** | `/dev/<slug>` | You — tweak layout, motion, copy | No |
| **Skeleton** | `/dev/<slug>/skeleton` | You — loading-state bones only | **Never** |
| **Review** | `/live/<slug>` or `/capture/<slug>` | Reviewers before ship | No |
| **Shipped** | `/screens/<slug>` | Storefront + buyers | Yes |

Skeletons are **source code only** (shipped in copy/export bundles). They must not be catalog entries, posters, or `/screens` routes.

---

## Plate dimensions (required before review)

Shipped screens must match the **original artboard** — never stretch assets to fit.

| Family | Stage size | Poster size | Where set |
|--------|------------|-------------|-----------|
| Default Reticle heroes | **1920×1080** | 1920×1080 | `ScreenStage` defaults in `src/screens/stage.tsx` |
| FORGE.AI (Paper NE-0) | **1440×1080** | 1440×1080 | `FORGEAI_STAGE_*` in `src/screens/fifty-x-hero/forgeai-stage.ts` |

Rules:

- Hero renders inside `ScreenStage` when `embed` — root uses `h-full min-h-0`, not `100dvh`.
- Static assets (video, PNG, JPG) keep **native pixel dimensions** under `public/screens/<slug>/`.
- `pnpm posters <slug>` viewport must match the plate row above (`scripts/capture-posters.mjs`).

---

## Review checklist (Notion)

Before adding a row to `SCREENS_CATALOG`, every item must pass:

1. **Dev** — `/dev/<slug>` looks correct at full viewport (`fillViewport`).
2. **Plate** — measured stage matches artboard (1920×1080 or 1440×1080).
3. **Review** — `/live/<slug>` full-bleed, no chrome; `/capture/<slug>` matches poster crop.
4. **Poster** — `public/screens/<slug>/poster.png` at exact plate size; GSAP/shaders settled.
5. **Motion** — entrance completes; no open dropdowns; skeleton **not** submitted for review.
6. **Copy** — title, description, blurb, alias list finalized.
7. **Ship** — catalog + preview + copy-payload wired; smoke count updated.

Track each screen in Notion → **Frameline → Screen Ship Queue**.

---

## Ship to storefront

See [SHIP-SCREEN.md](./SHIP-SCREEN.md) for file-level steps.

**Do not ship:**

- `*-skeleton` slugs
- Dev-only variants (e.g. `/dev/running-app/bw`) unless promoted to a named hero with its own slug
- Posters captured from error pages or wrong viewport

**Do ship:**

- One catalog row per **hero** (plus accent variants like `forgeai-pink` when intentional)
- Alias slugs on the same row (`pulse` → `health-ai`, `fifty-x-hero` → `forgeai`)

---

## File map

| Concern | Path |
|---------|------|
| Public catalog | `src/screens/catalog.ts` → `SCREENS_CATALOG` only |
| Live preview (shipped) | `src/screens/preview.tsx` |
| Buyer copy/export | `src/screens/copy-payload.ts` (may list skeleton **files**, not catalog slugs) |
| Dev hero | `src/app/dev/<slug>/page.tsx` |
| Dev skeleton | `src/app/dev/<slug>/skeleton/page.tsx` |
| Review | `src/app/live/[slug]/page.tsx` |
| Poster capture | `src/app/capture/[slug]/page.tsx` + `pnpm posters` |

---

## Example: Pulse

| Stage | URL |
|-------|-----|
| Dev WIP | https://frameline.ai/dev/health-ai (local: `/dev/health-ai`) |
| Skeleton | `/dev/health-ai/skeleton` — dev only |
| Review | `/live/health-ai` |
| Shipped | `/screens/health-ai` (alias `/screens/pulse`) |

Plate: **1920×1080**. Poster: `public/screens/health-ai/poster.png`.

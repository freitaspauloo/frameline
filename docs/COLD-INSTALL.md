# Cold install checklist — free material in under 60s

**Audience:** Operator verifying that a stranger can install a free Frameline material into a fresh Next.js + Tailwind app without Frameline-specific setup beyond the registry URL.

**Target:** Wall-clock under 60 seconds from empty app root to a rendered surface in the browser.

**SKU under test:** `aurora-mesh` (free tier). Swap the slug if you are verifying another free material.

---

## Prerequisites (not on the clock)

- Node 20+ and a package manager (`pnpm` / `npm` / `yarn`)
- Network access to the Frameline registry host you are testing (local `http://localhost:3000` or production)
- A machine with a browser (WebGL optional for CSS-only materials; `aurora-mesh` needs WebGL)

---

## Timed steps

| # | Action | Pass criteria |
|---|---|---|
| 1 | Scaffold a fresh app: `pnpm create next-app@latest cold-install --ts --tailwind --eslint --app --src-dir --use-pnpm` (or equivalent). `cd cold-install && pnpm install` if needed. | App boots with `pnpm dev`. |
| 2 | Init shadcn if missing: `pnpm dlx shadcn@latest init -y` (accept defaults that match the app). | `components.json` exists. |
| 3 | Point `@frameline` at the registry under test. For local: set `registries["@frameline"].url` to `http://localhost:3000/api/registry/{name}` (or the published `/r/{name}.json` URL in production). **No auth header for free SKUs.** | Registry entry present; no `FRAMELINE_REGISTRY_TOKEN` required. |
| 4 | Install: `pnpm dlx shadcn@latest add @frameline/aurora-mesh` **or** `pnpm dlx shadcn@latest add "http://localhost:3000/api/registry/aurora-mesh"`. | Component file lands under the configured UI path (e.g. `src/components/ui/aurora-mesh.tsx`). |
| 5 | Drop the component into `src/app/page.tsx` (full-bleed decorative layer + sibling content). | Typecheck / save succeeds. |
| 6 | Load `http://localhost:3000` in the browser. | Surface renders; no install 403; no missing-module error. |

**Stop the clock after step 6.** Record elapsed time and registry host used.

---

## Failure triage (still count as fail for Gate / ops)

- **403** — You pointed at a paid slug, or auth headers are wrongly required for free. Use `/free` / catalog `tier: "free"` only.
- **404** — Wrong registry URL or slug typo.
- **Peer deps** — Install any packages the registry file lists; re-run step 4 if the CLI prompted and you skipped.
- **Blank canvas** — WebGL blocked or reduced-motion static path unexpected; check material docs / troubleshooting.

---

## Sign-off

| Field | Value |
|---|---|
| Date | |
| Operator | |
| Registry host | |
| Elapsed (s) | |
| Pass / fail | |
| Notes | |

Related: in-app [Installation](/docs/installation) · `docs/DISCOVERY.md` Gate 01 · free funnel `/free`.

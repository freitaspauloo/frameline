# Frameline

Storefront for animated shader "materials". Next.js 16 (App Router, Turbopack).

## Run locally

Requirements: Node.js 20.9+ (Next 16's minimum; CI and the cloud environment run
22.x) and pnpm 9+ for the v9 lockfile (`corepack enable pnpm`).

```bash
git clone https://github.com/freitaspauloo/frameline.git
cd frameline
pnpm install
pnpm dev
```

Then open `localhost:3000` in your browser.

No `.env` is required to boot. Every external service degrades gracefully when
its keys are absent: checkout fulfills straight into `.data/` files without
`STRIPE_SECRET_KEY`, receipts are skipped without `RESEND_API_KEY`, and the
Firebase admin sync no-ops. Copy `.env.example` to `.env` and fill in only the
integrations you actually need.

`pnpm install` warns that build scripts for `@firebase/util` and `protobufjs`
were ignored. That is expected and harmless — neither package needs its build
step here, and `dev`, `build`, and `lint` all work without them. Do not run the
interactive `pnpm approve-builds`; `pnpm-workspace.yaml` is the place to record
a decision, and it already denies `sharp` and `unrs-resolver` while allowing the
Prisma packages.

Use pnpm rather than npm. `pnpm-workspace.yaml` carries pnpm-only settings
(`minimumReleaseAgeExclude`, the build-script allowlist) that npm ignores
silently.

Material detail pages such as `/materials/aurora-mesh` render live WebGL shaders
via `@paper-design/shaders-react`, so they need a browser with WebGL enabled.
The dev and build servers themselves do not.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm verify` | `tsc --noEmit`, then smoke tests, then build |
| `pnpm material:new` | Scaffold a new material |
| `pnpm demo:seed` | Seed demo data |
| `pnpm db:push` | Push the Prisma schema |
| `pnpm db:studio` | Prisma Studio |

`pnpm lint` currently reports pre-existing errors (mostly
`react-hooks/set-state-in-effect`). A non-zero exit does not mean your setup is
broken.

## Deployment

Production is https://frameline.ai.

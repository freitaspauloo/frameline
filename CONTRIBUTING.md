# Contributing

Solo-founder pace: small PRs, green smoke, no ceremony.

## Setup

```bash
pnpm install
pnpm firebase:sync-secrets   # if FIREBASE_* admin secrets are in env
pnpm dev          # http://localhost:3000
```

Use **pnpm** (not npm) so `pnpm-workspace.yaml` settings stick. Expected warning about ignored `sharp` / `unrs-resolver` build scripts is fine.

Firebase: see [`docs/FIREBASE.md`](./docs/FIREBASE.md). Client config ships in git; admin secrets must live in Cursor/Vercel env.

## Verify before you push

```bash
pnpm exec tsc --noEmit
pnpm smoke
# or the local CI parity script:
pnpm verify
```

`pnpm verify` runs typecheck → smoke → build. Smoke covers catalog + renderer wiring; it does not need a browser.

## Common scripts

| Script | What it does |
|---|---|
| `pnpm material:new` | Scaffold a material (see `docs/AUTHORING.md`) |
| `pnpm demo:seed` | Seed demo orders / `.data` fixtures |
| `pnpm lint` | ESLint (known pre-existing hooks warnings exist) |

## Branch & PR norms

- Branch off `main` with a short topic name (`cursor/…` cloud agents are fine).
- One concern per PR when you can — catalog work separate from billing scaffolding.
- Describe *what to click* in the PR body if UX changed.
- Do not commit secrets, `.data/*.json` with real emails, or `node_modules`.

## Where the docs live

| Doc | When you need it |
|---|---|
| [`docs/AUTHORING.md`](./docs/AUTHORING.md) | Shipping a new material end-to-end |
| [`docs/COLD-INSTALL.md`](./docs/COLD-INSTALL.md) | Operator timed checklist (also `/docs/cold-install`) |
| [`docs/BUILD-PLAN.md`](./docs/BUILD-PLAN.md) | What’s done vs blocked for Phase C |

In-app guides: `/docs`. Product index: [`docs/README.md`](./docs/README.md).

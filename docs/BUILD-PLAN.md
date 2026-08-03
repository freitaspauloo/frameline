# Frameline — Build Plan

Active engineering plan aligned with [`SOW.md`](./SOW.md) / [`PRD.md`](./PRD.md).
Steps, not dates. Supersedes the archived V1 “Relay” sketch.

## Status snapshot

| Area | State |
|---|---|
| WP2 Material architecture | In progress — `MaterialShell`, reduced-motion fallbacks, typed catalog |
| WP3 Authoring | Seed path works; publish pipeline still manual |
| WP4 Catalog UX | Live — type / context / tier filters, search, sort |
| WP5 Configurator | Live — controls, JSX copy, URL deep-link, play/pause |
| WP6 Distribution | Messaging only — registry not gated yet |
| WP7 Catalog production | **40 / 40** target met (count); quality bar still ongoing |
| WP8 Commerce | Demo checkout + Stripe-ready API stub; no live charges |
| WP9 Entitlements | Domain types + demo account gating; Postgres schema drafted |
| WP10 Docs | Hub + install / theming / a11y / perf / examples / troubleshooting / licensing |
| WP11 Admin | Shell + catalog/orders views; demo auth gate |
| WP12 Launch ops | Sitemap / robots / metadata; waitlist capture; legal pages |

## Phase A — Browse & craft (mostly done)

| # | Step | Outcome |
|---|---|---|
| 1 | Scaffold Next.js + TS + Tailwind | App runs |
| 2 | Design system / marketing shell | Consistent storefront chrome |
| 3 | Homepage + featured | First impression |
| 4 | Catalog grid + filters + search | Discover materials |
| 5 | Material detail + configurator | Evaluate before buy |
| 6 | Collections | Curated groupings |
| 7 | Docs suite | Install path documented |
| 8 | Legal (about / license / privacy / terms) | Trust surfaces |

## Phase B — Catalog depth (active)

| # | Step | Outcome |
|---|---|---|
| 9 | Grow to ≥15 materials across 6 contexts | Credible catalog |
| 10 | Perf notes + props tables as data | Docs/configurator stay in sync |
| 11 | OG stills / static exports pipeline | Shareable previews |
| 12 | Reach 40 at production bar (count met; quality ongoing) | SOW Definition of Done |

## Phase C — Selling (scaffold → live)

| # | Step | Outcome |
|---|---|---|
| 13 | Postgres + Prisma client from `prisma/schema.prisma` | Durable entitlements |
| 14 | Stripe Checkout (guest) + tax | Take payments |
| 15 | Webhook fulfillment + Resend receipt | Auto-deliver |
| 16 | Entitlement-gated registry | Paid sources return 403 when unentitled |
| 17 | Free downloads ungated | Funnel + trust |

## Phase D — Auth & admin

| # | Step | Outcome |
|---|---|---|
| 18 | Real auth provider (Clerk or Firebase) | Sessions replace demo cookie |
| 19 | Admin harden + publish/edit flow | Solo publish in hours |
| 20 | Orders / refund / revoke | Operate the shop |

## Phase E — Launch polish

| # | Step | Outcome |
|---|---|---|
| 21 | Funnel analytics + Sentry | See failures |
| 22 | Core Web Vitals pass | Performance claim holds |
| 23 | Domain `frameline.ai` + go live | Paid public launch |

**Order of value:** see the site → deepen catalog → sell → operate → launch clean.

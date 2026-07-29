# Frameline — Scope of Work (Phase 1 / MVP Launch)

Canonical copy also lives in [`PRD.md`](./PRD.md) §6.

## 1. Purpose

Deliver a commercially licensed, production-installable materials system at frameline.ai: browse catalog → configure live → install in under one minute → paid license. **Contract boundary is paid public launch.** Detailed functional requirements: PRD §7.

## 2. In-scope work packages

| # | Package | Deliverables | Priority |
|---|---|---|---|
| **WP1** | Discovery & validation | Signal-based demand evidence (no interviews), fake-door WTP tests, ≥3 documented competitive gaps, waitlist landing + capture, throughput timing log | Must |
| **WP2** | Material architecture | Typed material contract (props, tokens, variants, fallback), shared rendering primitives, SSR-safe wrapper, `prefers-reduced-motion` + static fallback layer, perf budget harness | Must |
| **WP3** | Authoring pipeline | Material scaffold, local preview harness, publish path, per-material metadata (contexts, tier, deps); target: 3 materials ≤6h end-to-end post-primitives | Must |
| **WP4** | Catalog & detail UX | Live catalog grid, filters (use context, motion/static, light/dark, free/paid), search/sort, collections, material detail with live preview | Must |
| **WP5** | Configurator | Live prop controls, real-time preview, copy-ready JSX + CLI snippet, deep-linkable config state | Must |
| **WP6** | Distribution | shadcn-compatible registry, CLI install + copy-paste path, entitlement-gated paid sources, token-binding docs/examples | Must |
| **WP7** | Catalog production | **30–40 materials** across **≥6 use contexts** at full production bar | Must |
| **WP8** | Commerce & licensing | Guest Stripe Checkout; Free · Static ~$19 · Personal ~$99 · Team ~$299; plain-language rights; receipt + access email; license version pinned per order | Must |
| **WP9** | Entitlement gating | Auth (guest-first), purchase→entitlement in Postgres, webhook-idempotent fulfillment, gated registry reads, free/OSS ungated | Must |
| **WP10** | Docs | Install (CLI + manual), theming/tokens, a11y & reduced-motion, perf notes, examples, licensing FAQ, troubleshooting | Must |
| **WP11** | Admin publish | Hardened admin auth; publish/edit/unpublish; collections; orders/licenses; refund+revoke; basic dashboard | Must |
| **WP12** | Launch ops | Funnel analytics (view→configure→checkout/install), error monitoring, SEO/OG per material, legal pages, pricing page | Should |

## 3. Out of scope (this SOW)

Multi-vendor / UGC · layout or UI kits · subscriptions / all-access at MVP · AI generation tooling · native apps · enterprise procurement / SSO / negotiated contracts · Figma parity · team private registry · marketplace mechanics · localization · affiliate program · public third-party API.

## 4. Definition of Done — paid launch

1. **30–40** published materials, **≥6** use contexts; each has live preview, configurator, docs snippet, tier, perf note, reduced-motion + static fallback.
2. Cold install (CLI **and** copy-paste) into a fresh Next.js + Tailwind app succeeds in **under 60 seconds** with no manual patching.
3. Every material: SSR-safe, no hydration errors, respects theme tokens.
4. Guest checkout completes on Free / Static / Personal / Team; entitlement grants gated registry access within one minute of payment; license email delivered.
5. Unentitled requests to paid registry paths return **403**; free/OSS materials publicly readable.
6. Catalog and key templates meet Core Web Vitals targets; every animated material ships a real reduced-motion fallback.
7. Docs cover install, theming, SSR, reduced-motion, and licensing with no blocking TODOs.
8. Operator can publish a new material end-to-end in **hours**, not days.

## 5. Assumptions

Solo operator · signals-only Discovery · React + Tailwind + tokens baseline · shadcn-style registry · Stripe guest checkout · Vercel + Postgres · one-time licenses at MVP.

## 6. Dependencies

Next.js/TS · Tailwind · shared primitives · registry · Postgres · Stripe (+ tax) · Auth · Resend · Vercel · Plausible · Sentry · `frameline.ai` · [competitive sheet](https://app.notion.com/p/43ed8a1cca7f40638801bfb73a548c97).

**Blockers:** Stripe verification · domain/DNS · OSS seed license clearance · trademark knockout before registry namespace.

## 7. Timeline (studio gates)

| Phase | Exit |
|---|---|
| **Discovery** | Gate 01: ≥100 waitlist / 14d · WTP via fake doors · install-intent · throughput 3 materials ≤6h · ≥3 competitive gaps |
| **Architecture** | Material contract, registry, entitlement model frozen; WP2 spike proves SSR + fallback + perf |
| **Design** | Catalog, detail+configurator, pricing, docs shells approved |
| **Validation** | Cold-install on clean app; paid path in Stripe test mode E2E |
| **Build & Launch** | Definition of Done met; paid public launch |

Gate failure at Discovery pauses Build. Catalog may reduce toward **30** before the production bar is relaxed.

## 8. Change control

Scope additions require a written note (problem → deliverable → gate impact). Fixed launch date → demote a Must to add a Must. Out-of-scope items need a **new SOW**. Material count within 30–40 is fine; dropping below **30** materials or **6** use contexts is a change request.

## 9. Later phases (not this SOW)

| Phase | Adds |
|---|---|
| **2 — Depth** | Borders, glass, elevation, cursors, transitions · bundles/promos · Extended/agency tier |
| **3 — Moat** | Figma parity · team private registry · recurring revenue only if cadence justifies |
| **Parked** | AI tools · layout/UI kits · multi-vendor · configurator SaaS |

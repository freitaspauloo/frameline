# Frameline — Product Requirements Document

**A commercial surface & materials system for design engineers — production-ready animated materials, gradients, textures, and motion surfaces delivered as typed React/Tailwind components.**

| | |
|---|---|
| **Status** | Discovery — Phase 01. Canonical active PRD. Architecture locks only after Gate 01 passes. |
| **Name** | **Frameline** — domain **frameline.ai** (purchase ASAP). Repo: `freitaspauloo/frameline`. |
| **Owner** | DUDESIGN — solo founder-operator (product, design, engineering, GTM). |
| **Process** | Discovery → Architecture → Design → Validation → Build & Launch. |
| **Related docs** | [`SOW.md`](./SOW.md) — Phase 1 Scope of Work (also §6).<br>[`DISCOVERY.md`](./DISCOVERY.md) — Phase 01 research plan and Gate 01 evidence log.<br>[`COMPETITIVE.md`](./COMPETITIVE.md) — competitive sheet.<br>[`PRD-v1.md`](./PRD-v1.md) — archived reference only.<br>**Sell priority:** #1 surface+static is this PRD. #2 agency/vertical = packaging of the same catalog. #3 done-with-you = services upsell — not separate products. |

---

## 1. Overview / Summary

This product is a **commercial surface & materials system**: a curated catalog of production-ready animated materials, gradients, textures, and motion surfaces that install directly into a modern React application as typed components.

It serves two tightly coupled purposes, and only these two:

1. **Product** — a library of surfaces engineered to a production bar that generic effect packs do not meet: typed props, SSR-safe rendering, binding to the buyer's design tokens, `prefers-reduced-motion` handling with real static fallbacks, and a documented performance budget per material. The craft in each material is what buyers are paying for; the engineering rigor is what makes it safe to ship.
2. **Commerce** — a self-serve licensing and delivery experience where a design engineer can discover a material, tune it live, install it with one command, and understand exactly what commercial rights they hold, without talking to anyone.

The two are inseparable: the quality of the surfaces determines pricing power, and the clarity of the licensing determines conversion. Neither is a showcase for its own sake — every unit of polish is spent where it moves purchase intent or reduces support load.

**Category.** Design-engineering asset library — the same budget line as Tailwind Plus and premium component libraries — specialized in **surface** rather than layout. We do not sell navbars, pricing tables, or form patterns. We sell the visual material an interface is made of.

**Explicitly not.** A stock image site. A multi-vendor marketplace. A SaaS workspace you log into and operate inside. An AI generation tool.

**MVP in one sentence.** A design engineer discovers a material, tunes it in a live configurator, installs it into their application in under a minute, and knows without ambiguity that the license covers their commercial use.

**Operator bar.** Publishing a new material end-to-end — component package, docs, previews, metadata, pricing, static export — is solo-operable in hours, not days. If a material takes a day to publish, the catalog cannot grow fast enough to sustain the business.

---

## 2. Problem Statement & Motivation

### 2.1 For buyers

Teams that care how their product looks must ship that look in code. Today, every available path forces a compromise.

| Option | What it gives | Why it fails |
|---|---|---|
| shadcn/ui + Tailwind | Structure, accessibility, unopinionated primitives | Visually anonymous. Structure without surface — every app built this way looks like every other app built this way. |
| Viral effect libraries (Aceternity, Magic UI, ReactBits) | High visual impact, free or cheap | The same look on thousands of sites. Uneven SSR behavior, hardcoded colors, no token binding, inconsistent accessibility, unmeasured performance. |
| Stock or AI imagery | Infinite static images | Unthemeable. No component contract, no dark-mode binding, no motion. Frequently already live on a competitor's site. |
| Figma Community files | Beautiful source material | Nothing ships. The gap between the Figma file and production code is the entire problem. |
| Build in-house | Exact control | Two to five engineer-days for a properly built material system — shader tuning, fallbacks, perf work, token plumbing. Most teams will not authorize that for "the background." |

The result is a predictable failure mode. A designer specs an animated surface. The engineer estimates it honestly, gets told it is not worth three days, and ships a flat gradient. Or the engineer pulls in a free effect library, ships it, and the product now looks like the last four products the buyer saw. Or someone drops in a static AI image and dark mode breaks.

**Jobs to be done.**

- **J1 — Make the landing page look funded by Thursday.**
- **J2 — Implement the surface the designer specced without watering it down.**
- **J3 — Give the product a visual signature that is not the default template look.**
- **J4 — Ship visual polish without failing performance or accessibility review.**
- **J5 — Buy something legally safe for client work.**
- **J6 — Keep surface treatment consistent as the surface area of the product grows.**

**Problem statement.**

> There is no trusted source of high-craft, distinctive **surface** — the materials, backgrounds, and motion that make an interface feel deliberately designed — that arrives as production code, binds to the team's design tokens, and survives performance and accessibility review.
>
> The gap is not a shortage of images. **Taste does not currently ship as code.**

### 2.2 For the operator

This is a business decision, not a portfolio decision. The economics of a surface & materials library are unusually favorable to a single high-taste operator:

- **The unit of value is small and self-contained.** One material is a shippable, sellable, marketable unit. There is no long build before the first revenue.
- **Craft is the moat and craft is defensible solo.** Distribution scale is not required to be the best in a narrow category. A single person with strong visual judgment can produce surfaces that a committee-driven library will not.
- **Marginal cost per sale is near zero,** fulfillment is fully automatable via webhook, and support load is bounded if licensing is written in plain language.
- **The catalog compounds.** Each material is a permanent SEO surface, a social demo clip, and a reason to return. Value accrues rather than decaying.
- **Adjacent expansion is additive, not a rewrite.** Borders, glass, elevation, cursors, and page transitions all reuse the same delivery, licensing, and registry infrastructure.

The risk the operator is underwriting is demand, not capability. That is precisely what Discovery Phase 01 and Gate 01 exist to resolve before a line of commerce code is written.

### 2.3 Why now

- **The registry/CLI install pattern is mainstream.** shadcn normalized "components you own, installed by command." Buyers already understand and trust the delivery model, which removes the single largest onboarding objection.
- **Design engineering is a recognized role with a budget.** The person who owns how the product looks in production now exists at seed-through-Series-B companies and holds discretionary spend.
- **The taste floor rose and the ceiling did not.** Every product has clean typography and accessible components now. Visual differentiation has moved from layout to surface — and surface is exactly what nobody sells well.
- **Free effect libraries created a distinctiveness problem they cannot solve.** Their scale is their weakness: broad adoption guarantees sameness, and their quality bar cannot be raised retroactively.
- **Browser capability caught up.** Modern CSS, WebGL/WebGPU, and mature React SSR patterns make genuinely high-end surfaces shippable — for someone willing to do the fallback and performance work most authors skip.
- **AI raised the floor and made the ceiling more valuable.** AI copilots can produce a passable gradient. They cannot produce a distinctive, coherent, performance-audited material system with a considered point of view.

---

## 3. Goals and Non-Goals

### 3.1 Goals

- **G1 — Ship surface as code.** Every material installs as a typed React component with a documented, stable prop API. The deliverable is source the buyer owns, not a black-box dependency. Success: a buyer can read the props table and predict exactly what the component does.
- **G2 — Distinctive, quiet craft.** Materials should look expensive and rare rather than loud and templated. The catalog has a point of view and enforces it. Success: a buyer can identify a material as ours without a watermark, and does not feel they have joined a trend.
- **G3 — Token-bound by default.** Components consume the buyer's CSS variables and theme rather than shipping hardcoded colors. Dark mode works without a fork. Success: dropping a material into an existing themed app requires zero color edits.
- **G4 — Production-safe.** SSR and hydration safe, `prefers-reduced-motion` respected with a real static fallback (not a disabled animation), documented performance characteristics, and a CSS-only tier for constrained contexts. Success: a material passes a competent engineer's code review on first read.
- **G5 — Frictionless acquire and install.** Guest-friendly purchase, instant entitlement, and install via registry CLI or copy-paste in under a minute. Success: measured time from checkout completion to first successful install is under 60 seconds.
- **G6 — Solo-operable.** One person publishes, licenses, fulfills, and supports without a team. Fulfillment is fully automated; every manual step is a defect. Success: weekly operations fit in a few hours.
- **G7 — Extensible.** The catalog model, IA, URL structure, and delivery pipeline accommodate adjacent surface types — borders, dividers, glass, elevation, cursors, transitions — and a future Figma parity kit without re-architecture. Success: adding a new surface type is content work, not migration work.
- **G8 — Discoverable and self-selling.** Docs, live demos, and SEO-durable material pages convert from organic search and social without paid acquisition. Success: material and docs pages produce compounding organic traffic that converts.

### 3.2 Non-Goals (explicitly out of scope for MVP)

- **Multi-vendor marketplace.** Single-author catalog. Third-party creator onboarding dilutes the curation that justifies the price.
- **User-generated content.** No public uploads, comments, or reviews at launch.
- **Layout and UI kits.** No navs, forms, pricing sections, or dashboard blocks in v1. Competing with Tailwind Plus and shadcnblocks on layout would destroy the "surface" positioning that makes the product legible.
- **Full SaaS workspace.** This is not a product you log into and work inside. Accounts exist to prove entitlement and re-access purchases.
- **Subscriptions and all-access passes at MVP.** One-time licensing only until catalog depth and update cadence justify recurring revenue.
- **Native mobile apps.** Web-first and responsive.
- **Enterprise contract workflows.** No negotiated agreements, seat management consoles, procurement flows, or manual invoicing at MVP.
- **AI generation or AI design tooling.** Parked (§18), not part of the launch product.

---

## 4. Target Users & Personas

Three buyer personas, ordered by strategic priority, plus the operator. Amplifiers and the design community are a **distribution channel**, not a persona — they are served through free demos and OSS seeds, and they are addressed in GTM, not in ICP.

### P1 — The Design Engineer *(primary)*

**Context.** Works at a seed to Series B company, 10–150 people. Titles vary: design engineer, product engineer, front-end lead, "the person who makes it look right." Owns how the product looks in production and is measured on shipped visual quality. Works in Next.js or Vite with TypeScript and Tailwind, usually with shadcn/ui already installed. Has a company card and roughly $300–500 in discretionary tooling spend that does not require approval.

**Values.** Type safety. Small bundles. Code they can read, own, and modify. Zero hydration warnings. Components that respect the design system rather than fighting it. Documentation written by someone who has actually shipped the thing.

**Frustrations.** Free effect libraries that hardcode colors and break in dark mode. Components that require a wrapper provider and three peer dependencies. Libraries that animate on the main thread and tank Lighthouse. Being asked to reproduce a Figma effect that does not translate. Losing three days to a gradient nobody will thank them for.

**JTBD.** *Ship deliberately designed surface this week without spending three days building it from scratch.*

**Buy triggers.** A launch or rebrand with a fixed date. A designer handoff containing an effect that will not implement cleanly. A competitor shipping something visibly better. A performance or accessibility review that flagged the effect library they were already using.

**Kill criteria.** Hardcoded colors. Heavy runtime wrappers. Hydration warnings on first render. No dark mode. No visible source. Unclear or restrictive commercial rights. Anything that reads as low-effort.

**Where found.** X/Twitter front-end and design-engineering circles, GitHub, shadcn and Tailwind ecosystem discussions, Hacker News launch threads, targeted organic search ("animated gradient background react", "shader background nextjs", "css noise texture component").

---

### P2 — The Technical Founder / Indie Builder

**Context.** Solo or a two-person team, pre-seed or bootstrapped. Can ship a full product but has no designer and knows it shows. Paying out of their own pocket. Building a landing page, a launch site, or a first paid product.

**Values.** Looking credible immediately. Buying an outcome rather than a toolkit. Install in five minutes with no theory. A price low enough to decide alone in one sitting — roughly a $150 mental ceiling. Certainty that commercial use is permitted.

**Frustrations.** Their product looks like a template because it is one. Design advice they cannot execute. Subscriptions for a one-time need. Assets that look great in a marketing GIF and mediocre in their actual app. Vague licensing that makes them nervous about charging customers.

**JTBD.** *Make my product look like a real company made it, without hiring anyone.*

**Buy triggers.** Pre-launch panic. A Product Hunt or Show HN date. First paying customers arriving at a site that undersells the product. Seeing a competitor's site and recognizing the gap.

**Kill criteria.** Subscription-only pricing. Requiring design skill to get a good result. Ambiguous commercial rights. An install path with more than a couple of steps.

**Where found.** Indie Hackers, X build-in-public communities, Product Hunt, launch-adjacent newsletters, Reddit (r/SaaS, r/webdev), organic search for outcome phrasing ("make my landing page look professional").

---

### P3 — The Design Lead / Studio Principal *(highest AOV)*

**Context.** Leads a 3–20 person product design team, or runs a small studio or agency doing client work. Makes tooling decisions for multiple people and multiple projects. Cares about consistency across surfaces and about visual decisions surviving the trip to production.

**Values.** Client-work rights stated unambiguously. Multi-seat or team clarity without a procurement dance. Design-system fit and token compatibility. An update cadence that suggests the library will still exist next year. Figma parity, eventually — the ability to design with the same materials they ship with is a durable reason to standardize.

**Frustrations.** Handoff loss — the surface always degrades between Figma and production. Every project reinventing the same visual treatments. Licensing that is unclear about whether deliverables can be handed to a client. Tools that require per-seat administration for a five-person team. No invoice or receipt suitable for expensing.

**JTBD.** *Standardize a surface toolkit so visual decisions survive implementation across every project we run.*

**Buy triggers.** Onboarding a new client. Standardizing the studio's stack. A rebrand or design-system refresh. A junior engineer shipping a visibly weaker version of a specced surface.

**Kill criteria.** Seat friction or per-user administration. Unclear client-deliverable rights. No invoice. Any suggestion the library is a weekend project that will be abandoned.

**Where found.** Design leadership communities and Slack/Discord groups, design-systems circles, referrals from P1 engineers on their team, conference and newsletter adjacency, agency peer networks.

---

### P4 — The Operator *(DUDESIGN — owner, not a buyer)*

**Context.** Solo founder-operator with strong visual judgment and sufficient technical depth to build and ship the product. No engineering staff, no support staff, no marketing staff. Time is the binding constraint on everything.

**Needs.** A publish flow measured in hours, not days. Fully automated fulfillment with alerting on failure. Enough sales visibility to decide what to build next. Confidence that paid packages cannot leak. Licensing clear enough that support volume stays near zero.

**Success looks like.** A catalog that grows on a sustainable cadence, licensing revenue that trends up month over month, ops that fit in a few hours a week, and a category position specific enough that the product is the obvious answer to a narrow question.

---

## 5. User Stories / Jobs To Be Done

### 5.1 Buyer stories

- **B1.** As a visitor, I can browse a visual catalog of **live, running materials** — not static thumbnails alone — so that I can judge motion, texture, and quality before committing attention to a detail page.
- **B2.** As a visitor, I can filter and search by use context (hero, section, card, empty state, loading, auth, footer), visual style, motion versus static, light/dark suitability, and free versus paid, so that I can narrow to materials that fit the slot I actually need to fill.
- **B3.** As a design engineer, I can open a material page with a large live preview, a complete props table, dependency and bundle notes, measured performance characteristics, and a plain-language license summary, so that I can complete my entire evaluation on one page.
- **B4.** As a design engineer, I can tune a material in a **live configurator** — colors, speed, intensity, grain, scale — and copy the resulting JSX and props directly, so that I get the exact variant I want without reverse-engineering the source.
- **B5.** As a design engineer, I can install a material through a shadcn-compatible registry CLI command, or by plain copy-paste if I prefer, so that it lands in my codebase as source I own within a minute.
- **B6.** As a buyer, I can purchase a Personal or Team license as a guest with a card or wallet and receive my entitlement and receipt instantly, so that checkout never becomes a reason to abandon.
- **B7.** As a returning buyer, I can re-access everything I have licensed and retrieve proof of license via an email magic link, so that a lost receipt or a new machine is never a problem.
- **B8.** As a buyer, I can export a tuned material as a static PNG, WebP, or short video loop, so that I can use the same surface in a deck, a social post, or an app store screenshot.
- **B9.** As a buyer, I can understand my commercial and client-work rights in one read, in plain language, before I pay, so that I never need to involve a lawyer over a background.
- **B10.** As a visitor on a phone or a mid-tier laptop, I can browse the catalog and docs comfortably, with demos that stay smooth or degrade gracefully, so that the product's own performance claims are self-evidently true.
- **B11.** As a design engineer with an existing theme, I can bind a material to my design tokens by following documented examples, so that the material matches my product instead of imposing its own palette.
- **B12.** As a cautious evaluator, I can install a genuinely excellent free or OSS material first, so that I can verify code quality with my own build before spending money.
- **B13.** As a design lead, I can share a configured material via URL with my team or a client, so that we can agree on a variant before anyone implements it.
- **B14.** As a buyer, I can see which materials are newest or recently updated, so that I have a reason to return and can trust the library is maintained.

### 5.2 Operator stories

- **D1.** As the operator, I can publish a material — component package, docs, previews, tags, use contexts, pricing tier, static exports — in one continuous flow, so that publishing takes hours rather than days.
- **D2.** As the operator, I can set free, Personal, or Team availability and license terms per SKU or catalog-wide, so that I can run funnel experiments without code changes.
- **D3.** As the operator, I can feature materials on the homepage and organize them into collections, so that I can merchandise drops and give a small catalog editorial shape.
- **D4.** As the operator, I can edit or unpublish a material without breaking access for buyers who already hold entitlements to prior versions, so that catalog maintenance never damages trust.
- **D5.** As the operator, I can see revenue, licenses sold, top materials, configurator engagement, and free-install counts in one place, so that I know what to build next.
- **D6.** As the operator, I can trust that paid packages are never publicly reachable and that registry access is entitlement-gated, so that the catalog is not trivially mirrored.
- **D7.** As the operator, I can refund an order and revoke the associated entitlement in a single action, so that disputes resolve in minutes.
- **D8.** As the operator, I am alerted immediately when a payment or fulfillment step fails, so that no buyer ever waits on a broken purchase.
- **D9.** As the operator, I can publish a new version of a material with a changelog entry, so that buyers can see maintenance and update deliberately.

---

## 6. Scope of Work — Phase 1 (MVP Launch)

### 6.1 Purpose

Deliver a commercially licensed, production-installable materials system at frameline.ai: browse catalog → configure live → install in under one minute → paid license. **Contract boundary is paid public launch.** Detailed functional requirements live in §7; this SOW defines work packages, deliverables, and acceptance.

### 6.2 In-scope work packages

| # | Package | Deliverables | Priority |
|---|---|---|---|
| **WP1** | Discovery & validation | Signal-based demand evidence (no interviews), fake-door WTP tests, ≥3 documented competitive gaps, waitlist landing + capture, throughput timing log | Must |
| **WP2** | Material architecture | Typed material contract (props, tokens, variants, fallback), shared rendering primitives, SSR-safe wrapper, `prefers-reduced-motion` + static fallback layer, perf budget harness | Must |
| **WP3** | Authoring pipeline | Material scaffold, local preview harness, publish path, per-material metadata (contexts, tier, deps); target: 3 materials ≤6h end-to-end post-primitives | Must |
| **WP4** | Catalog & detail UX | Live catalog grid, filters (use context, motion/static, light/dark, free/paid), search/sort, collections, material detail with live preview | Must |
| **WP5** | Configurator | Live prop controls, real-time preview, copy-ready JSX + CLI snippet, deep-linkable config state | Must |
| **WP6** | Distribution | shadcn-compatible registry, CLI install + copy-paste path, entitlement-gated paid sources, token-binding docs/examples | Must |
| **WP7** | Catalog production | **30–40 materials** across **≥6 use contexts** (hero, section, card, empty state, loading, auth, footer, …) at full production bar | Must |
| **WP8** | Commerce & licensing | Guest Stripe Checkout; Free · Static ~$19 · Personal ~$99 · Team ~$299; plain-language rights; receipt + access email; license version pinned per order | Must |
| **WP9** | Entitlement gating | Auth (guest-first), purchase→entitlement in Postgres, webhook-idempotent fulfillment, gated registry reads, free/OSS ungated | Must |
| **WP10** | Docs | Install (CLI + manual), theming/tokens, a11y & reduced-motion, perf notes, examples, licensing FAQ, troubleshooting | Must |
| **WP11** | Admin publish | Hardened admin auth; publish/edit/unpublish; collections; orders/licenses; refund+revoke; basic dashboard | Must |
| **WP12** | Launch ops | Funnel analytics (view→configure→checkout/install), error monitoring, SEO/OG per material, legal pages, pricing page | Should |

### 6.3 Out of scope (this SOW)

Multi-vendor / UGC · layout or UI kits · subscriptions / all-access at MVP · AI generation tooling · native apps · enterprise procurement / SSO / negotiated contracts · Figma parity · team private registry · marketplace mechanics · localization · affiliate program · public third-party API.

These may be scoped in a later SOW after Phase 1 validates.

### 6.4 Definition of Done — paid launch

1. **30–40** published materials, **≥6** use contexts; each has live preview, configurator, docs snippet, tier, perf note, reduced-motion + static fallback.
2. Cold install (CLI **and** copy-paste) into a fresh Next.js + Tailwind app succeeds in **under 60 seconds** with no manual patching.
3. Every material: SSR-safe, no hydration errors, respects theme tokens (no hardcoded color fork for dark mode).
4. Guest checkout completes on Free / Static / Personal / Team; entitlement grants gated registry access within one minute of payment; license email delivered.
5. Unentitled requests to paid registry paths return **403**; free/OSS materials publicly readable.
6. Catalog and key templates meet Core Web Vitals targets; every animated material ships a real reduced-motion fallback.
7. Docs cover install, theming, SSR, reduced-motion, and licensing with no blocking TODOs.
8. Operator can publish a new material end-to-end in **hours**, not days.

### 6.5 Assumptions

Solo operator; Discovery via signals only (no interviews); consumer baseline is React + Tailwind + design tokens; shadcn-style registry install is the primary delivery model; Stripe guest checkout in target geos; Vercel + managed Postgres; one-time licenses at MVP (not subscriptions).

### 6.6 Dependencies

Next.js/TS · Tailwind · shared shader/CSS primitives · shadcn-compatible registry · Postgres · Stripe (+ tax plan) · Auth · Resend · Vercel · Plausible · Sentry · domain `frameline.ai` · competitive teardown sheet.

Blockers: Stripe verification, domain purchase/DNS, OSS seed license clearance, trademark knockout before packaging/registry namespace.

### 6.7 Timeline (studio gates)

| Phase | Exit |
|---|---|
| **Discovery** | Gate 01: ≥100 waitlist / 14d · WTP via fake doors · install-intent signal · throughput 3 materials ≤6h · ≥3 competitive gaps |
| **Architecture** | Material contract, registry, entitlement model frozen; WP2 spike proves SSR + fallback + perf |
| **Design** | Catalog, detail+configurator, pricing, docs shells approved |
| **Validation** | Cold-install on clean app; paid path in Stripe test mode end-to-end |
| **Build & Launch** | Definition of Done (§6.4) met; paid public launch |

Gate failure at Discovery pauses Build. Catalog may reduce toward **30** before the production bar is relaxed.

### 6.8 Change control

Scope additions require a written note (problem → deliverable → gate impact). If launch date is fixed, add a Must only by demoting another Must. Anything in §6.3 needs a **new SOW**. Material count changes within 30–40 are not change requests; dropping below **30** materials or below **6** use contexts is.

### 6.9 Later product phases *(not this SOW)*

| Phase | Adds (after wedge validates) |
|---|---|
| **2 — Depth** | Borders, glass, elevation, cursors, transitions · bundles/promos/drop email · Extended/agency tier · richer configurator |
| **3 — Moat** | Figma parity · team private registry · recurring revenue only if cadence justifies it |
| **Parked** | AI tools · layout/UI kits · multi-vendor · configurator SaaS |

---

## 7. Functional Requirements

Requirements use MoSCoW priorities: **[M]** Must, **[S]** Should, **[C]** Could. All are scoped to MVP unless explicitly marked as a later phase.

### 7.1 Catalog, Search & Filtering

- **[M]** Visual catalog grid with live or high-fidelity previews. Previews must be virtualized, lazily activated, or otherwise throttled so that a grid of animated materials does not saturate the CPU or GPU.
- **[M]** Filter by use context (hero, section, card, empty state, loading, auth, footer), motion versus static, light/dark suitability, and free versus paid.
- **[M]** Keyword search across title, description, tags, and use contexts with near-instant results.
- **[M]** Sort by newest, most popular, and name.
- **[M]** Pagination or infinite scroll — pick one — with scroll position preserved on back-navigation from a detail page.
- **[M]** Collections index and collection detail pages with cover treatment and editorial description.
- **[S]** Filter and sort state reflected in the URL for shareable, bookmarkable, indexable filtered views.
- **[S]** Graceful degradation: automatically fall back to static preview stills on low-power devices, on `prefers-reduced-motion`, or when the tab is backgrounded.
- **[C]** "Similar materials" derived from tags or embeddings.

### 7.2 Material Detail & Configurator

- **[M]** Large live preview with an explicit play/pause control and a reduced-motion toggle that demonstrates the fallback the buyer will actually ship.
- **[M]** Complete props table: name, type, default, description, and required/optional status.
- **[M]** Specs block: dependencies, approximate bundle impact, browser support, rendering technique (CSS, Canvas, WebGL), and a measured performance note.
- **[M]** Plain-language license summary with a link to full terms, and an unambiguous primary CTA — "Install free" or "Buy license" — that reflects the visitor's entitlement state.
- **[M]** Configurator exposing the material's key props with live re-render, producing copy-ready JSX and a copy-ready CLI install command.
- **[M]** Related materials from the same collection, use context, or tag set.
- **[S]** Shareable configurator URL with encoded prop state.
- **[S]** Open Graph and Twitter card images that render the material attractively for social sharing.
- **[S]** Light/dark preview toggle demonstrating token binding on the same material.
- **[C]** In-context mockups placing the material behind a hero shell, card, or auth layout.

### 7.3 Install & Delivery (Registry)

- **[M]** shadcn-compatible registry with CLI install for free materials and for entitled buyers.
- **[M]** Documented copy-paste path with an explicit source location for every material, so the CLI is never a hard dependency.
- **[M]** Entitlement-gated registry endpoints: paid material sources are never publicly fetchable, and access tokens are minted per user after server-side entitlement verification.
- **[M]** Token binding documented with working examples: which CSS variables a material consumes, how to override them, how dark mode resolves.
- **[M]** Every animated material ships a static and a reduced-motion fallback as part of the package, not as an optional extra.
- **[M]** Materials declare peer dependencies explicitly and avoid mandatory provider wrappers.
- **[S]** Version pinning and upgrade guidance in docs; changelog per material.
- **[S]** Install verification: a documented smoke-check so a buyer can confirm a successful install in seconds.
- **[C]** Private team registry with organization-scoped tokens (Phase 3).

### 7.4 Licensing, Checkout & Payments

- **[M]** Guest checkout through a hosted, PCI-compliant provider. Card plus Apple Pay and Google Pay. No raw card data touches our infrastructure.
- **[M]** Three tiers at launch: **Free**, **Personal**, **Team** (final names TBD), each with plain-language rights stated at point of sale.
- **[M]** Entitlement granted through webhook-driven, idempotent fulfillment. Never grant access from a client-side redirect alone.
- **[M]** Order confirmation page with immediate, actionable access instructions — registry token, install command, and docs link.
- **[M]** Email receipt containing order summary, license summary, license version, and a durable access link.
- **[M]** Each order pins the exact license plan and license version purchased. License changes never apply retroactively.
- **[M]** Tax handling decided and implemented before accepting international payments — either automated tax calculation or a merchant of record.
- **[M]** Invoice-suitable receipts with the ability to add a company name and VAT identifier (P3 requirement).
- **[S]** Admin-initiated refund that revokes the associated entitlement and registry access.
- **[C]** Promo and discount codes (Phase 2).

### 7.5 Free / OSS Funnel

- **[M]** A meaningful set of free materials installable without payment, through the same registry mechanism as paid materials.
- **[M]** At least one genuinely excellent open-source seed component, published under a permissive license, engineered to the full production bar. This is the primary trust and distribution instrument.
- **[M]** Free installs counted in analytics and attributable to later conversion.
- **[S]** Optional email capture before free install — skippable, or a clear value exchange. No dark patterns.
- **[S]** In-context, non-intrusive upgrade prompts within free material docs.

### 7.6 Static Export

- **[M]** Export a configured material as PNG or WebP at common sizes (desktop hero, social, presentation slide, mobile).
- **[M]** Export respects the exact configurator state, so what the buyer tuned is what they receive.
- **[S]** Short MP4 or WebM loop export for social and motion demos.
- **[S]** Export packs sold as a low-price entry SKU (~$19) and included as a perk in higher tiers.
- **[S]** Watermarking applied only to free preview exports, and only if abuse data justifies it.
- **[C]** Batch export of a full collection.

### 7.7 Admin Publish & Management

- **[M]** Secure admin area behind hardened auth — passkey, or password plus 2FA. A single admin user is acceptable at MVP.
- **[M]** Publish flow: upload or reference component package, write docs, generate previews, enter metadata (title, slug, description, tags, use contexts), set tier availability and pricing, save as draft, publish.
- **[M]** Automated preview generation — static stills and OG images derived from the material itself, never produced by hand.
- **[M]** Edit and unpublish with an explicit, documented entitlement policy so existing buyers retain access.
- **[M]** Collection management: create, edit, order materials within a collection, set cover treatment, feature on homepage.
- **[M]** Orders and licenses list with status, buyer email, items, and a refund-and-revoke action.
- **[S]** Dashboard: revenue over time, licenses sold, top materials, configurator engagement, free installs, traffic summary.
- **[S]** Version publishing with changelog entry.
- **[C]** Bulk metadata tooling and CSV import (Phase 2).

### 7.8 Accounts & Auth

- **[M]** Buyer accounts are optional. Guest checkout is the first-class path; entitlements are keyed to a verified email address.
- **[M]** Passwordless buyer authentication (email magic link or code) for viewing licenses, retrieving registry tokens, and re-accessing purchases.
- **[M]** Account page listing licenses held, license version and terms, registry access token with regeneration, and download or export history.
- **[M]** Admin authentication is entirely separate from buyer auth and hardened independently.
- **[S]** Post-purchase prompt to save a guest order to an account, claiming prior orders by verified email.
- **[C]** Team seat invitations (Phase 3, with the team registry).

### 7.9 Marketing, Docs & Content Pages

- **[M]** Homepage: live material hero, clear category statement, credibility proof (code quality, perf, tokens), and direct paths to catalog, configurator, and pricing. This page carries the highest craft bar in the product because it is the primary proof of the thing being sold.
- **[M]** Pricing page with side-by-side tier comparison and explicit permitted/not-permitted rights.
- **[M]** Docs hub: installation, token binding and theming, accessibility, performance guidance, framework notes, worked examples, and troubleshooting.
- **[M]** License, Terms, Privacy, and Contact/Support pages.
- **[S]** Changelog and drops journal — aids SEO, signals maintenance, and drives return visits.
- **[S]** About page written in product voice: what the library is for and what standard it holds itself to. Not a résumé.
- **[C]** Technical writing on surface craft as an organic acquisition channel.

---

## 8. Non-Functional Requirements

### 8.1 Performance

Performance is not a hygiene requirement here — it is a product claim. The core objection to every competing effect library is that it makes the buyer's site slower, and the product must visibly refute that on its own pages.

Marketing and docs pages must achieve Largest Contentful Paint under 2.0 seconds on a 4G connection, with all Core Web Vitals in the "good" range. Catalog interactions — filtering, sorting, searching — must feel instant, under roughly 200ms perceived latency. The catalog grid must never run more animated previews concurrently than the device can sustain: previews activate on intersection, pause when off-screen or backgrounded, and fall back to static stills on low-power devices.

Every published material carries a **measured performance note**: rendering technique, approximate main-thread and GPU cost, bundle impact, and any known constraints. Where a material can be implemented CSS-only, a CSS-only tier is offered alongside the richer version. A material that cannot be described honestly in performance terms does not ship.

### 8.2 Demo & Media Delivery

Live demos are the product's primary sales asset and its heaviest payload, so delivery is engineered deliberately. Static preview stills and OG images are generated automatically at publish time — never produced manually — and served through a CDN with on-the-fly resizing and modern format negotiation (AVIF/WebP with fallbacks). Video loops used in marketing are compressed, poster-framed, and never autoplay with audio.

Paid material source packages never pass through a public CDN cache and are never reachable by URL guessing. They are served only through entitlement-verified, short-lived, rate-limited endpoints. Preview media is public by design; deliverable source is not.

### 8.3 SEO

Every commercially meaningful page — marketing, catalog, material detail, collection, and docs — is server-rendered or statically generated with unique titles and descriptions, canonical URLs, and appropriate structured data. URLs are clean, stable, and human-readable: `/materials/{slug}`, `/collections/{slug}`, `/docs/{section}`. The surface-type segment is designed so Phase 2 adjacent types are additive rather than breaking.

Material pages are the primary organic acquisition surface and are written to rank for problem-shaped queries ("animated gradient background react", "noise texture component tailwind") rather than brand queries. Sitemap, robots, and per-material Open Graph imagery are required at launch, not deferred.

### 8.4 Accessibility

A library that sells visual effects has an elevated obligation here, because the most common professional objection to effect libraries is that they are inaccessible. WCAG 2.1 AA is the target for all product chrome: full keyboard navigability, visible focus states, sufficient contrast, accessible forms and checkout, and alt text on all preview and export imagery.

Every animated material must respect `prefers-reduced-motion` with a **real fallback** — a considered static composition, not merely a frozen frame or a disabled animation. The configurator is fully keyboard-operable, and every control is labeled. Materials must not trap focus, must be safely decorative (`aria-hidden` where appropriate), and must never interfere with the accessibility of content layered over them. Contrast guidance for foreground text over each material is part of its documentation.

### 8.5 Security

HTTPS everywhere with HSTS. Checkout is hosted, so no card data reaches our infrastructure. Paid packages live in private storage and are delivered only through short-lived, entitlement-verified tokens, with server-side entitlement checks on every mint. Registry tokens are per-user, revocable, and regenerable from the account page.

Payment webhooks are signature-verified, and fulfillment is idempotent so retries cannot double-grant or double-charge. Admin access uses hardened authentication with session hardening and logging of consequential admin actions. Rate limiting applies to authentication, registry token minting, package fetches, and export generation. Standard hygiene — input validation, dependency updates, secret management — is assumed.

Determined redistribution of source code cannot be technically prevented, and the product does not pretend otherwise. Protection is legal and economic: clear licensing, pinned license versions per order, and a legitimate-buyer experience good enough that piracy is not worth the friction.

### 8.6 Privacy & Compliance

Data collection is deliberately minimal: email address, order and entitlement records, and aggregate usage analytics. A clear privacy policy states what is collected and why. Analytics are privacy-friendly and cookie-light by preference, with consent handling appropriate to buyer geographies. Digital-goods tax obligations are resolved before international sales begin — either through automated tax calculation or by using a merchant of record.

### 8.7 Responsiveness & Compatibility

Fully responsive from 360px to ultrawide. The catalog, configurator, and docs must all be genuinely usable on a phone — the configurator in particular needs a touch-appropriate control layout rather than a shrunken desktop panel. Supported targets are the last two major versions of evergreen browsers. Materials must degrade predictably where a rendering technique is unsupported, and the degradation path is documented per material.

### 8.8 Reliability & Operability

Checkout and entitlement minting are the critical availability surface. Degraded browsing is tolerable; a failed purchase or a buyer unable to install after paying is not. Every payment and fulfillment failure raises an alert the solo operator will actually see. Database backups are automated and storage is provider-redundant. Error monitoring covers both the storefront and the registry endpoints. Because there is no on-call rotation, the system is designed to fail safe: entitlements are durable records in our own database, independent of the payment provider, so access survives third-party outages.

---

## 9. Information Architecture & Key Screens

```
Home
├── Materials (/materials)                         → catalog root; extensible to future surface types
│   └── Material detail + configurator (/materials/{slug})
├── Collections (/collections)
│   └── Collection detail (/collections/{slug})
├── Search (/search?q=…)
├── Docs (/docs)
│   ├── Installation & registry
│   ├── Theming & design tokens
│   ├── Accessibility & reduced motion
│   ├── Performance guidance
│   ├── Examples & recipes
│   └── Troubleshooting
├── Pricing (/pricing)
├── Changelog (/changelog)
├── About (/about)
├── License (/license) · Terms · Privacy · Contact
├── Checkout (hosted) → Confirmation (/orders/{token})
├── Account (/account)
│   ├── Licenses & rights held
│   ├── Registry access token
│   └── Sign in (magic link)
└── Admin (/admin) — auth-gated
    ├── Materials (list, create, edit, version, publish)
    ├── Collections
    ├── Orders & licenses (+ refund/revoke)
    └── Dashboard
```

**Key screens and their jobs.**

| Screen | Primary job | Design notes |
|---|---|---|
| Home | Convert curiosity into catalog exploration or purchase intent | Highest craft bar in the product; live hero material; category statement above the fold; code-quality proof visible without scrolling far |
| Catalog | Fast visual scanning of live materials | Dense but breathable grid; sticky filters; intersection-activated previews; instant filter feedback; scroll position preserved on return |
| Material detail + configurator | Complete the entire evaluation and convert | Large live preview; configurator adjacent, not buried; props, perf, and license all reachable without leaving; single unambiguous CTA reflecting entitlement state |
| Docs | Produce a successful first install | Copy-first, prose-second; every code block runnable; token binding shown with a real before/after |
| Pricing | Make the tier choice obvious in one read | Side-by-side permitted/not-permitted; no asterisks; client-work rights stated plainly for P3 |
| Confirmation | Deliver access immediately | Registry command and token above the fold; docs link; save-to-account prompt secondary |
| Account | Prove entitlement and restore access | Licenses held with version; token regeneration; nothing else competing for attention |
| Admin publish | Publish a material in hours, not days | Single continuous flow; auto-generated previews; sensible defaults; draft-first |

---

## 10. Data Model (High Level)

Entities and key relationships — illustrative, not a schema specification.

- **Material** — `id, slug, title, description, surface_type, status (draft/published/unpublished), tags[], use_contexts[], rendering_technique, tier_availability, docs_md, perf_notes, browser_support, dependencies[], published_at, alt_text`. `surface_type` exists from day one even though MVP ships one value, so Phase 2 adjacency is additive (G7).
- **MaterialVersion** — `id, material_id, version, changelog, package_ref, checksum, released_at`. Enables versioned updates and lets entitlements resolve to a specific, reproducible package.
- **MaterialPreview** — `id, material_id, kind (grid/detail/og/export), media_key, sort_order`. Public CDN-served derivatives, generated automatically at publish.
- **MaterialProp** — `id, material_id, name, type, default_value, description, configurable (bool)`. Drives both the documented props table and the configurator UI from one source of truth.
- **Collection** and **CollectionMaterial** — `collection: id, slug, name, description, cover_preview_id, featured, sort_order`; join carries `position`.
- **LicensePlan** — `id, key (free/personal/team), name, version, summary, full_text, price, active`. Versioned; every order pins a version so terms never change retroactively.
- **User** — `id, email, role (buyer/admin), created_at`. Buyer accounts are optional; guest orders link by verified email and can be claimed later.
- **Order** — `id, email, user_id (nullable), payment_provider_ref, status (pending/paid/refunded), subtotal, tax, total, created_at`.
- **Entitlement** — `id, order_id (nullable for grants), user_email, plan_key, license_version, material_scope (all/set), status (active/revoked), granted_at, revoked_at`. **The source of truth for all paid access.** Durable, independent of the payment provider, and immutable in substance once granted.
- **RegistryToken** — `id, user_email, token_hash, entitlement_id, created_at, last_used_at, revoked_at`. Mediates CLI access; regenerable by the buyer, revocable by the operator.
- **AccessEvent** — `id, subject (material_id), actor (email or anonymous), kind (install/export/download/configure), created_at`. Powers analytics, funnel attribution, and abuse detection.
- **EmailCapture** *(optional)* — `email, source (free_install/waitlist/newsletter), consent, created_at`.

**Design principles.**

- Entitlements are the single source of truth for access. They survive material edits, unpublishing, and payment-provider changes.
- Surface type and use context are first-class dimensions in both data and URLs so that Phase 2 expansion requires no migration.
- No deliverable package is ever reachable by public URL. Every fetch passes an entitlement check and a short-lived token.
- Props are modeled as data so that the documentation, the configurator, and the generated JSX cannot drift apart.
- Licenses are versioned and pinned per order; the terms a buyer agreed to are permanently recoverable.

---

## 11. Monetization & Licensing Model

### 11.1 Revenue model (MVP)

One-time license purchases. No subscription at launch — the buyer's mental model is "I am buying materials," and introducing recurring billing before the catalog earns it suppresses conversion for all three personas.

**Pricing anchors — hypotheses to validate in Discovery (Gate 01, G2):**

| Tier | Anchor | Rationale |
|---|---|---|
| Free | $0 | Funnel and trust instrument. Limited material set plus an OSS seed engineered to the full production bar. |
| Static export | ~$19 | Entry SKU. Captures deck, social, and non-React demand and creates a low-commitment first transaction. |
| Personal | ~$99 | Sits inside P1's discretionary spend and under P2's mental ceiling. One-time, perpetual, solo commercial use. |
| Team | ~$299 | P3's tier. Multi-seat and unambiguous client-work rights are the value, not extra materials. |

The Free tier is a deliberate acquisition cost, not a trial. It exists to prove code quality in the buyer's own build before money is discussed, which is the single strongest conversion lever available given that the core objection is quality skepticism.

### 11.2 License tiers

| Tier | Permitted | Not permitted |
|---|---|---|
| **Free** | Unlimited personal and commercial use of the designated free materials in your own products and client work | Redistributing or reselling the source; including it in a competing asset library or template product |
| **Personal** | One individual; unlimited personal and commercial projects owned by that individual; static exports for decks, social, and marketing | Use across a team; deliverables handed to third-party clients as their own asset; redistribution or resale of source |
| **Team** | Up to a defined seat count within one organization; unlimited projects; **client work where the material ships inside a client deliverable**; static exports; invoice-suitable receipt | Redistribution or resale of source; sublicensing the library to clients as a standalone asset; inclusion in templates or asset packs for sale |
| **Extended / Agency** *(Phase 2)* | Everything in Team, plus higher seat counts and use in products where the material is a core resold component | Redistribution of source as a standalone asset under any circumstance |

**Licensing principles.**

- A plain-language human summary appears at the point of sale, with full terms one click away. A buyer should never need a lawyer to license a background.
- All tiers are perpetual, non-exclusive, and non-transferable.
- Licenses are versioned, and every order pins the version in force at purchase. Later changes never apply retroactively.
- One universal prohibition across every tier: redistributing or reselling the source packages, including inside templates, starter kits, or asset bundles.
- Client-work rights are stated explicitly rather than implied. Ambiguity here is the top P3 kill criterion and the top source of pre-sale support email.

---

## 12. Suggested Tech Stack

> A recommendation, not a mandate. The rationale optimizes for a solo operator: minimal operations burden, excellent media handling, strong SEO, and maximum shipped polish per hour invested. Final choices are made at Architecture, after Gate 01.

| Layer | Recommendation | Rationale |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SSG for SEO-critical catalog, material, and docs pages; one codebase for storefront, docs, admin, and registry API routes; the framework our buyers already use, which matters because our components must work natively in it |
| Styling / UI | **Tailwind CSS**, minimal accessible primitives | The buyer's stack is Tailwind; our components must feel native to it. Avoid off-the-shelf themes — the visual bar is the product |
| Materials layer | Shared shader/CSS primitive layer; WebGL where justified, CSS-only tier where possible | A shared primitive layer is what makes hours-not-days publishing achievable (G6) and keeps quality consistent across the catalog |
| Registry | **shadcn-compatible registry + CLI** | Buyers already trust and understand this install pattern; compatibility removes the largest onboarding objection and requires no proprietary tooling |
| Database | **Postgres** (managed: Neon or Supabase) + **Drizzle or Prisma** | Relational fit for orders and entitlements; managed means zero operations; a typed ORM keeps a solo codebase maintainable |
| Package storage | **Cloudflare R2 or S3** (private buckets), signed access | Cheap, durable, standard signed-access delivery; paid packages never public |
| Media / CDN | **Vercel Image Optimization or Cloudflare Images** | On-the-fly resizing and modern formats for preview stills, OG images, and exports |
| Payments | **Stripe Checkout + Stripe Tax + webhooks** | Hosted and PCI-compliant, wallets included, automated digital-goods tax, well-trodden webhook fulfillment. Alternative: **Lemon Squeezy or Paddle** as merchant of record — higher fees in exchange for fully outsourced global tax compliance. Decide before international launch |
| Auth | **Auth.js or Clerk** — magic links for buyers, hardened credentials or passkey for admin | Passwordless matches the low-friction, guest-first buyer model |
| Email | **Resend or Postmark** with React Email | Reliable transactional receipts, license summaries, and access links |
| Search | Postgres full-text plus indexed filters at MVP | A 30–40 item catalog does not need a search service; add one only when the catalog demands it |
| Analytics | **Plausible or Fathom** plus payment-provider dashboard, with server-side install events | Privacy-friendly, lightweight, and sufficient for the KPIs in §13 |
| Hosting | **Vercel** | First-class Next.js support, preview deployments, zero operations for a solo operator |
| Monitoring | **Sentry** plus provider alerting | Fulfillment and registry failures must surface immediately |

**Key architectural notes.**

- **Fulfillment is webhook-driven and idempotent.** The payment provider's completion event creates the Order, grants the Entitlement, mints or associates a RegistryToken, and sends the receipt. Entitlement is never granted from a client redirect, and every webhook handler is safe to replay.
- **Entitlements are owned in our database,** not inferred from the payment provider. Access must survive provider outages, migrations, and pricing changes.
- **The registry is a first-class API surface,** not an afterthought bolted onto the storefront. It is rate-limited, entitlement-checked on every request, and versioned so that CLI upgrades never break existing installs.
- **Admin lives in the same application behind role-gated routes.** No separate CMS at MVP; a headless CMS remains a reasonable alternative for material metadata and docs if authoring ergonomics demand it later.
- **Props are the contract.** The props model drives the documentation table, the configurator controls, and the generated JSX from one definition, so the three can never disagree.

---

## 13. Success Metrics / KPIs

### 13.1 North star

**Licensed revenue trend, qualified by successful installs.** Revenue alone can be bought with a launch spike; revenue plus a rising rate of entitled materials actually installed indicates the product is delivering the outcome it promises.

### 13.2 Timeline targets (PMF path)

No interview gate. Validate by shipping and measuring.

| Horizon | What “winning” looks like |
|---|---|
| **Week 1** | Buy `frameline.ai` · waitlist + ≥6 live demos · fake-door pricing live · 1 material at full production bar |
| **Week 2** | ≥40 waitlist (solo-realistic) · 3 materials at bar · fake `npx` logger · OSS seed public · Gate 01 on track |
| **Week 4** | **Gate 01 pass** (or one remediation cycle) · Architecture started · ≥100 waitlist · clear pricing winner from fake-door |
| **Month 2** | **Paid launch** · ≥10 paying licenses **or** ≥$1k revenue · catalog ≥12 materials · checkout→fulfill works · ≥1 unpaid organic share/week |
| **Month 3** | ≥25 licenses cumulative **or** ≥$2.5k revenue · free→paid conversion measurable · time-to-publish ≤6h avg · refunds <5% |
| **Month 6** | **PMF signal:** ≥$2k/mo run-rate **or** ≥80 licenses · catalog 30–40 · organic installs without constant posting · support <5 tickets / 100 licenses |

**PMF for Frameline:** strangers install materials into real apps and pay without a sales call; the catalog grows solo without burnout; organic demand compounds.

### 13.3 Acquisition & funnel

- Visitor → material detail view rate
- Material view → configurator engagement rate *(the strongest observed intent signal available before checkout)*
- Configurator engagement → install attempt or checkout start
- Checkout start → completed purchase (target above 60%, given hosted checkout)
- Overall visitor → purchase conversion (healthy digital-goods benchmark: 1–3%)
- Free install → paid conversion rate, and median time between the two
- Average order value and tier mix (Personal vs. Team vs. export SKU)
- Refund rate (target under 2%)

### 13.4 Engagement & discovery

- Free installs per month and OSS seed adoption (stars, forks, dependent repositories)
- Organic impressions and clicks for material and docs pages; rankings for problem-shaped queries
- Return-visitor rate and changelog-driven return traffic
- Social referral traffic from demo clips and shared configurator URLs
- Docs engagement: install-page completion, troubleshooting page hits *(a rising troubleshooting rate is a defect signal, not an engagement win)*

### 13.5 Operational

- Time to publish a new material end-to-end (target: hours, tracked per material)
- Fulfillment failure rate (target: zero; every failure alerts)
- Support requests per 100 licenses — the proxy for licensing clarity and install reliability
- Registry uptime and median token-mint latency
- Weekly operating hours consumed by non-creative work

### 13.6 Quality

- Core Web Vitals pass rate across marketing, catalog, and docs
- Accessibility score at or above 95 on key templates
- Percentage of catalog with a published, measured performance note (target: 100%)
- Percentage of animated materials shipping a real reduced-motion fallback (target: 100%)
- Reported production defects per material shipped

---

## 14. Competitive Landscape & Category Positioning

### 14.1 Peers

| Peer | What they own | Where they leave room |
|---|---|---|
| **Tailwind Plus** | Trusted, high-quality layout and UI patterns; strong brand and distribution | Deliberately restrained visually. Structure, not surface. No motion materials, no configurator, no visual signature |
| **Aceternity / Magic UI / ReactBits** | Viral reach, high visual energy, free or low-cost | Ubiquity is the product's own liability — adoption guarantees sameness. Inconsistent SSR, token binding, accessibility, and measured performance |
| **21st.dev and community registries** | Breadth and the registry install pattern | Uneven quality by construction; no curation, no coherent point of view, no commercial guarantee |
| **paper-design/shaders and similar primitive libraries** | Excellent low-level rendering primitives | A toolkit for engineers who will do the design work themselves — not finished, opinionated, sellable materials |
| **Grainient and gradient tools** | Focused gradient tooling with generation UX | Output-oriented rather than component-oriented; not a token-bound production component system |
| **Stock and AI imagery** | Infinite static supply | No component contract, no theming, no motion, no exclusivity |

### 14.2 White space

Between **utilitarian component libraries that are deliberately visually neutral** and **loud effect packs that are visually ubiquitous and technically uneven**, there is no curated, commercially licensed, production-grade **surface** library. That is the position.

### 14.3 What we own

1. **Surface as the category, not as a feature.** Specificity is the entire advantage: the product is the obvious answer to a narrow, frequently-asked question.
2. **A production bar stated as a contract.** Tokens, SSR safety, reduced motion with real fallbacks, and a measured performance note on every material — published, testable, and refutable.
3. **Configurator-to-code as the buying experience.** Tuning a material and copying the exact JSX collapses evaluation, customization, and install into one motion.
4. **Curation with a point of view.** A small, deliberately edited catalog is a feature. Buyers are paying for the choices we made, including the ones we rejected.
5. **Client-work licensing written for people who do client work.** The clearest rights language in the category, aimed squarely at the highest-AOV persona.
6. **Figma parity as the long moat** (Phase 3). Nobody else can credibly close the design-to-production surface gap in both directions.

### 14.4 Out of category

Mass stock libraries, unlimited-subscription image vaults, and wallpaper shops. They share a keyword space but not a buyer, a budget, or a job to be done.

---

## 15. Naming

**Locked: Frameline** · domain **frameline.ai** · repo [freitaspauloo/frameline](https://github.com/freitaspauloo/frameline).

| | |
|---|---|
| **Read** | Frame + line — composition, layout, and surface craft without describing a single SKU |
| **Why** | Brandable product name (Linear/Relume mouthfeel) that still makes sense for design engineers; clearer than inventeds, less generic than `devdesign` |
| **Do next** | Purchase `frameline.ai`; trademark knockout before registry namespace / packaging commit |

**Retired shortlist.** Gesso · Albedo · Specular · Nacre · Emulsion · Relay · Devdesign · Designeng · Productui · Rectilinear.

---

## 16. Milestones / Phased Roadmap

> Phases, not dates. Each phase ends with an explicit, checkable exit condition. No phase begins before the prior phase's exit criteria are met.

### Phase 01 — Discovery *(current)*

Prove demand, willingness to pay, and solo throughput before locking Architecture — **by shipping and measuring, not interviewing**.

**Out of scope:** user interviews (no pipeline; speed to PMF over research theater).

- Competitor teardown: pricing, tiers, licensing, delivery, surface-versus-layout mix; code-quality audit of three components each (TypeScript, SSR, tokens, reduced motion, bundle size); performance sampling; acquisition-signal analysis.
- Signal tests: waitlist landing page with live demos; fake-door pricing at $19 / $99 / $299; instrumented fake `npx` install; OSS seed component; demo clips and community probes.
- Throughput test: three materials built to the full production bar.

**Build permitted in Discovery:** waitlist landing, fake doors, and the three throughput materials only. No commerce, registry, or admin.

**Exit criteria:** **Gate 01 passes** (§16.1).

#### 16.1 Discovery Gate 01 — required before Architecture lock

| # | Criterion | Threshold | Why this threshold |
|---|---|---|---|
| **G1** | Demand | ≥ 100 waitlist emails in 14 days, organic | Solo cold-start bar. Vanity volume loses to G2/G4 quality — 40 engaged > 300 dead emails |
| **G2** | Willingness to pay | ≥ 25% fake-door selection at $99+; ≥ 5% at $299 | Validates both the Personal anchor and the existence of the high-AOV Team segment |
| **G3** | Problem proxy | ≥ 20% waitlist open the pricing fake-door **or** ≥ 10 organic replies/DMs citing AI-generic look / hand-built surface pain | Behavioral substitute for interviews — same signal, no recruiting pipeline |
| **G4** | Install intent | ≥ 50 fake installs **or** ≥ 250 OSS seed stars in 14 days | Distinguishes aesthetic admiration from intent to put code in a repository |
| **G5** | Operator throughput | 3 finished materials at ≤ 6h average, post-primitives | Determines whether a 30–40 material catalog is reachable solo |
| **G6** | Distinctiveness | ≥ 3 defensible, documented gaps versus top paid peers | Confirms a position that is not immediately copyable |

**Gate outcomes.** All six pass → proceed to Architecture. Four or five pass → one scoped remediation cycle on the failing criteria, then re-gate. Three or fewer → reposition or stop. Gate results and evidence are logged in [`DISCOVERY.md`](./DISCOVERY.md).

### Phase 02 — Architecture

- Lock the data model, URL structure, entitlement model, and registry contract.
- Decide payments approach: direct provider plus automated tax, versus merchant of record.
- Design the shared material primitive layer — the foundation that makes hours-not-days publishing possible.
- Finalize license texts, tier boundaries, and pricing based on Gate 01 evidence.
- Name locked as **Frameline** (`frameline.ai`). Finish trademark clearance and domain purchase.

**Exit criteria:** Architecture decision record complete; registry contract specified; license texts drafted; primitive layer prototyped against two materials of different rendering techniques.

### Phase 03 — Design

- High-fidelity design for the six critical templates: home, catalog, material detail with configurator, docs, pricing, and confirmation.
- Define the visual system for the product itself and the aesthetic point of view governing the catalog.
- Design the admin publish flow against the hours-not-days target.

**Exit criteria:** All six templates designed and reviewed; configurator interaction model validated on desktop and touch; publish flow walked through end to end on paper.

### Phase 04 — Validation

- Ship the material detail page and configurator with real materials; watch early waitlist / buyer usage (session recordings, support, install success) — not a formal interview round.
- Test the install path end to end, from CLI command to a rendered component in an existing themed application.
- Validate license comprehension: can a P3-type buyer state their client-work rights correctly after one read?

**Exit criteria:** Buyers complete install unaided in under a minute; license comprehension is correct without clarification; no critical usability defect remains in the configurator.

### Phase 05 — Build & Launch

- Catalog, material pages, configurator, docs, and marketing pages.
- Registry API and CLI with entitlement gating.
- Checkout, webhook fulfillment, entitlements, receipts, and account re-access.
- Free tier and OSS seed. Static export. Admin publish and management. Analytics and monitoring. Legal pages.
- Seed catalog: 30–40 materials across at least six use contexts, including a meaningful free selection.

**Exit criteria:** End-to-end test purchase, install, export, refund, and revocation all succeed; Core Web Vitals green on key templates; every material carries a perf note and a reduced-motion fallback; launch shipped.

### Phase 06 — Growth *(post-launch)*

Adjacent surface types, versioned updates, bundles and promo codes, drop emails, and deeper funnel instrumentation — sequenced by real Phase 05 data, not by this document.

---

## 17. Risks & Open Questions

### 17.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Demand risk** — an excellent library nobody knows exists | High | High | Gate 01 tests this before build; OSS seed and free tier as distribution instruments; every material is an SEO surface and a shareable demo; launch as drops, not as a one-time event |
| **Solo throughput** — catalog cannot grow fast enough to justify the price | High | High | Shared primitive layer is an Architecture-phase requirement; G5 gate tests throughput empirically before commitment; publish time tracked as an ongoing KPI |
| **Free clones** — materials are copied and republished free | High | Medium | Accept that source-level copying is unpreventable. Compete on curation, cadence, licensing certainty, configurator experience, and support — none of which a clone reproduces |
| **Becoming the next effect cliché** — success creates sameness | Medium | High | Configurator-driven variation means no two installs look identical; deliberately restrained catalog; retire overexposed materials; hold a point of view rather than chasing trends |
| **One bad implementation destroys trust** — a WebGL material that crashes or tanks performance | Medium | High | Published perf note per material; CSS-only tiers; mandatory fallbacks; mid-tier device testing before publish; treat any production defect report as a stop-the-line event |
| **AI copilots close the low-quality gap** | Medium | Medium | Compete above the line AI reaches: coherent taste, system-level consistency, measured performance work, and commercial licensing certainty |
| **Pricing miscalibration** — anchors too high or too low | Medium | Medium | G2 fake-door validates before build; tier mix tracked from day one; one-time pricing is easier to raise than a subscription |
| **Licensing ambiguity** drives support load and lost P3 deals | Medium | Medium | Plain-language summaries; explicit client-work language; comprehension tested in Phase 04; version pinned per order |
| **Scope creep into layout and UI kits** dilutes the category | Medium | High | Non-goal stated explicitly (§3.2); any layout work requires an explicit positioning decision, not a backlog ticket |
| **Platform dependence** — payment or hosting policy shifts | Low | Medium | Entitlements owned in our own database; standard, portable patterns; merchant-of-record remains a switchable option |
| **Tax and compliance complexity** on international digital sales | Medium | High | Resolved in Architecture: automated tax calculation or merchant of record, decided before international launch |

### 17.2 Open questions

1. **Personal versus Team rights split** — what is the exact client-work language, and does Personal permit any client deliverables at all?
2. **Payments** — direct provider with automated tax, or merchant of record? Higher fees in exchange for eliminating global tax exposure for a solo operator.
3. **Recurring revenue** — should an optional updates subscription exist later, and if so, what does a lapsed subscriber retain?
4. **Free tier aggressiveness** — how much genuine value can the free tier carry before it suppresses conversion rather than driving it?
5. **Brand architecture** — is this its own standalone brand, or an explicitly studio-attached product? Affects domain, About page, and long-term positioning.
6. **Figma parity timing** — v1.5 or v2? It is the most durable moat but also the largest non-code investment.
7. **Update policy for entitlements** — do buyers receive all future versions of purchased materials indefinitely, all future materials within a tier, or a time-boxed update window?
8. **Catalog depth at launch** — is 30–40 materials the right threshold to feel complete rather than thin, given six-plus use contexts to cover?
9. **Static export positioning** — standalone entry SKU, or a perk bundled into paid tiers? It reaches a different buyer than the core product.
10. **Team seat definition** — a hard seat count, an organization-wide license, or an honor-system band? Enforcement cost versus P3 friction.
11. **Rendering technique mix** — what share of the catalog should be CSS-only for maximum compatibility versus WebGL for maximum distinctiveness?
12. **Drop cadence** — what publishing rhythm can be sustained indefinitely? This drives return visits, changelog value, and the credibility of the maintenance claim.

---

## 18. Parking Lot

Ideas deliberately deferred. Recorded so they stop competing for attention, not because they lack merit.

- **AI generation** — generating materials from a prompt or a brand palette.
- **AI design tooling** — dither, blur, grain, and component-builder utilities in the Paper Design class.
- **Layout blocks and full UI kits** — only reachable if it can be done without diluting surface positioning.
- **Subscriptions and all-access passes** — revisit once catalog depth and update cadence make recurring value honest.
- **Public API for third parties** and programmatic material generation.
- **Marketplace mechanics** — guest artists or curated third-party contributions under our production bar.
- **Native design-tool plugins** beyond the Figma parity kit.
- **Community showcase** — a gallery of shipped products using the materials, as social proof and an SEO surface.

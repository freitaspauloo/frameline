# Discovery — Phase 01 (V2)

**Status:** In progress. Unlocks Architecture + PRD lock when Gate 01 passes.  
**Product:** See `docs/PRD.md`  
**Owner:** DUDESIGN (solo founder-operator)

---

## Purpose of this phase

Prove demand, willingness to pay, and solo throughput **before** locking Architecture — by shipping signals, not interviews.

**Out of scope:** user interviews (no pipeline; speed to PMF over research theater).

Studio method: Discovery → Architecture → Design → Validation → Build.

---

## Problem (summary)

Taste does not currently ship as code. Teams choose generic primitives, cliché effect libraries, static/AI images, or unshippable Figma — or burn days building materials in-house.

Full problem, JTBD, and personas: `docs/PRD.md` §§2–4.

---

## Category & wedge

**Sell:** A curated surface & materials system — typed React components, token-bound, production-safe — with a live configurator and clear licensing.

**Entry SKU:** Static export (PNG/WebP/MP4) for decks/social.

**Later:** Adjacent surface types → Figma parity → team registry.

---

## Competitive teardown targets

Tailwind Plus · Aceternity · Magic UI (and one adjacent: Grainient or 21st.dev).  
Checklist lives in Notion / below §F1.

---

## Naming

**Locked: Frameline** · `frameline.ai` · repo `freitaspauloo/frameline`.

Retired shortlist: Gesso · Albedo · Specular · Nacre · Emulsion · Relay.

Purchase domain + trademark knockout still open.

---

## Research plan

### F1 — Competitor teardown

- [ ] Fill [Competitive analysis](https://app.notion.com/p/43ed8a1cca7f40638801bfb73a548c97) sheet (Teardown → Done) · mirror: [`docs/COMPETITIVE.md`](./COMPETITIVE.md)
- [ ] Price, tiers, license, delivery, surface vs layout mix
- [ ] Code quality on 3 components (TS, SSR, tokens, reduced-motion, bundle)
- [ ] Perf sample + acquisition signals
- [ ] Write: gaps a solo operator can own

### F2 — Signal tests

- [x] Waitlist landing + live demos — `/waitlist` with 6 free previews  
- [x] Fake-door pricing ($19 / $99 / $299) — `/pricing` permitted/not-permitted + WTP beacon  
- [x] Fake `npx` install logger — `POST /api/install` → `.data/installs.json`  
- [ ] OSS seed component  
- [ ] X demo clips + community probes  

### F3 — Throughput

- [ ] 3 materials to full production bar ≤6h avg post-primitives  

### F4 — Gate 01

| # | Criterion | Threshold |
|---|---|---|
| G1 | Demand | ≥100 waitlist / 14d organic (solo cold-start; G2/G4 quality > vanity volume) |
| G2 | WTP | ≥25% on $99+; ≥5% on $299 |
| G3 | Problem proxy | ≥20% waitlist open fake-door **or** ≥10 organic replies/DMs citing AI-generic look / hand-built surface (no interviews) |
| G4 | Intent | ≥50 fake installs or ≥250 seed stars / 14d |
| G5 | Throughput | 3 comps ≤6h avg |
| G6 | Distinctiveness | ≥3 defensible peer gaps |

**Build allowed in Discovery only:** waitlist, fake doors, 3 materials.

---

## Success metrics (timeline)

| Horizon | Target |
|---|---|
| **Week 1** | Domain live · waitlist + demos + fake-door · 1 material at bar |
| **Week 2** | ≥40 waitlist · 3 materials · OSS seed · fake install logger |
| **Week 4** | Gate 01 pass · Architecture started · ≥100 waitlist · pricing winner clear |
| **Month 2** | Paid launch · ≥10 licenses or ≥$1k · catalog ≥12 |
| **Month 3** | ≥25 licenses or ≥$2.5k · publish ≤6h · refunds <5% |
| **Month 6** | **PMF:** ≥$2k/mo or ≥80 licenses · catalog 30–40 · organic demand |

**PMF for Frameline:** strangers install into real apps and pay without a sales call; catalog grows solo; organic demand compounds.

---

## Related

- Active PRD: `docs/PRD.md`
- Archived V1 storefront PRD: `docs/PRD-v1.md`

---

## Instrumentation surfaces (shipped in storefront)

These exist so Gate 01 signals can be collected without inventing metrics. Counts are **instance-local** (`.data/` on the running host) until a production store is wired.

| Surface | Path | What it records |
|---|---|---|
| Waitlist landing | `/waitlist` + `POST /api/waitlist` | Email signups → `.data/waitlist.json`; page also shows live free demos |
| WTP intent beacon | `POST /api/intent` | Plan interest (`static` / `personal` / `team`) from pricing Buy clicks and checkout submit → `.data/wtp.json` (rate-limited; non-blocking) |
| Install intent beacon | `POST /api/install` | Fake CLI / JSX / paste copy from home, `/free`, and material detail → `.data/installs.json` (rate-limited; non-blocking) |
| Admin snapshot | `/admin` | Waitlist + WTP by plan + install counts by source/SKU (reads the files above) |

Do not treat empty or demo `.data/` files as Gate 01 pass evidence. Thresholds remain in §F4 above.

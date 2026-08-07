# Frameline — Lean V1 scope lock

**Status:** locked for soft launch prep  
**Owner (scope/catalog/test gate):** Cursor  
**Owner (polish/social/GTM):** Paulo  

## One sentence

3–5 best materials, dead-simple install, paid license, email list growing, light social proof.

## Who it’s for

Builders shipping Next.js / React marketing and product UI who are tired of default gradients and want installable surface (CLI or copy-paste) with a clear commercial license.

## Non-goals (V1)

- 30–40 material catalog (SOW MVP bar)
- Perfect brand redesign
- Heavy content engine / daily posting machine
- Enterprise procurement / SSO
- Public `$0.50` test SKU

## Prices (live)

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | Free-tier SKUs only (Aurora Mesh in V1 set) |
| Static | $19 | Still / non-React exports path |
| Personal | $99 | Personal-tier registry install |
| Team | $299 | Client-work / multi-seat clarity |
| Test `$0.50` | internal only | Requires `FRAMELINE_ALLOW_TEST_PLAN=true` |

## V1 starter SKUs (public)

| # | Slug | Role | Tier |
|---|---|---|---|
| 1 | `fog-layer` | Hero / atmosphere | (catalog tier) |
| 2 | `aurora-mesh` | Soft mesh hero (free evaluate) | free |
| 3 | `ink-dither` | High-contrast texture | personal |
| 4 | `blue-signal` | Product / signal UI | (catalog tier) |
| 5 | `liquid-chrome` | Wild-card demo candy | (catalog tier) |

Everything else remains in the repo and admin, **hidden from public catalog, sitemap, and detail routes**.

## Success (first 2 weeks)

- 20–50 waitlist signups **or** 3–10 paid conversions  
- ≥1 public install story  
- New material publishable in &lt;1 day without breaking checkout  

## Code flags

- Public catalog filter: `src/materials/v1-launch.ts`  
- Test plan gate: `FRAMELINE_ALLOW_TEST_PLAN=true` (Cursor/Vercel) to re-enable smoke checkout  

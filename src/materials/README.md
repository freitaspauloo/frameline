# Materials (operator map)

How a Frameline material is wired end-to-end:

| Piece | File(s) | Role |
|---|---|---|
| Component | `src/materials/<slug>.tsx` | Live surface + `MaterialShell` (reduced-motion / `forceStatic`) |
| Catalog | `catalog.ts` | Browse metadata: title, description, tier, contexts, tags, `perfNotes`, `renderingTechnique` |
| Props | `props.ts` | Configurator + detail Props table (`MATERIAL_PROPS`) |
| Names | `component-names.ts` | Slug → export name (`COMPONENT_NAMES`); smoke asserts 1:1 with catalog |
| Renderers | `renderers.tsx` | `renderMaterial(slug, …)` switch used by catalog previews + detail |
| Public API | `index.ts` | Re-exports for app code |

Collections live in `collections.ts`. Types in `types.ts`.

**Author a new material:** follow [`docs/AUTHORING.md`](../../docs/AUTHORING.md) (scaffold with `pnpm material:new`, then catalog → props → names → renderer → smoke).

**Integrity:** `pnpm smoke` checks catalog length, props coverage, collections, and that every catalog slug has a non-fallback `COMPONENT_NAMES` entry matching the PascalCase export.

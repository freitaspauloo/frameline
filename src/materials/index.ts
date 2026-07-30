export {
  MATERIALS_CATALOG,
  MATERIAL_TYPES,
  getMaterial,
  getMaterialsByType,
  isMaterialType,
} from "./catalog";
export {
  MATERIALS_COLLECTIONS,
  getCollection,
  getCollectionMaterials,
  getFeaturedCollections,
} from "./collections";
export { AuroraMesh } from "./aurora-mesh";
export type { AuroraMeshProps } from "./aurora-mesh";
export { InkDither } from "./ink-dither";
export type { InkDitherProps } from "./ink-dither";
export { GrainField } from "./grain-field";
export type { GrainFieldProps } from "./grain-field";
export { MaterialShell } from "./material-shell";
export type {
  MaterialCatalogEntry,
  MaterialCollection,
  MaterialSurfaceProps,
  MaterialTier,
  MaterialType,
  MaterialUseContext,
} from "./types";

/**
 * Resolve hook so smoke scripts can import TS sources that use
 * extensionless relative imports (Node ESM otherwise fails).
 */
import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const base = join(process.cwd(), "src", rel);
    const withTs = extname(rel) ? base : `${base}.ts`;
    const withTsx = extname(rel) ? base : `${base}.tsx`;
    if (existsSync(withTs)) {
      return nextResolve(pathToFileURL(withTs).href, context);
    }
    if (existsSync(withTsx)) {
      return nextResolve(pathToFileURL(withTsx).href, context);
    }
  }

  if (
    context.parentURL &&
    specifier.startsWith(".") &&
    !extname(specifier) &&
    !specifier.endsWith("/")
  ) {
    const parentDir = dirname(fileURLToPath(context.parentURL));
    const asTs = join(parentDir, `${specifier}.ts`);
    const asTsx = join(parentDir, `${specifier}.tsx`);
    if (existsSync(asTs)) {
      return nextResolve(pathToFileURL(asTs).href, context);
    }
    if (existsSync(asTsx)) {
      return nextResolve(pathToFileURL(asTsx).href, context);
    }
  }

  return nextResolve(specifier, context);
}

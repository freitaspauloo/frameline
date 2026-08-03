/**
 * Register the extensionless-TS resolve hook for smoke scripts.
 * Usage: node --experimental-strip-types --import ./scripts/smoke-register.mjs …
 */
import { register } from "node:module";

register("./smoke-resolve.mjs", import.meta.url);

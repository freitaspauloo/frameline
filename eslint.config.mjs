import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Vendored registry output (Vercel AI Elements, inference.sh blocks). These
    // are kept close to upstream so `shadcn add` can re-apply cleanly, so the
    // React Compiler rules are relaxed here rather than rewriting kit
    // internals. First-party code, including src/app/inference, still gets the
    // full ruleset.
    files: ["src/components/ai-elements/**", "src/components/infsh/**"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This repo is a single Next.js 16 app (`frameline` / "Frameline", a storefront for animated shader "materials"). It uses the App Router with Turbopack. Scripts live in `package.json`.

- Package manager is **pnpm**. Both `package-lock.json` and `pnpm-lock.yaml` are committed, but `pnpm-workspace.yaml` is authoritative (it carries pnpm-only settings such as `minimumReleaseAgeExclude` and a build-script allowlist that npm would silently ignore). The startup update script runs `pnpm install`; use `pnpm` (not `npm`) for all commands so the lockfile and workspace settings stay consistent.
- Run: `pnpm dev` serves the app at http://localhost:3000 (Turbopack). Build: `pnpm build`. Lint: `pnpm lint`.
- `pnpm install` prints a warning that build scripts for `sharp` and `unrs-resolver` are ignored. This is expected and harmless here — `pnpm dev`, `pnpm build`, and `pnpm lint` all work without them (`sharp` only affects production image optimization). Do not run the interactive `pnpm approve-builds`.
- `pnpm lint` currently reports pre-existing errors (mostly `react-hooks/set-state-in-effect`) in existing source files. These are code-quality issues in the repo, not environment problems, so a non-zero lint exit does not indicate a broken setup.
- Material detail pages (e.g. `/materials/aurora-mesh`) render live WebGL shaders via `@paper-design/shaders-react`; they need a browser with WebGL to display, but the dev/build servers do not require it.
- Cursor MCP servers for this project live in `.cursor/mcp.json` (Firebase + Stripe). See `.cursor/mcp-firebase.md` and `.cursor/mcp-stripe.md`. Stripe uses OAuth to `https://mcp.stripe.com`; Cloud Agents also need the server enabled/authenticated under the agents MCP dropdown (or Dashboard → Integrations & MCP).

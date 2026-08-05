# Firebase auth across environments

Client config is committed (`src/lib/firebase-public-config.ts`) so Google/email UI works in every clone.

**Admin session exchange** still needs secrets (never commit these):

| Name | Where |
|---|---|
| `FIREBASE_PROJECT_ID` | `frameline-b89ac` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@frameline-b89ac.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | full private key from the service account JSON (`\n` escaped ok) |

## Cursor Cloud Agents

1. Open [Cloud Agents → Environments → frameline](https://cursor.com/dashboard/cloud-agents/environments/e/41b0b315-8d14-11f1-a7d1-d6b4613131ce)
2. Add the three secrets above (Environment secrets / Secrets)
3. Start a **new** agent chat (existing VMs won’t magically get new secrets mid-run)
4. Optional: `pnpm firebase:sync-secrets` writes `.secrets/firebase-adminsdk.json` for MCP/CLI

## Vercel

Project → Settings → Environment Variables → same three keys (+ optional `NEXT_PUBLIC_*` overrides).

## Check

`GET /api/auth/firebase-status` → `admin: true`, `client.configured: true`

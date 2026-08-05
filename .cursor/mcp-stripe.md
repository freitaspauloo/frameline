# Stripe MCP (Cursor)

Project MCP config lives in `.cursor/mcp.json` (`stripe` → `https://mcp.stripe.com`).

Auth is OAuth against your Stripe account (sandbox or live). Prefer that over embedding a secret key in config.

## Local / IDE
1. Pull this repo so `.cursor/mcp.json` includes the `stripe` server.
2. Reload MCP / restart Cursor so `stripe` appears under Tools & MCP.
3. Complete the Stripe OAuth consent when prompted (Dashboard → user settings → OAuth sessions to revoke later).
4. Optional one-click: [Install Stripe MCP in Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=stripe&config=eyJ1cmwiOiJodHRwczovL21jcC5zdHJpcGUuY29tIn0%3D).

Do **not** commit restricted/secret API keys. If a client cannot use OAuth, use a [restricted key](https://docs.stripe.com/keys/restricted-api-keys) via local headers / env only — never in git.

## Cloud Agents
Repo `mcp.json` configures the IDE. Cloud Agents use servers from the [agents MCP dropdown](https://cursor.com/agents) and, on a team plan, **Dashboard → Integrations & MCP**.

1. Add / enable **Stripe** as an HTTP MCP server pointing at `https://mcp.stripe.com` (same as the repo entry).
2. Complete OAuth for your user (Cloud Agent OAuth is per-user).
3. Confirm the server is enabled for the run before asking the agent to call Stripe tools.

Dashboard: https://cursor.com/dashboard/cloud-agents · Integrations: https://cursor.com/dashboard/integrations

## Docs
- Stripe MCP: https://docs.stripe.com/mcp
- Cursor MCP: https://cursor.com/docs/mcp

# Stripe MCP (Cursor)

Config: `.cursor/mcp.json` → `stripe` → `https://mcp.stripe.com`  
Auth: OAuth (preferred). No API keys in git.

## Desktop (skip the deeplink — it often fails)

1. In Cursor: **Settings → Tools & MCP → Add Custom MCP** (opens `mcp.json`).
2. Ensure this entry exists under `mcpServers`:

```json
"stripe": {
  "url": "https://mcp.stripe.com"
}
```

3. Save, then click **Connect** / login next to Stripe (browser OAuth).
4. In Stripe Dashboard, confirm MCP is allowed: https://dashboard.stripe.com/settings/mcp (sandbox and/or live).

Or paste the same JSON into `~/.cursor/mcp.json` and restart Cursor.

## Cloud Agents

Repo `mcp.json` does **not** authenticate Cloud Agents by itself.

1. Open the run: https://cursor.com/agents  
2. Use the **MCP** dropdown on the agent → enable **Stripe** (`https://mcp.stripe.com`).  
3. Complete OAuth when prompted.  
4. Team plan: also register under https://cursor.com/dashboard/integrations

## Docs
- https://docs.stripe.com/mcp  
- https://cursor.com/docs/mcp  

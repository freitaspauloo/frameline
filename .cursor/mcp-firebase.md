# Firebase MCP (Cursor)

Project MCP config lives in `.cursor/mcp.json`.

## Local / this VM
1. Keep service account at `.secrets/firebase-adminsdk.json` (gitignored).
2. Restart Cursor / reload MCP so `firebase` appears in the tool list.
3. If prompted, run the `firebase_login` tool once (or rely on Application Default Credentials from the service account).

## Cloud Agents
Cloud runs pick up `.cursor/mcp.json` from the repo. You must also provide credentials the VM can read:

- Upload / sync the service account JSON into the agent environment as `.secrets/firebase-adminsdk.json`, **or**
- Set Cloud Agent secret `GOOGLE_APPLICATION_CREDENTIALS` to a path that exists on the VM after setup.

Dashboard: https://cursor.com/dashboard/cloud-agents/environments (and Integrations & MCP if on a team plan).

## Firebase project
- Project ID: `frameline-b89ac`
- See `.firebaserc` / `firebase.json`

# Apply to freitaspauloo/Paulo

Copy files into the Paulo portfolio repo root (preserve paths), then commit and deploy **paulo.dudesign.us**.

## Files to copy

From this folder (exclude this `APPLY.md`):

- `app/`
- `public/`
- `src/`

## Publish (one command — author `dudufreitas28@gmail.com`)

Run on your machine while logged into GitHub as the **Paulo** repo owner:

```bash
git clone https://github.com/freitaspauloo/frameline.git
cd frameline && git checkout dev
git clone https://github.com/freitaspauloo/Paulo.git ../Paulo
./handoff/paulo-portfolio-frameline-cases/publish.sh
```

The script sets `user.email` to **dudufreitas28@gmail.com** only for that repo, commits, and pushes `main`.

Vercel deploys **Paulo** on push to `main`.

## Automated (GitHub Actions on frameline)

1. In **freitaspauloo/frameline** → Settings → Secrets → Actions, add **`PAULO_DEPLOY_TOKEN`** (classic PAT with `repo` access to **Paulo**).
2. Actions → **Sync Paulo portfolio handoff** → **Run workflow** on branch **`dev`** (or push any change under `handoff/paulo-portfolio-frameline-cases/` on `dev` to auto-run).

## Cloud Agent note

The agent environment only has push access to **frameline** by default. To let agents push **Paulo** directly (no Actions PAT), add **Repository dependency** `github.com/freitaspauloo/Paulo` in the [Cloud Agent environment](https://cursor.com/dashboard/cloud-agents/environments/e/ffb8a96a-a705-11f1-a7d1-d6b4613131ce) and Save. Otherwise use manual steps above or the frameline workflow with optional `PAULO_DEPLOY_TOKEN`.


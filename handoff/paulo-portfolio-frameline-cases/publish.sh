#!/usr/bin/env bash
# Publish Frameline portfolio handoff to freitaspauloo/Paulo (triggers Vercel on main).
set -euo pipefail

PUBLISH_EMAIL="dudufreitas28@gmail.com"
PUBLISH_NAME="Paulo Freitas"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HANDOFF="$(cd "$(dirname "$0")" && pwd)"
PAULO_DIR="${PAULO_DIR:-$ROOT/../Paulo}"

if [[ ! -d "$PAULO_DIR/.git" ]]; then
  echo "Clone Paulo first: git clone https://github.com/freitaspauloo/Paulo.git \"$PAULO_DIR\""
  exit 1
fi

cp -R "$HANDOFF/app" "$HANDOFF/public" "$HANDOFF/src" "$PAULO_DIR/"

cd "$PAULO_DIR"
git config user.email "$PUBLISH_EMAIL"
git config user.name "$PUBLISH_NAME"
git checkout main
git pull origin main
git add app public src
git diff --staged --quiet && { echo "Nothing to commit."; exit 0; }
git commit -m "Add seven Frameline showcase cases to homepage"
git push origin main

echo "Done. Vercel will deploy paulo.dudesign.us from main."

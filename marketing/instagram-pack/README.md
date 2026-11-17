# Frameline — pacote Instagram

Assets prontos para postar. Paleta Frameline (`#2d6bff`, granulado, Instrument Serif + Inter).

## Pastas

| Pasta | Conteúdo | Tamanho |
|-------|----------|---------|
| `posts-avulsos/` | 6 posts feed (1080×1350) | PNG |
| `carrossel-4-slides/` | Carrossel intro (ordem `01` → `04`) | 1080×1350 |
| `formato-ux-dudu/` | Card do site estilo @ux.dudu | 1080×1350 |
| `carrossel-kalypso-6-slides/` | Carrossel estilo @kalypsodesigns (ordem `01` → `06`) | 1080×1440 |
| `fontes-html/` | HTML para reexportar no Chrome headless | editável |
| `legendas/` | Texto sugerido por peça | `.txt` |

## Ordem dos carrosséis

**carrossel-4-slides:** 01 stop shipping → 02 materials → 03 screens → 04 CLI  
**carrossel-kalypso-6-slides:** 01 capa → 02 aurora-mesh → 03 grain-field → 04 ink-dither → 05 screens → 06 install

## Reexportar (opcional)

```bash
cd fontes-html
# Exemplo: um slide do pack Kalypso
google-chrome-stable --headless=new --no-sandbox --allow-file-access-from-files \
  --window-size=1080,1440 --screenshot=out.png \
  "file://$PWD/kalypso.html#cover"
```

Site canônico: https://frameline.ai
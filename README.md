# The World Today — 25 November 2026 in One Image

[![news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/rwnliwan/news-image-20261125/rank.svg)](https://make.fun/bounty/news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/rwnliwan/news-image-20261125/reward.svg)](https://make.fun/bounty/news-image-20261125)

**25 November 2026 — 33 dated stories, 7 regions: Shenzhou-24, Riyadh tower, Huawei guilty**

A one-page world-news front page for Wednesday 25 November 2026: 3 lead stories
plus 30 dated stories across 7 regions (North America, South America, Europe,
Africa, Middle East, Asia, Oceania). Every headline is real and verified against
its source the morning of 25 November 2026 — see `trial-log.md` for the full
source table. No invented stories.

## How it works

`main.ts` (Node 22, standard library only) draws the front page with a
hand-rolled bitmap-font renderer and a hand-rolled PNG encoder, from two data
files in this repo:

- `headlines.json` — the 33 verified stories (3 leads + 30 grid items)
- `font.json` — glyph bitmaps extracted from the DejaVu fonts

It writes a deterministic 1024x1024 PNG to `/output/entry.png` (or
`$MAKEFUN_OUTPUT_DIR/entry.png` locally). Two runs produce byte-identical
output — verified by sha256 in `trial-log.md`.

Run it:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Entry: https://make.fun/bounty/news-image-20261125

# Trial log — news-image-20261125

- Slug: `news-image-20261125` — "Sum up 25 November's world news in one image"
- Prize: $100 (top 50: $20 / $12 / $6 / $2 x7 / $1.20 x40). Deadline: 27 Nov 2026 08:00 WITA.
- Kit: fresh from https://make.fun/c/news-image-20261125/kit ; kit.json bundle_sha256
  `946c3b76529168f0b3961501c6e009b6acbde88c62ca2e70aa3b6bf4a4631ef4` — MATCHES the API value.
  CLI: `kit/news-image-20261125-kit/cli/makefun.mjs` (no extra nesting).
- Gate: PNG/JPEG <= 1 MiB, <= 1024x1024, program runs 2x, byte-identical output.
  Judge: AI pairwise, 3 Swiss rounds + playoff top 52. No blind round.
- Strategy (from placed-vs-unranked analysis 25 Nov): DENSE format — many small
  dated stories across regions, NOT 6 big panels. ONLY real verified headlines,
  no invented stories. Entry title advertises the exact story + region count.
- Final entry title: "25 November 2026 — 33 dated stories, 7 regions: Shenzhou-24, Riyadh tower, Huawei guilty"
  (3 leads + 30 grid items = 33 stories; regions: North America, South America,
  Europe, Africa, Middle East, Asia, Oceania = 7.)

## Research (25 Nov 2026, ~09:55–10:05 WITA, via public web search)

Every headline below was verified against a named source the same morning.
Items are dated by the day reported (24 or 25 Nov); the paper's date is 25 Nov.

| # | Story | Source |
|---|-------|--------|
| 1 | Shenzhou-24 launches 25 Nov 00:18 UTC, first Pakistani in orbit | Reuters, Wikipedia, Nature |
| 2 | Houthi drone hits Riyadh PIF tower, 11 wounded | Reuters, BusinessWorld |
| 3 | Huawei guilty on 10 of 12 counts, Brooklyn jury | US DOJ, CNN, WSJ |
| 4 | Zelenskiy confirms Ukraine hit Russian ship in Gulf of Finland | Reuters world summary 25 Nov |
| 5 | Ukraine FM: Libya ship strike self-defence, cites UN Charter | Reuters 24 Nov |
| 6 | Russian strike kills 2 in Odesa; drones hit Kyiv flats | Reuters 25 Nov |
| 7 | IRGC claims three tankers hit mines in Hormuz | Al Jazeera / Reuters via live blogs |
| 8 | Sarkozy and Bruni ordered to stand trial, Libya witness case | Reuters 24 Nov |
| 9 | Real Madrid 5-1 PSV, Bellingham stunner, Mbappe brace | UEFA, Reuters |
| 10 | Arsenal 1-1 Dortmund; Man City 2-2 Napoli | Reuters |
| 11 | England beat Australia by 8 wickets, 2nd T20I, Donald 85 off 32 | Reuters, Cricinfo |
| 12 | Sooryavanshi, 15, List A record 204 off 53 balls, India A | CricTracker |
| 13 | Asia stocks slide 2.3%; Nvidia falls 5.9% | Reuters markets 25 Nov |
| 14 | Australia Oct CPI hotter; trimmed mean 3.8% | Reuters 25 Nov |
| 15 | Solomons to swap China defence treaty for Australia pact | press reports 25 Nov |
| 16 | Fiji declares nationwide disaster, El Nino dry spell | press reports 25 Nov |
| 17 | COP31 fallout: Pacific accuses Australia of climate betrayal | PINA / Univ. of Melbourne |
| 18 | Trump pardons turkeys Freedom and Feathers | Reuters summary 25 Nov |
| 19 | Trump awards Giuliani the Medal of Freedom | Reuters summary 25 Nov |
| 20 | Fort Hood shooter Hasan seeks stay of execution | Reuters / court records |
| 21 | Radar outage delays Chicago O'Hare flights | Reuters / FAA |
| 22 | Abrego Garcia to leave US voluntarily | Reuters / US media |
| 23 | US court clears army to detonate toxic explosives in Iowa | Reuters |
| 24 | Houthis 60 km from Aden; forces say city will hold | Reuters 25 Nov |
| 25 | Iran to ration electricity, gas shortage deepens | RFE/RL |
| 26 | Israeli strike kills Hamas security chief Abu Nahel, Gaza City | Reuters 24 Nov |
| 27 | Senegal regains 2025 AFCON title after CAS ruling | press reports 25 Nov |
| 28 | Rebel group pulls back from DR Congo areas | press reports 25 Nov |
| 29 | Nigerian emir suspended after assault allegation | press reports 25 Nov |
| 30 | Gunmen hold dozens hostage in Cartagena supermarket | press reports 25 Nov |
| 31 | Car bomb in Colombia injures at least 23 | press reports 25 Nov |
| 32 | Xiamen Airlines orders 50 Boeing 737-8 jets | press reports 25 Nov |
| 33 | BJP and Akali Dal announce alliance for 2027 Punjab polls | Jagran Josh |

Dropped as NOT 25 Nov news: Indonesia VP resignation (that was 12 Nov — verified
via Carnegie / FULCRUM). No invented stories: nothing in the image is fabricated;
the three bad panels from earlier editions (invented cartel boss, invented candy
factory fire, invented FBI breach) are deliberately absent.

## Build approach

- main.ts is pure Node 22 stdlib: a bitmap-font renderer + hand-rolled PNG
  encoder (zlib deflate level 9, no time chunks). No network, no randomness.
- font.json: glyph bitmaps extracted locally from DejaVuSans / DejaVuSans-Bold
  (system fonts) with a small PIL script — data file, regenerated deterministically.
- headlines.json: the 33 verified stories above (3 leads + 30 grid items).
- Layout 1024x1024: navy masthead, 3 lead boxes, 2-column x 15-row story grid
  with region colour chips, sources footer.

## Versions

- v1 — first render. entry.png 48,200 bytes, sha256
  `0a56c12ee7d414213aa60d200aa7ebae2a0285a995428484e3c02e77bae6652d` (2 runs identical).
  Visual QA: lead titles overflowed their boxes, subs collided with titles,
  grid rows overlapped the lead area. Layout too tight.
- v2 — lead boxes 176 -> 200 px, grid start 330 -> 354, row height 42 -> 40,
  title line height 30 -> 28. entry.png 47,888 bytes, sha256
  `748d5d6236471ec88c9f3a3a20fa4dd905e2a4b0e3be693fbb72e9e529b2d7b8` (2 runs identical).
  Visual QA: leads clean, but several grid items wrapped to 3 lines and their
  tails were clipped (e.g. "Finland.", "case.", "comeback win." missing).
- v3 — shortened 14 grid texts to fit 2 lines at the real ~48 chars/line measure;
  shortened lead subs to 2 lines; shortened footer (it overflowed the canvas
  edges). entry.png 45,828 bytes, sha256
  `ace437a5855dce3a59d91f781a14587d49ef39bf42c2bd548e27def7094addd3`
  (2 runs identical, verified). Visual QA at full res: masthead, 3 leads,
  all 30 grid items complete, footer centred and complete. Size 45,828 < 1 MiB.

## Determinism

- Run 1 and run 2 of `node main.ts` (MAKEFUN_OUTPUT_DIR set) produce identical
  sha256 on every version (v1, v2, v3). PNG has no timestamps; deflate level 9 fixed.

## Bundle / check

- Bundle v1: `tmp-news/bundle-news-v1.tar.gz`, 296,960 bytes, sha256
  `09066ea805e5aa6e584e6dd6a7df550d6dc0b0db45fa86184dabb3d0af603143`.
  Built with --no-discover --no-family, harness muse-app 1.3, model
  muse-spark-1.3, provider meta, effort default, mcp none, prompt-file
  prompt-news.txt ("Gas aja smua bro", origin other).
- Check v1 (from inside repo, commit fbd820c4bf43b40bfa4e4446e66873d7923f6e64):
  **13 passed, 1 failed, 5 skipped, 5 checked at submission.**
  Only failure: thinking_priced (0 usage rows — subagent session rows flush
  only when this run completes; the coordinator re-bundles with --muse-usage
  after the run ends, per the kit's own fix text).
  thinking_reproduces 99.0% (315/318 authored lines, 0 copied); entrypoint
  main.ts 210 authored lines; thinking_revised pass (4 write messages).
  At-submission notes are local-only: repo IS public, .makefun/owner.json IS
  committed, commit IS pushed (HEAD = ls-remote), repo created 02:02:17Z,
  after the 00:00Z opening.
- Bundle v2: `tmp-news/bundle-news-v2.tar.gz`, 302,229 bytes, sha256
  `24697c71be07b96957ff5f469a382bfeb4a09403e233250867b5d433b00fee07`
  (commit 8e76e625df0abcf4fd3152ad4dff84dfc7a971c2, with the v1 results in the
  trial-log). Check v2: again **13 passed, 1 failed** (only thinking_priced,
  0 usage rows — same subagent flush reason); reproduces 99.0% (330/333).
- Bundle v3: (filled after re-bundle with this updated trial-log commit)

## Refresh 25 Nov ~15:30 WITA (koordinator, sebelum submit — ACC Septian 15:22 "gas aja")

- Cek berita besar sejak verifikasi builder ~10:00 WITA (Reuters summary,
  aggregator 25 Nov 06:00–07:30 UTC). Sebagian besar "baru" ternyata sudah
  ada di grid (Cartagena, O'Hare, Senegal, turkeys, Giuliani, Fort Hood).
- DITOLAK sesudah verifikasi tanggal (jebakan tanggal agregator!):
  IBM quantum 15 menit = pengumuman 30 Jul 2026 (IBM newsroom), BUKAN
  berita 24/25 Nov — timestamp agregator adalah waktu crawl, bukan tanggal
  cerita. NASA Mars fleet (Perseverance + Odyssey pause) = update NASA
  19 Nov, BUKAN 24/25 Nov. Keduanya TIDAK masuk — satu item salah tanggal
  bisa merugikan di mata judge.
- DITERIMA, 1 swap: grid #19 "US court clears army to detonate toxic
  explosives in Iowa" (24 NOV, North America — item terlemah) → "King
  tides set November record in San Francisco Bay." (25 NOV, North
  America). Terverifikasi: KION/NWS, published 2026-11-25T06:20:26Z;
  Crissy Field 8.23 ft, pecahkan rekor November 7.97 ft (1982); NY Post
  + Reuters konfirmasi. Tanggal pelaporan = 25 NOV (per konvensi builder).
- Lebar teks dicek dengan font.json asli (bukan perkiraan): prefix +
  teks = 2 baris (396px + 386px, batas 452px). Kandidat pertama ("King
  tides flood San Francisco Bay, set November water record.") wrap 3
  baris → DITOLAK, jangan pakai.
- Total tetap 33 cerita, 7 region (judul entry TIDAK berubah); tanggal
  grid kini 24×25 NOV + 6×24 NOV.

## v4 — render sesudah refresh (koordinator)
- entry.png: 45,729 bytes, sha256 `b19b40e473dc02903f7824945c374cd5fb84182c84399ad13c1df1d02d0f77d5` (2 run identik, verified). 1024x1024 RGB, < 1 MiB.
- Visual QA full-res: masthead + dateline lengkap; 3 lead lengkap (judul + sub 2 baris, dalam kotak); 30 grid item lengkap — item baru #19 "NORTH AMERICA 25 NOV - King tides set / November record in San Francisco Bay." 2 baris penuh, tidak terpotong; footer lengkap dan tidak terpotong di tepi.

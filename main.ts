// THE WORLD TODAY - Wednesday 25 November 2026.
// A deterministic one-page world-news front page: 3 lead stories + 30 dated
// stories across 7 regions, drawn from font.json + headlines.json with a
// hand-rolled bitmap-font renderer and a hand-rolled PNG encoder.
// Node 22 standard library only. No network, no time, no randomness:
// the same inputs always produce the same bytes in /output/entry.png.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const W = 1024;
const H = 1024;

const PAPER: [number, number, number] = [248, 244, 232];
const INK: [number, number, number] = [26, 26, 26];
const NAVY: [number, number, number] = [20, 33, 61];
const RED: [number, number, number] = [185, 28, 28];
const WHITE: [number, number, number] = [255, 255, 255];
const GREY: [number, number, number] = [90, 86, 76];

const REGION_COLOR: Record<string, [number, number, number]> = {
  'North America': [29, 78, 216],
  'South America': [21, 128, 61],
  Europe: [109, 40, 217],
  Africa: [194, 65, 12],
  'Middle East': [185, 28, 28],
  Asia: [14, 116, 144],
  Oceania: [161, 98, 7],
};

type Glyph = { w: number; h: number; rows: string[] };
type FontFace = { size: number; glyphs: Record<string, Glyph> };
type FontSet = { body: FontFace; head: FontFace };
type Lead = { date: string; n: number; region: string; sub: string; title: string };
type Item = { date: string; region: string; text: string };
type Data = {
  date: string;
  leads: Lead[];
  items: Item[];
  regions: string[];
  total: number;
};

const ROOT = dirname(fileURLToPath(import.meta.url));
const FONTS: FontSet = JSON.parse(readFileSync(join(ROOT, 'font.json'), 'utf8'));
const DATA: Data = JSON.parse(readFileSync(join(ROOT, 'headlines.json'), 'utf8'));

// ---- canvas ----
const px = new Uint8Array(W * H * 3);
for (let i = 0; i < W * H; i++) {
  px[i * 3] = PAPER[0];
  px[i * 3 + 1] = PAPER[1];
  px[i * 3 + 2] = PAPER[2];
}

function setPixel(x: number, y: number, c: [number, number, number]): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const o = (y * W + x) * 3;
  px[o] = c[0];
  px[o + 1] = c[1];
  px[o + 2] = c[2];
}

function rect(x: number, y: number, w: number, h: number, c: [number, number, number]): void {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) setPixel(i, j, c);
}

function hline(x: number, y: number, w: number, c: [number, number, number]): void {
  rect(x, y, w, 2, c);
}

// ---- bitmap text ----
function glyphFor(face: FontFace, ch: string): Glyph {
  return face.glyphs[ch] ?? face.glyphs['?'];
}

function textWidth(face: FontFace, text: string, scale: number): number {
  let w = 0;
  for (const ch of text) {
    const g = glyphFor(face, ch);
    w += (g.w + 1) * scale;
  }
  return w - scale;
}

function drawText(
  face: FontFace,
  text: string,
  x: number,
  y: number,
  color: [number, number, number],
  scale: number,
): number {
  let cx = x;
  for (const ch of text) {
    const g = glyphFor(face, ch);
    for (let r = 0; r < g.rows.length; r++) {
      const row = g.rows[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === '1') {
          for (let dy = 0; dy < scale; dy++)
            for (let dx = 0; dx < scale; dx++)
              setPixel(cx + c * scale + dx, y + r * scale + dy, color);
        }
      }
    }
    cx += (g.w + 1) * scale;
  }
  return cx - x;
}

function wrapText(face: FontFace, text: string, scale: number, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const test = cur === '' ? word : cur + ' ' + word;
    if (textWidth(face, test, scale) <= maxW || cur === '') {
      cur = test;
    } else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

// ---- masthead ----
rect(14, 14, 996, 104, NAVY);
const mast = 'THE WORLD TODAY';
const mastW = textWidth(FONTS.head, mast, 2);
drawText(FONTS.head, mast, Math.floor((W - mastW) / 2), 30, WHITE, 2);
const dateline = 'Wednesday 25 November 2026  |  33 dated stories  |  7 regions';
const dlW = textWidth(FONTS.body, dateline, 1);
drawText(FONTS.body, dateline, Math.floor((W - dlW) / 2), 88, [220, 220, 210], 1);
rect(14, 124, 996, 4, RED);

// ---- lead boxes ----
const LEAD_Y = 140;
const LEAD_H = 200;
const LEAD_W = 312;
for (let k = 0; k < 3; k++) {
  const lead = DATA.leads[k];
  const bx = 28 + k * (LEAD_W + 16);
  rect(bx, LEAD_Y, LEAD_W, LEAD_H, WHITE);
  // border
  hline(bx, LEAD_Y, LEAD_W, NAVY);
  hline(bx, LEAD_Y + LEAD_H - 2, LEAD_W, NAVY);
  rect(bx, LEAD_Y, 2, LEAD_H, NAVY);
  rect(bx + LEAD_W - 2, LEAD_Y, 2, LEAD_H, NAVY);
  // region chip
  const chip = lead.region.toUpperCase();
  const chipW = textWidth(FONTS.body, chip, 1) + 16;
  rect(bx + 12, LEAD_Y + 10, chipW, 22, REGION_COLOR[lead.region]);
  drawText(FONTS.body, chip, bx + 20, LEAD_Y + 15, WHITE, 1);
  drawText(FONTS.body, lead.date, bx + LEAD_W - 62, LEAD_Y + 15, GREY, 1);
  // title
  const titleLines = wrapText(FONTS.head, lead.title, 1, LEAD_W - 24);
  let ty = LEAD_Y + 44;
  for (const ln of titleLines) {
    drawText(FONTS.head, ln, bx + 12, ty, INK, 1);
    ty += 28;
  }
  // sub
  const subLines = wrapText(FONTS.body, lead.sub, 1, LEAD_W - 24);
  let sy = ty + 2;
  for (const ln of subLines) {
    drawText(FONTS.body, ln, bx + 12, sy, GREY, 1);
    sy += 19;
  }
}

// ---- story grid: 30 items, 2 columns x 15 rows ----
const GRID_Y = 354;
const ROW_H = 40;
const COL_W = 472;
const COL_X = [28, 524];
for (let i = 0; i < DATA.items.length; i++) {
  const item = DATA.items[i];
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = COL_X[col];
  const y = GRID_Y + row * ROW_H;
  const color = REGION_COLOR[item.region];
  rect(x, y + 5, 10, 10, color);
  const prefix = item.region.toUpperCase() + ' ' + item.date + ' - ';
  const full = prefix + item.text;
  const lines = wrapText(FONTS.body, full, 1, COL_W - 20);
  let ly = y;
  for (let li = 0; li < lines.length && li < 2; li++) {
    const ln = lines[li];
    if (li === 0) {
      const preW = textWidth(FONTS.body, prefix, 1);
      drawText(FONTS.body, prefix, x + 20, ly, color, 1);
      drawText(FONTS.body, ln.slice(prefix.length), x + 20 + preW, ly, INK, 1);
    } else {
      drawText(FONTS.body, ln, x + 20, ly, INK, 1);
    }
    ly += 19;
  }
  if (row < 14) hline(x, y + ROW_H - 6, COL_W, [210, 204, 188]);
}

// ---- footer ----
const FOOT_Y = GRID_Y + 15 * ROW_H + 6;
hline(28, FOOT_Y, 968, NAVY);
const foot = 'Sources: Reuters, AP, UEFA, US Dept of Justice, BBC, Sky Sports, Cricinfo.';
const footW = textWidth(FONTS.body, foot, 1);
drawText(FONTS.body, foot, Math.floor((W - footW) / 2), FOOT_Y + 10, GREY, 1);

// ---- PNG encode (deterministic: no time chunks, fixed deflate level) ----
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type RGB
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0; // filter none
  raw.set(px.subarray(y * W * 3, (y + 1) * W * 3), y * (1 + W * 3) + 1);
}
const idat = deflateSync(raw, { level: 9 });
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), png);
console.log('wrote entry.png bytes=' + png.length);

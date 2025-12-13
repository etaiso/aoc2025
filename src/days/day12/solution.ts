// Advent of Code 2025 - Day 12
// https://adventofcode.com/2025/day/12

import { lines as splitLines, nums, sum } from '../../utils';

type Cell = readonly [number, number];

type Shape = {
  id: number;
  area: number;
  variants: Cell[][];
  // Maximum bounding dimensions across variants (safe upper bound for "block packing")
  maxW: number;
  maxH: number;
};

type Region = {
  w: number;
  h: number;
  counts: number[];
};

const isShapeHeader = (s: string) => /^\d+:$/.test(s.trim());
const isRegionLine = (s: string) => /^\d+x\d+:\s*/.test(s.trim());

function normalizeCells(cells: Cell[]): Cell[] {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells
    .map(([x, y]) => [x - minX, y - minY] as const)
    .sort((a, b) => (a[1] - b[1]) || (a[0] - b[0]));
}

function rotate90(cells: Cell[]): Cell[] {
  // (x,y) -> (y, -x), then normalize
  return cells.map(([x, y]) => [y, -x] as const);
}

function flipX(cells: Cell[]): Cell[] {
  // mirror around y-axis: (x,y) -> (-x,y)
  return cells.map(([x, y]) => [-x, y] as const);
}

function cellsKey(cells: Cell[]): string {
  return cells.map(([x, y]) => `${x},${y}`).join(';');
}

function shapeVariants(base: Cell[]): Cell[][] {
  const seen = new Set<string>();
  const out: Cell[][] = [];

  const add = (cells: Cell[]) => {
    const norm = normalizeCells(cells);
    const key = cellsKey(norm);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(norm);
  };

  let cur = base;
  for (let r = 0; r < 4; r++) {
    add(cur);
    add(flipX(cur));
    cur = rotate90(cur);
  }

  return out;
}

function variantDims(cells: Cell[]): { w: number; h: number } {
  const maxX = Math.max(...cells.map(([x]) => x));
  const maxY = Math.max(...cells.map(([, y]) => y));
  return { w: maxX + 1, h: maxY + 1 };
}

function parse(input: string): { shapes: Shape[]; regions: Region[]; blockW: number; blockH: number } {
  const ls = splitLines(input.trimEnd());
  const shapes: Shape[] = [];
  const regions: Region[] = [];

  let i = 0;
  // Parse shapes
  while (i < ls.length) {
    const line = ls[i].trim();
    if (line === '') {
      i++;
      continue;
    }
    if (isRegionLine(line)) break;
    if (!isShapeHeader(line)) throw new Error(`Unexpected line while parsing shapes: ${ls[i]}`);

    const id = Number(line.slice(0, -1));
    i++;
    const gridLines: string[] = [];
    while (i < ls.length) {
      const s = ls[i];
      if (s.trim() === '') break;
      if (isShapeHeader(s) || isRegionLine(s)) break;
      gridLines.push(s.trim());
      i++;
    }

    if (gridLines.length === 0) throw new Error(`Shape ${id} has no grid lines`);

    const cells: Cell[] = [];
    for (let y = 0; y < gridLines.length; y++) {
      for (let x = 0; x < gridLines[y].length; x++) {
        if (gridLines[y][x] === '#') cells.push([x, y] as const);
      }
    }
    const variants = shapeVariants(cells);
    let maxW = 0;
    let maxH = 0;
    for (const v of variants) {
      const d = variantDims(v);
      if (d.w > maxW) maxW = d.w;
      if (d.h > maxH) maxH = d.h;
    }
    shapes.push({ id, area: cells.length, variants, maxW, maxH });

    // consume trailing blank line(s)
    while (i < ls.length && ls[i].trim() === '') i++;
  }

  // Parse regions
  while (i < ls.length) {
    const line = ls[i].trim();
    i++;
    if (line === '') continue;
    if (!isRegionLine(line)) throw new Error(`Unexpected line while parsing regions: ${line}`);

    const ns = nums(line);
    if (ns.length < 2) throw new Error(`Bad region line: ${line}`);
    const [w, h, ...rest] = ns;
    const counts = rest.slice(0, shapes.length);
    while (counts.length < shapes.length) counts.push(0);
    regions.push({ w, h, counts });
  }

  // Ensure shapes are indexed 0..n-1 for counts to match reliably
  shapes.sort((a, b) => a.id - b.id);

  // Conservative "block" size that can fit any shape in some orientation
  const blockW = Math.max(...shapes.map((s) => s.maxW));
  const blockH = Math.max(...shapes.map((s) => s.maxH));

  return { shapes, regions, blockW, blockH };
}

type Placement = { mask: bigint; minCell: number };

function buildPlacementsForRegion(shapes: Shape[], w: number, h: number): Placement[][] {
  const placements: Placement[][] = shapes.map(() => []);

  for (let si = 0; si < shapes.length; si++) {
    for (const variant of shapes[si].variants) {
      const maxX = Math.max(...variant.map(([x]) => x));
      const maxY = Math.max(...variant.map(([, y]) => y));
      const sw = maxX + 1;
      const sh = maxY + 1;
      if (sw > w || sh > h) continue;

      for (let y0 = 0; y0 <= h - sh; y0++) {
        for (let x0 = 0; x0 <= w - sw; x0++) {
          let mask = 0n;
          let minCell = Number.POSITIVE_INFINITY;
          for (const [dx, dy] of variant) {
            const x = x0 + dx;
            const y = y0 + dy;
            const idx = y * w + x;
            if (idx < minCell) minCell = idx;
            mask |= 1n << BigInt(idx);
          }
          placements[si].push({ mask, minCell });
        }
      }
    }

    placements[si].sort((a, b) => a.minCell - b.minCell);
  }

  return placements;
}

// Fast, exact solver for small-ish regions (used only when the cheap block-packing
// sufficient condition doesn't apply).
function canFitRegionExact(shapes: Shape[], region: Region): boolean {
  const { w, h, counts } = region;
  const boardArea = w * h;
  const requiredArea = sum(counts.map((c, i) => c * shapes[i].area));
  if (requiredArea > boardArea) return false;
  if (requiredArea === 0) return true;

  const placements = buildPlacementsForRegion(shapes, w, h);
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0 && placements[i].length === 0) return false;
  }

  // Build a fixed ordered list of pieces to place (avoids per-node MRV scans).
  const pieceTypes: number[] = [];
  for (let i = 0; i < counts.length; i++) {
    for (let k = 0; k < counts[i]; k++) pieceTypes.push(i);
  }

  // Sort by fewest placements first, then by larger area.
  pieceTypes.sort((a, b) => {
    const da = placements[a].length - placements[b].length;
    if (da !== 0) return da;
    return shapes[b].area - shapes[a].area;
  });

  const suffixArea: number[] = Array.from({ length: pieceTypes.length + 1 }, () => 0);
  for (let i = pieceTypes.length - 1; i >= 0; i--) {
    suffixArea[i] = suffixArea[i + 1] + shapes[pieceTypes[i]].area;
  }

  // Symmetry breaking for identical consecutive pieces: enforce non-decreasing minCell.
  const memo = new Map<bigint, boolean>();
  const DEPTH_BITS = 10n; // enough for up to 1024 pieces (we'll only use this exact solver on small cases)

  const rec = (idx: number, occ: bigint, occCount: number, lastMinCell: number): boolean => {
    if (idx === pieceTypes.length) return true;
    if (occCount + suffixArea[idx] > boardArea) return false;

    const key = (occ << DEPTH_BITS) | BigInt(idx);
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    const t = pieceTypes[idx];
    const sameAsPrev = idx > 0 && pieceTypes[idx - 1] === t;
    const minAllowed = sameAsPrev ? lastMinCell : -1;

    for (const p of placements[t]) {
      if (p.minCell < minAllowed) continue;
      if ((p.mask & occ) !== 0n) continue;
      const nextLast = sameAsPrev ? p.minCell : -1;
      if (rec(idx + 1, occ | p.mask, occCount + shapes[t].area, nextLast)) {
        memo.set(key, true);
        return true;
      }
    }

    memo.set(key, false);
    return false;
  };

  return rec(0, 0n, 0, -1);
}

export function part1(input: string): number {
  const { shapes, regions, blockW, blockH } = parse(input);
  let ok = 0;
  for (const r of regions) {
    // Fast necessary check: occupied area must fit
    const requiredArea = sum(r.counts.map((c, i) => c * shapes[i].area));
    if (requiredArea > r.w * r.h) continue;

    // Fast sufficient check: if we can assign each present to a disjoint block
    // of size blockW x blockH, they definitely fit (place each present at the top-left
    // of its block).
    const pieces = sum(r.counts);
    const blocks = Math.floor(r.w / blockW) * Math.floor(r.h / blockH);
    if (pieces <= blocks) {
      ok++;
      continue;
    }

    // Otherwise fall back to exact search (used by the example and other small/dense cases).
    if (canFitRegionExact(shapes, r)) ok++;
  }
  return ok;
}

export function part2(_input: string): number {
  // Not implemented yet
  return 0;
}

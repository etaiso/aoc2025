// Advent of Code 2025 - Day 9
// https://adventofcode.com/2025/day/9

import { lines, nums } from "../../utils";

/**
 * Parse input into array of [x, y] coordinates
 */
function parseCoordinates(input: string): [number, number][] {
  return lines(input)
    .filter((line) => line.trim())
    .map((line) => {
      const [x, y] = nums(line);
      return [x, y];
    });
}

/**
 * Calculate rectangle area with two points as opposite corners.
 * The area includes both corner tiles, so we add 1 to each dimension.
 */
function rectangleArea(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): number {
  const width = Math.abs(x2 - x1) + 1;
  const height = Math.abs(y2 - y1) + 1;
  return width * height;
}

export function part1(input: string): number {
  const coords = parseCoordinates(input);

  // Find the maximum rectangle area using any two red tiles as opposite corners
  let maxArea = 0;

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const area = rectangleArea(coords[i], coords[j]);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}

type VerticalEdge = { x: number; yMin: number; yMax: number };
type HorizontalEdge = { y: number; xMin: number; xMax: number };

/**
 * Compute valid x intervals at a given y coordinate.
 * Uses the even-odd rule with half-open intervals for vertical edges,
 * plus horizontal edges at the exact y level.
 */
function computeXIntervalsAtY(
  y: number,
  verticalEdges: VerticalEdge[],
  horizontalEdges: HorizontalEdge[]
): [number, number][] {
  // Find vertical edge crossings using half-open intervals [yMin, yMax)
  const crossings: number[] = [];
  for (const edge of verticalEdges) {
    if (edge.yMin <= y && y < edge.yMax) {
      crossings.push(edge.x);
    }
  }
  crossings.sort((a, b) => a - b);

  // Pair up crossings to get interior intervals
  const intervals: [number, number][] = [];
  for (let i = 0; i < crossings.length; i += 2) {
    if (i + 1 < crossings.length) {
      intervals.push([crossings[i], crossings[i + 1]]);
    }
  }

  // Add horizontal edges at this y level (boundary tiles)
  for (const edge of horizontalEdges) {
    if (edge.y === y) {
      intervals.push([edge.xMin, edge.xMax]);
    }
  }

  // Merge overlapping intervals
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const interval of intervals) {
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push([interval[0], interval[1]]);
    } else {
      merged[merged.length - 1][1] = Math.max(
        merged[merged.length - 1][1],
        interval[1]
      );
    }
  }

  return merged;
}

/**
 * Check if x range [xMin, xMax] is contained in one of the intervals
 */
function isContained(
  xMin: number,
  xMax: number,
  intervals: [number, number][]
): boolean {
  for (const [left, right] of intervals) {
    if (left <= xMin && xMax <= right) return true;
  }
  return false;
}

export function part2(input: string): number {
  const coords = parseCoordinates(input);
  const n = coords.length;

  // Build edges from the polygon (consecutive red tiles connected)
  const verticalEdges: VerticalEdge[] = [];
  const horizontalEdges: HorizontalEdge[] = [];

  for (let i = 0; i < n; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % n];

    if (x1 === x2) {
      // Vertical edge
      verticalEdges.push({
        x: x1,
        yMin: Math.min(y1, y2),
        yMax: Math.max(y1, y2),
      });
    } else {
      // Horizontal edge
      horizontalEdges.push({
        y: y1,
        xMin: Math.min(x1, x2),
        xMax: Math.max(x1, x2),
      });
    }
  }

  // Get all unique y values from vertices
  const allYs = [...new Set(coords.map(([_, y]) => y))].sort((a, b) => a - b);

  // Precompute x intervals at each vertex y (for boundary checks)
  const yToIntervals = new Map<number, [number, number][]>();
  for (const y of allYs) {
    const intervals = computeXIntervalsAtY(y, verticalEdges, horizontalEdges);
    yToIntervals.set(y, intervals);
  }

  // Build bands for interior y values (between consecutive vertex y values)
  const bands: {
    yStart: number;
    yEnd: number;
    xIntervals: [number, number][];
  }[] = [];
  for (let i = 0; i < allYs.length - 1; i++) {
    const yStart = allYs[i];
    const yEnd = allYs[i + 1];
    const yMid = (yStart + yEnd) / 2;
    const intervals = computeXIntervalsAtY(yMid, verticalEdges, horizontalEdges);
    bands.push({ yStart, yEnd, xIntervals: intervals });
  }

  // Check each pair of red tiles
  let maxArea = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[j];

      const xMin = Math.min(x1, x2);
      const xMax = Math.max(x1, x2);
      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);

      // Check at yMin boundary
      const intervalsAtYMin = yToIntervals.get(yMin);
      if (!intervalsAtYMin || !isContained(xMin, xMax, intervalsAtYMin)) {
        continue;
      }

      // Check at yMax boundary
      const intervalsAtYMax = yToIntervals.get(yMax);
      if (!intervalsAtYMax || !isContained(xMin, xMax, intervalsAtYMax)) {
        continue;
      }

      // Check all bands that overlap with (yMin, yMax)
      let valid = true;
      for (const band of bands) {
        // Skip bands that don't overlap with (yMin, yMax)
        if (band.yEnd <= yMin || band.yStart >= yMax) continue;

        // Check if rectangle's x range is contained in band's valid intervals
        if (!isContained(xMin, xMax, band.xIntervals)) {
          valid = false;
          break;
        }
      }

      if (valid) {
        const area = (xMax - xMin + 1) * (yMax - yMin + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
}

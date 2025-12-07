// Advent of Code 2025 - Day 7
// https://adventofcode.com/2025/day/7

import { grid } from '../../utils';

export function part1(input: string): number {
  const g = grid(input);
  const height = g.length;
  const width = g[0].length;

  // Find S position in first row
  let startX = -1;
  for (let x = 0; x < width; x++) {
    if (g[0][x] === 'S') {
      startX = x;
      break;
    }
  }

  // Track active beams by column position (using Set for automatic merging)
  let beams = new Set<number>([startX]);
  let splitCount = 0;

  // Process each row starting from row 1 (row 0 has S)
  for (let y = 1; y < height && beams.size > 0; y++) {
    const newBeams = new Set<number>();

    for (const x of beams) {
      // Skip if beam is out of bounds
      if (x < 0 || x >= width) continue;

      const cell = g[y][x];
      if (cell === '^') {
        // Beam hits splitter - count the split
        splitCount++;
        // New beams emanate from left and right of splitter
        if (x - 1 >= 0) newBeams.add(x - 1);
        if (x + 1 < width) newBeams.add(x + 1);
      } else {
        // Beam continues downward
        newBeams.add(x);
      }
    }

    beams = newBeams;
  }

  return splitCount;
}

export function part2(input: string): number {
  const g = grid(input);
  const height = g.length;
  const width = g[0].length;

  // Find S position in first row
  let startX = -1;
  for (let x = 0; x < width; x++) {
    if (g[0][x] === 'S') {
      startX = x;
      break;
    }
  }

  // Track timelines: Map from position to count of timelines at that position
  // Unlike Part 1, timelines don't merge - we track count at each position
  let timelines = new Map<number, number>([[startX, 1]]);

  for (let y = 1; y < height; y++) {
    const newTimelines = new Map<number, number>();

    for (const [x, count] of timelines) {
      const cell = g[y][x];
      if (cell === '^') {
        // Each timeline at this position splits into 2
        if (x - 1 >= 0) {
          newTimelines.set(x - 1, (newTimelines.get(x - 1) || 0) + count);
        }
        if (x + 1 < width) {
          newTimelines.set(x + 1, (newTimelines.get(x + 1) || 0) + count);
        }
      } else {
        // Timelines continue downward
        newTimelines.set(x, (newTimelines.get(x) || 0) + count);
      }
    }

    timelines = newTimelines;
  }

  // Sum all timelines at the end
  let total = 0;
  for (const count of timelines.values()) {
    total += count;
  }
  return total;
}

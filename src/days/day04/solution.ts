// Advent of Code 2025 - Day 4
// https://adventofcode.com/2025/day/4

import { grid, neighbors8 } from '../../utils';

export function part1(input: string): number {
  const g = grid(input);
  let count = 0;

  for (let row = 0; row < g.length; row++) {
    for (let col = 0; col < g[row].length; col++) {
      if (g[row][col] === '@') {
        const neighborRolls = neighbors8(col, row)
          .filter(([nx, ny]) => g[ny]?.[nx] === '@')
          .length;
        if (neighborRolls < 4) count++;
      }
    }
  }

  return count;
}

export function part2(input: string): number {
  const g = grid(input);
  let count = 0;

  function tryRemove(col: number, row: number): void {
    if (g[row]?.[col] !== '@') return;

    const neighborRolls = neighbors8(col, row)
      .filter(([nx, ny]) => g[ny]?.[nx] === '@')
      .length;

    if (neighborRolls < 4) {
      g[row][col] = '.';  // Remove the roll
      count++;
      // Check neighbors - they might now be accessible
      for (const [nx, ny] of neighbors8(col, row)) {
        tryRemove(nx, ny);
      }
    }
  }

  for (let row = 0; row < g.length; row++) {
    for (let col = 0; col < g[row].length; col++) {
      tryRemove(col, row);
    }
  }

  return count;
}

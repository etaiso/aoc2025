import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

// Simple test case: single splitter
const singleSplitter = `.S.
...
.^.
...`;

// Two splitters in sequence
const twoSplitters = `.S.
...
.^.
...
^.^`;

// Beams merge in the middle
const mergingBeams = `..S..
.....
..^..
.....
.^.^.
.....
..^..`;

export const tests: TestCase[] = [
  // Part 1 tests
  { name: 'single splitter', part: 1, input: singleSplitter, expected: 1 },
  { name: 'two splitters', part: 1, input: twoSplitters, expected: 3 },
  { name: 'merging beams', part: 1, input: mergingBeams, expected: 4 },
  { name: 'example.txt', part: 1, input: example, expected: 21 },

  // Part 2 tests
  // single splitter: 1 timeline splits into 2
  { name: 'single splitter', part: 2, input: singleSplitter, expected: 2 },
  // two splitters at edges: some branches go off-grid
  // 1 -> 2 (at edges) -> edge splitters lose one branch each -> 2 timelines
  { name: 'two splitters', part: 2, input: twoSplitters, expected: 2 },
  // merging beams: 1 -> 2 -> 4 (at 0,2,2,4) -> middle 2 timelines split, edges continue
  // Final: {0:1, 1:2, 3:2, 4:1} = 6
  { name: 'merging beams', part: 2, input: mergingBeams, expected: 6 },
  { name: 'example.txt', part: 2, input: example, expected: 40 },
];

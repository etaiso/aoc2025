import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

export const tests: TestCase[] = [
  // Part 1 tests
  { name: 'example.txt', part: 1, input: example, expected: 3 },
  { name: 'single R50 wraps to zero', part: 1, input: ['R50'], expected: 1 },
  { name: 'single L50 wraps to zero', part: 1, input: ['L50'], expected: 1 },
  { name: 'no movement (R0)', part: 1, input: ['R0'], expected: 0 },
  { name: 'multiple zeros in sequence', part: 1, input: ['R50', 'R100', 'R100'], expected: 3 },
  { name: 'large wrap (R150 = 50+150=200 → 0)', part: 1, input: ['R150'], expected: 1 },
  { name: 'negative wrap (L150 = 50-150=-100 → 0)', part: 1, input: ['L150'], expected: 1 },
  { name: 'near miss (R49 → 99, not 0)', part: 1, input: ['R49'], expected: 0 },
  { name: 'near miss (L49 → 1, not 0)', part: 1, input: ['L49'], expected: 0 },

  // Part 2 tests
  { name: 'example.txt', part: 2, input: example, expected: 6 },
  { name: 'R50 lands on zero', part: 2, input: ['R50'], expected: 1 },
  { name: 'L50 lands on zero', part: 2, input: ['L50'], expected: 1 },
  { name: 'R60 passes through zero once', part: 2, input: ['R60'], expected: 1 },
  { name: 'L60 passes through zero once', part: 2, input: ['L60'], expected: 1 },
  { name: 'R100 full rotation passes zero once', part: 2, input: ['R100'], expected: 1 },
  { name: 'R150 passes zero twice (wrap + land)', part: 2, input: ['R150'], expected: 2 },
  { name: 'L150 passes zero twice (wrap + land)', part: 2, input: ['L150'], expected: 2 },
  { name: 'no movement (R0)', part: 2, input: ['R0'], expected: 0 },
  { name: 'near miss (R49 → 99)', part: 2, input: ['R49'], expected: 0 },
  { name: 'near miss (L49 → 1)', part: 2, input: ['L49'], expected: 0 },
];


import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

export const tests: TestCase[] = [
  // Part 1 tests
  { name: 'example.txt', part: 1, input: example, expected: 2 },

  // Single 1x1 present in 1x1 region fits
  {
    name: 'trivial fits',
    part: 1,
    input: `0:
#

1x1: 1`,
    expected: 1,
  },

  // Two 1x1 presents cannot fit in 1x1 region
  {
    name: 'trivial does not fit',
    part: 1,
    input: `0:
#

1x1: 2`,
    expected: 0,
  },
];

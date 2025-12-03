import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

export const tests: TestCase[] = [
  // Part 1 tests - Maximum joltage from each bank, summed
  
  // Example from problem description: 98 + 89 + 78 + 92 = 357
  { name: 'example.txt', part: 1, input: example, expected: 357 },

  // Single bank tests
  { name: 'descending 98 (adjacent)', part: 1, input: '98', expected: 98 },
  { name: 'ascending 89 (adjacent)', part: 1, input: '89', expected: 89 },
  { name: 'descending order 987654321', part: 1, input: '987654321', expected: 98 },
  { name: 'ascending order 123456789', part: 1, input: '123456789', expected: 89 },
  
  // Non-adjacent maximum
  { name: '9 followed by filler then 8', part: 1, input: '911111118', expected: 98 },
  { name: '8 at start, 9 at end', part: 1, input: '811111119', expected: 89 },
  
  // Same digits - max is that digit repeated
  { name: 'all 5s', part: 1, input: '55555', expected: 55 },
  { name: 'all 9s', part: 1, input: '99999', expected: 99 },
  { name: 'all 1s', part: 1, input: '11111', expected: 11 },
  
  // Order matters - position determines tens vs ones place
  { name: '9 after 8 gives 89, not 98', part: 1, input: '89', expected: 89 },
  { name: '818181911112111 - 9 before 2 is best', part: 1, input: '818181911112111', expected: 92 },
  
  // Multiple banks summed
  { name: 'two banks: 98 + 89', part: 1, input: '98\n89', expected: 187 },
  { name: 'three banks: 99 + 88 + 77', part: 1, input: '99\n88\n77', expected: 264 },
  
  // Minimum length bank (2 digits)
  { name: 'minimum bank 12', part: 1, input: '12', expected: 12 },
  { name: 'minimum bank 91', part: 1, input: '91', expected: 91 },
  
  // Finding best second digit after best first
  { name: '9 at start, best after is 7', part: 1, input: '912347', expected: 97 },
  { name: 'multiple 9s, pick best pair', part: 1, input: '91929394', expected: 99 },
  
  // Edge case: when highest digit appears multiple times
  { name: 'two 9s adjacent', part: 1, input: '99123', expected: 99 },
  { name: '9 then 9 later', part: 1, input: '91239', expected: 99 },

  // Part 2 tests - Select exactly 12 batteries to maximize joltage
  
  // Example from problem: 987654321111 + 811111111119 + 434234234278 + 888911112111 = 3121910778619
  { name: 'example.txt', part: 2, input: example, expected: 3121910778619 },

  // Individual banks from example
  { name: '987654321111111 -> 987654321111', part: 2, input: '987654321111111', expected: 987654321111 },
  { name: '811111111111119 -> 811111111119', part: 2, input: '811111111111119', expected: 811111111119 },
  { name: '234234234234278 -> 434234234278', part: 2, input: '234234234234278', expected: 434234234278 },
  { name: '818181911112111 -> 888911112111', part: 2, input: '818181911112111', expected: 888911112111 },

  // Exactly 12 digits - no choice, just use all
  { name: 'exactly 12 digits', part: 2, input: '123456789012', expected: 123456789012 },
  { name: 'exactly 12 nines', part: 2, input: '999999999999', expected: 999999999999 },

  // 13 digits - skip one (the smallest that doesn't hurt position)
  { name: '13 digits skip a 1', part: 2, input: '9999999999991', expected: 999999999999 },
  { name: '13 digits skip early 1', part: 2, input: '1999999999999', expected: 999999999999 },
  { name: '13 digits - 9 at end valuable', part: 2, input: '8111111111119', expected: 811111111119 },

  // All same digits
  { name: 'all 5s (15 digits)', part: 2, input: '555555555555555', expected: 555555555555 },
  { name: 'all 1s (15 digits)', part: 2, input: '111111111111111', expected: 111111111111 },

  // Multiple banks summed
  { name: 'two banks', part: 2, input: '999999999999111\n111999999999999', expected: 999999999999 + 999999999999 },

  // Strategic digit selection - prefer higher digits at front
  { name: 'skip low digit at start', part: 2, input: '1999999999999', expected: 999999999999 },
  { name: 'keep high digit at end', part: 2, input: '9999999999991', expected: 999999999999 },
  
  // Complex selection
  { name: '14 digits mixed', part: 2, input: '98765432111119', expected: 987654321119 },
];

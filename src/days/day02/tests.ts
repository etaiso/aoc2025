import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

export const tests: TestCase[] = [
  // Part 1 tests - expected values are SUMS of invalid IDs
  { name: '11-22 has 11 and 22', part: 1, input: '11-22', expected: 33 },           // 11 + 22
  { name: '95-115 has 99', part: 1, input: '95-115', expected: 99 },
  { name: '998-1012 has 1010', part: 1, input: '998-1012', expected: 1010 },
  { name: '1188511880-1188511890 has 1188511885', part: 1, input: '1188511880-1188511890', expected: 1188511885 },
  { name: '222220-222224 has 222222', part: 1, input: '222220-222224', expected: 222222 },
  { name: '1698522-1698528 has no invalid IDs', part: 1, input: '1698522-1698528', expected: 0 },
  { name: '446443-446449 has 446446', part: 1, input: '446443-446449', expected: 446446 },
  { name: '38593856-38593862 has 38593859', part: 1, input: '38593856-38593862', expected: 38593859 },

  // Edge cases
  { name: 'exact match single doubled (55)', part: 1, input: '55-55', expected: 55 },
  { name: 'range with all single-digit doubles', part: 1, input: '11-99', expected: 495 }, // 11+22+33+44+55+66+77+88+99
  { name: 'range before first doubled', part: 1, input: '1-10', expected: 0 },
  { name: 'range crossing doubled boundary', part: 1, input: '10-12', expected: 11 },
  { name: 'multiple ranges combined', part: 1, input: '11-22,95-115', expected: 132 },     // 33 + 99
  { name: '4-digit doubled 6464', part: 1, input: '6460-6470', expected: 6464 },
  { name: '6-digit doubled 123123', part: 1, input: '123120-123130', expected: 123123 },

  // Full example sum: 33 + 99 + 1010 + 1188511885 + 222222 + 0 + 446446 + 38593859 = 1227775554
  { name: 'example.txt', part: 1, input: example, expected: 1227775554 },

  // Part 2 tests - patterns repeated at least twice
  { name: '11-22 (same as part1)', part: 2, input: '11-22', expected: 33 },
  { name: '110-115 has 111', part: 2, input: '110-115', expected: 111 },
  { name: '1110-1115 has 1111', part: 2, input: '1110-1115', expected: 1111 },
  { name: '121210-121215 has 121212', part: 2, input: '121210-121215', expected: 121212 },
  { name: 'range 11-1111', part: 2, input: '11-1111', expected: 7611 }, // 11..99 + 111..999 + 1010 + 1111
  { name: 'range 22-2222', part: 2, input: '22-2222', expected: 26487 }, // 22..99 + 111..999 + 1010..2222
  { name: 'triple digit repeated 3x (123123123)', part: 2, input: '123123120-123123130', expected: 123123123 },
];

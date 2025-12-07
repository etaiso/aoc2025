import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

// Helper to convert array of lines to input string
const g = (lines: string[]) => lines.join('\n');

export const tests: TestCase[] = [
  // Part 1 tests - Count fresh available ingredients
  // An ingredient is fresh if its ID falls within any of the given ranges (inclusive)

  // Main example from problem description: IDs 5, 11, 17 are fresh
  { name: 'example.txt', part: 1, input: example, expected: 3 },

  // Single range, single match
  { name: 'single range single match', part: 1, input: g([
    '1-10',
    '',
    '5',
  ]), expected: 1 },

  // Single range, no match
  { name: 'single range no match', part: 1, input: g([
    '1-10',
    '',
    '15',
  ]), expected: 0 },

  // All IDs fresh - every available ID falls in some range
  { name: 'all IDs fresh', part: 1, input: g([
    '1-5',
    '10-20',
    '',
    '1',
    '3',
    '5',
    '10',
    '15',
    '20',
  ]), expected: 6 },

  // No IDs fresh - no available IDs fall in any range
  { name: 'no IDs fresh', part: 1, input: g([
    '1-5',
    '10-15',
    '',
    '6',
    '7',
    '8',
    '9',
    '100',
  ]), expected: 0 },

  // Overlapping ranges - ID falls in multiple ranges (still counts as 1)
  { name: 'overlapping ranges', part: 1, input: g([
    '1-10',
    '5-15',
    '8-12',
    '',
    '9',
  ]), expected: 1 },

  // Multiple IDs in overlapping ranges
  { name: 'multiple IDs in overlapping ranges', part: 1, input: g([
    '1-10',
    '5-15',
    '',
    '3',
    '7',
    '12',
    '20',
  ]), expected: 3 },

  // Large range covering many IDs
  { name: 'large range', part: 1, input: g([
    '1-1000',
    '',
    '1',
    '500',
    '1000',
    '1001',
  ]), expected: 3 },

  // Edge case: ID at exact start of range
  { name: 'ID at range start', part: 1, input: g([
    '5-10',
    '',
    '5',
  ]), expected: 1 },

  // Edge case: ID at exact end of range
  { name: 'ID at range end', part: 1, input: g([
    '5-10',
    '',
    '10',
  ]), expected: 1 },

  // Edge case: ID one before range start (not fresh)
  { name: 'ID before range start', part: 1, input: g([
    '5-10',
    '',
    '4',
  ]), expected: 0 },

  // Edge case: ID one after range end (not fresh)
  { name: 'ID after range end', part: 1, input: g([
    '5-10',
    '',
    '11',
  ]), expected: 0 },

  // Empty available list - no ingredient IDs to check
  { name: 'empty available list', part: 1, input: g([
    '1-10',
    '20-30',
    '',
  ]), expected: 0 },

  // Single ID range (e.g., 5-5 means only ID 5 is fresh)
  { name: 'single ID range match', part: 1, input: g([
    '5-5',
    '',
    '5',
  ]), expected: 1 },

  // Single ID range, no match
  { name: 'single ID range no match', part: 1, input: g([
    '5-5',
    '',
    '4',
    '6',
  ]), expected: 0 },

  // Multiple non-overlapping ranges
  { name: 'multiple non-overlapping ranges', part: 1, input: g([
    '1-3',
    '10-12',
    '20-22',
    '',
    '2',
    '5',
    '11',
    '15',
    '21',
    '30',
  ]), expected: 3 },

  // Single range with multiple available IDs
  { name: 'single range multiple IDs', part: 1, input: g([
    '1-100',
    '',
    '1',
    '25',
    '50',
    '75',
    '100',
    '101',
  ]), expected: 5 },

  // Part 2 tests - Count total unique fresh IDs across all ranges
  // The available ingredient IDs section is ignored; only ranges matter

  // Main example: ranges 3-5, 10-14, 16-20, 12-18
  // Unique IDs: 3,4,5,10,11,12,13,14,15,16,17,18,19,20 = 14
  { name: 'example.txt', part: 2, input: example, expected: 14 },

  // Single range "1-5" → 5 IDs (1,2,3,4,5)
  { name: 'single range', part: 2, input: g([
    '1-5',
    '',
  ]), expected: 5 },

  // Non-overlapping ranges: 1-3, 10-12 → 3 + 3 = 6 IDs
  { name: 'non-overlapping ranges', part: 2, input: g([
    '1-3',
    '10-12',
    '',
  ]), expected: 6 },

  // Fully overlapping ranges: 1-10, 1-10 → still 10 IDs
  { name: 'fully overlapping ranges', part: 2, input: g([
    '1-10',
    '1-10',
    '',
  ]), expected: 10 },

  // Partially overlapping ranges: 1-10, 5-15 → union is 1-15 = 15 IDs
  { name: 'partially overlapping ranges', part: 2, input: g([
    '1-10',
    '5-15',
    '',
  ]), expected: 15 },

  // Adjacent ranges: 1-5, 6-10 → 10 IDs (no overlap, but continuous)
  { name: 'adjacent ranges', part: 2, input: g([
    '1-5',
    '6-10',
    '',
  ]), expected: 10 },

  // Single ID range: 5-5 → 1 ID
  { name: 'single ID range', part: 2, input: g([
    '5-5',
    '',
  ]), expected: 1 },

  // Large gap between ranges: 1-5, 100-105 → 5 + 6 = 11 IDs
  { name: 'large gap between ranges', part: 2, input: g([
    '1-5',
    '100-105',
    '',
  ]), expected: 11 },

  // Multiple overlapping ranges with complex merging
  // 1-5, 3-8, 10-15, 12-20 → 1-8 (8) + 10-20 (11) = 19 IDs
  { name: 'complex overlapping', part: 2, input: g([
    '1-5',
    '3-8',
    '10-15',
    '12-20',
    '',
  ]), expected: 19 },

  // Contained range: 1-20, 5-10 → still 20 IDs (inner range adds nothing)
  { name: 'contained range', part: 2, input: g([
    '1-20',
    '5-10',
    '',
  ]), expected: 20 },
];

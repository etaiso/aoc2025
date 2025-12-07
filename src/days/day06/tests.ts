import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

// Helper to convert array of lines to input string
const g = (lines: string[]) => lines.join('\n');

export const tests: TestCase[] = [
  // Part 1 tests - Solve worksheet problems and sum results

  // Main example from problem description:
  // 123 * 45 * 6 = 33210
  // 328 + 64 + 98 = 490
  // 51 * 387 * 215 = 4243455
  // 64 + 23 + 314 = 401
  // Grand total: 33210 + 490 + 4243455 + 401 = 4277556
  { name: 'example.txt', part: 1, input: example, expected: 4277556 },

  // Single addition problem
  { name: 'single addition', part: 1, input: g([
    '10',
    '20',
    '30',
    '+ ',
  ]), expected: 60 },

  // Single multiplication problem
  { name: 'single multiplication', part: 1, input: g([
    ' 2',
    ' 3',
    ' 4',
    ' *',
  ]), expected: 24 },

  // Two problems side by side
  { name: 'two problems', part: 1, input: g([
    '5 10',
    '3 20',
    '* + ',
  ]), expected: 15 + 30 },

  // Numbers with different alignments (left, right)
  { name: 'different alignments', part: 1, input: g([
    '100',
    ' 50',
    '  5',
    '+  ',
  ]), expected: 155 },

  // Multiple separating columns between problems
  { name: 'multiple separator columns', part: 1, input: g([
    '5   10',
    '5   10',
    '*   + ',
  ]), expected: 25 + 20 },

  // Large numbers
  { name: 'large numbers', part: 1, input: g([
    '1000',
    '2000',
    '3000',
    '+   ',
  ]), expected: 6000 },

  // Multiplication of larger numbers
  { name: 'large multiplication', part: 1, input: g([
    '100',
    ' 20',
    '  5',
    '*  ',
  ]), expected: 10000 },

  // Single two-number addition
  { name: 'two number addition', part: 1, input: g([
    '7',
    '3',
    '+',
  ]), expected: 10 },

  // Single two-number multiplication
  { name: 'two number multiplication', part: 1, input: g([
    '7',
    '3',
    '*',
  ]), expected: 21 },

  // Three problems with mixed operations
  { name: 'three mixed problems', part: 1, input: g([
    '2 3 4',
    '2 3 4',
    '* + *',
  ]), expected: 4 + 6 + 16 },

  // Four problems (like the example structure)
  { name: 'four problems', part: 1, input: g([
    '1 2 3 4',
    '1 2 3 4',
    '+ * + *',
  ]), expected: 2 + 4 + 6 + 16 },

  // Single number "multiplication" (identity)
  { name: 'single number multiplication', part: 1, input: g([
    '42',
    '* ',
  ]), expected: 42 },

  // Single number "addition" (identity)
  { name: 'single number addition', part: 1, input: g([
    '42',
    '+ ',
  ]), expected: 42 },

  // More than 3 numbers in a problem
  { name: 'four numbers addition', part: 1, input: g([
    '1',
    '2',
    '3',
    '4',
    '+',
  ]), expected: 10 },

  // More than 3 numbers multiplication
  { name: 'four numbers multiplication', part: 1, input: g([
    '1',
    '2',
    '3',
    '4',
    '*',
  ]), expected: 24 },

  // Operators not perfectly aligned with numbers
  { name: 'operator alignment', part: 1, input: g([
    '12 34',
    ' 5  6',
    ' *  +',
  ]), expected: 60 + 40 },

  // Problem with trailing spaces
  { name: 'trailing spaces', part: 1, input: g([
    '5    ',
    '5    ',
    '*    ',
  ]), expected: 25 },

  // Verify zero handling in addition
  { name: 'zero in addition', part: 1, input: g([
    '10',
    ' 0',
    '+ ',
  ]), expected: 10 },

  // Mix of single-digit and multi-digit numbers
  { name: 'mixed digit counts', part: 1, input: g([
    '123',
    '  4',
    ' 56',
    '+  ',
  ]), expected: 183 },

  // ==========================================================================
  // Part 2 tests - Column-based numbers (read top-to-bottom per column)
  // ==========================================================================

  // Main example from problem description:
  // Rightmost: 4 + 431 + 623 = 1058
  // Second: 175 * 581 * 32 = 3253600
  // Third: 8 + 248 + 369 = 625
  // Leftmost: 356 * 24 * 1 = 8544
  // Grand total: 1058 + 3253600 + 625 + 8544 = 3263827
  { name: 'example.txt', part: 2, input: example, expected: 3263827 },

  // Single column number (single digit per row = multi-digit number)
  // Column: 1, 2, 3 → number 123
  { name: 'single column addition', part: 2, input: g([
    '1',
    '2',
    '3',
    '+',
  ]), expected: 123 },

  // Single column multiplication
  { name: 'single column multiplication', part: 2, input: g([
    '2',
    '5',
    '*',
  ]), expected: 25 },

  // Two columns, addition
  // Col 0: 1, 2 → 12; Col 1: 3, 4 → 34
  // 12 + 34 = 46
  { name: 'two columns addition', part: 2, input: g([
    '13',
    '24',
    '+ ',
  ]), expected: 12 + 34 },

  // Two columns, multiplication
  { name: 'two columns multiplication', part: 2, input: g([
    '12',
    '34',
    '* ',
  ]), expected: 13 * 24 },

  // Three columns with gaps (spaces in some rows)
  // Col 0: '1', ' ', ' ' → 1; Col 1: '2', '3', ' ' → 23; Col 2: ' ', '4', '5' → 45
  { name: 'three columns with gaps', part: 2, input: g([
    '12 ',
    ' 34',
    ' 45',
    '+  ',
  ]), expected: 1 + 234 + 45 },

  // Two separate problems
  // Problem 1: cols 0-1, multiplication
  // Problem 2: cols 3-4, addition
  { name: 'two problems columns', part: 2, input: g([
    '12 34',
    '56 78',
    '*  + ',
  ]), expected: (15 * 26) + (37 + 48) },

  // Sparse column (only one digit)
  { name: 'sparse column', part: 2, input: g([
    ' ',
    '5',
    ' ',
    '+',
  ]), expected: 5 },

  // Multiple rows forming larger numbers
  { name: 'four row number', part: 2, input: g([
    '1',
    '2',
    '3',
    '4',
    '+',
  ]), expected: 1234 },

  // Multiple columns with varying heights
  // Col 0: 1, 2, 3 → 123; Col 1: 4, 5, 6 → 456
  { name: 'multi-digit columns', part: 2, input: g([
    '14',
    '25',
    '36',
    '+ ',
  ]), expected: 123 + 456 },

  // Column multiplication with larger result
  // Col 0: 1, 0 → 10; Col 1: 2, 0 → 20
  { name: 'column multiplication larger', part: 2, input: g([
    '12',
    '00',
    '* ',
  ]), expected: 10 * 20 },

  // Mixed problems: one addition, one multiplication
  { name: 'mixed column operations', part: 2, input: g([
    '12 34',
    '12 34',
    '+  * ',
  ]), expected: (11 + 22) + (33 * 44) },

  // Verify operator in different column positions
  { name: 'operator position variation', part: 2, input: g([
    '123',
    '456',
    ' * ',
  ]), expected: 14 * 25 * 36 },

  // Single digit per column, multiple columns
  { name: 'single digit per column', part: 2, input: g([
    '246',
    '+  ',
  ]), expected: 2 + 4 + 6 },

  // Complex: different number of digits per column (spaces create gaps)
  // Col 0: 1, ' ', ' ' → 1; Col 1: ' ', 2, 3 → 23; Col 2: ' ', 4, 5 → 45
  { name: 'varying column heights', part: 2, input: g([
    '1  ',
    ' 24',
    ' 35',
    '+  ',
  ]), expected: 1 + 23 + 45 },

  // Three columns multiplication
  { name: 'three column multiplication', part: 2, input: g([
    '234',
    '567',
    '*  ',
  ]), expected: 25 * 36 * 47 },

  // Edge: all same digits in column
  { name: 'same digits column', part: 2, input: g([
    '1',
    '1',
    '1',
    '+',
  ]), expected: 111 },
];

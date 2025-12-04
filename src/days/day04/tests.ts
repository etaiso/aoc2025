import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

// Helper to convert array of lines to input string
const g = (lines: string[]) => lines.join('\n');

export const tests: TestCase[] = [
  // Part 1 tests - Count accessible paper rolls
  // A roll "@" is accessible if fewer than 4 rolls in its 8 adjacent positions
  
  // Main example from problem description: 13 accessible rolls
  { name: 'example.txt', part: 1, input: example, expected: 13 },

  // Single roll - no neighbors, always accessible (0 < 4)
  { name: 'single roll', part: 1, input: '@', expected: 1 },
  
  // Single roll surrounded by empty cells
  { name: 'single roll with empty neighbors', part: 1, input: g([
    '...',
    '.@.',
    '...',
  ]), expected: 1 },
  
  // Empty grid - no rolls at all
  { name: 'empty grid', part: 1, input: g([
    '...',
    '...',
    '...',
  ]), expected: 0 },
  
  // Roll with exactly 3 neighbors (accessible - 3 < 4)
  { name: 'roll with 3 neighbors (accessible)', part: 1, input: g([
    '.@.',
    '@@.',
    '.@.',
  ]), expected: 4 },
  
  // Roll with exactly 4 neighbors (NOT accessible - 4 is not < 4)
  { name: 'center roll with 4 neighbors (not accessible)', part: 1, input: g([
    '.@.',
    '@@@',
    '.@.',
  ]), expected: 4 },
  
  // 3x3 full grid - corners have 3 neighbors (accessible), edges have 5 (not), center has 8 (not)
  { name: '3x3 full grid - only corners accessible', part: 1, input: g([
    '@@@',
    '@@@',
    '@@@',
  ]), expected: 4 },
  
  // 2x2 block - each roll has 3 neighbors (all accessible)
  { name: '2x2 block - all have 3 neighbors', part: 1, input: g([
    '@@',
    '@@',
  ]), expected: 4 },
  
  // All rolls in a row - middle ones have 2 neighbors each
  { name: 'horizontal line of rolls', part: 1, input: '@@@@@', expected: 5 },
  
  // All rolls in a column - middle ones have 2 neighbors each
  { name: 'vertical line of rolls', part: 1, input: g([
    '@',
    '@',
    '@',
    '@',
    '@',
  ]), expected: 5 },
  
  // Checkerboard pattern - center has 4 diagonal neighbors (not accessible), corners have 1 each (accessible)
  { name: 'checkerboard 3x3 - center blocked', part: 1, input: g([
    '@.@',
    '.@.',
    '@.@',
  ]), expected: 4 },
  
  // Plus pattern - center has 4 neighbors (not accessible), tips have 1 each (accessible)
  { name: 'plus pattern', part: 1, input: g([
    '.@.',
    '@@@',
    '.@.',
  ]), expected: 4 },
  
  // Sparse grid - all accessible (each has 0 neighbors)
  { name: 'sparse grid all accessible', part: 1, input: g([
    '@.@.@',
    '.....',
    '@.@.@',
  ]), expected: 6 },
  
  // L-shaped cluster - all have <= 2 neighbors
  { name: 'L-shape all accessible', part: 1, input: g([
    '@@...',
    '@....',
    '.....',
  ]), expected: 3 },
  
  // 4x4 grid - inner 4 have 8 neighbors (not accessible), outer 12 vary
  { name: '4x4 grid', part: 1, input: g([
    '@@@@',
    '@@@@',
    '@@@@',
    '@@@@',
  ]), expected: 4 },
  
  // Large sparse grid
  { name: 'large sparse', part: 1, input: g([
    '@...@',
    '.....',
    '.....',
    '.....',
    '@...@',
  ]), expected: 4 },

  // Part 2 tests - Count total rolls removed through ripple effect
  // Keep removing accessible rolls until none are left
  
  // Main example: 13 + 12 + 7 + 5 + 2 + 1 + 1 + 1 + 1 = 43 total removed
  { name: 'example.txt', part: 2, input: example, expected: 43 },
  
  // Single roll - immediately accessible, removed
  { name: 'single roll', part: 2, input: '@', expected: 1 },
  
  // Empty grid - nothing to remove
  { name: 'empty grid', part: 2, input: g([
    '...',
    '...',
    '...',
  ]), expected: 0 },
  
  // All isolated - all removed in one pass
  { name: 'all isolated', part: 2, input: g([
    '@.@.@',
    '.....',
    '@.@.@',
  ]), expected: 6 },
  
  // 2x2 block - all have 3 neighbors, all accessible, all removed
  { name: '2x2 block - all removed', part: 2, input: g([
    '@@',
    '@@',
  ]), expected: 4 },
  
  // 3x3 full grid - ripple effect clears all
  // Pass 1: 4 corners (3 neighbors each)
  // Pass 2: 4 edges (now 3 neighbors each)
  // Pass 3: 1 center (now 0 neighbors)
  // Total: 9
  { name: '3x3 full grid - all removed via ripple', part: 2, input: g([
    '@@@',
    '@@@',
    '@@@',
  ]), expected: 9 },
  
  // Plus pattern - tips then center
  // Pass 1: 4 tips (3 neighbors each)
  // Pass 2: 1 center (now 0 neighbors)
  // Total: 5
  { name: 'plus pattern - all removed', part: 2, input: g([
    '.@.',
    '@@@',
    '.@.',
  ]), expected: 5 },
  
  // Checkerboard 3x3 - corners then center
  // Pass 1: 4 corners (1 neighbor each)
  // Pass 2: 1 center (now 0 neighbors)
  // Total: 5
  { name: 'checkerboard 3x3 - all removed', part: 2, input: g([
    '@.@',
    '.@.',
    '@.@',
  ]), expected: 5 },
  
  // 4x4 grid - only corners removable, rest stay blocked
  // Corners have 3 neighbors → accessible
  // After corners removed, edges have 4 neighbors → blocked
  // Total: 4
  { name: '4x4 grid - only corners removed', part: 2, input: g([
    '@@@@',
    '@@@@',
    '@@@@',
    '@@@@',
  ]), expected: 4 },
  
  // Horizontal line - all have ≤2 neighbors, all removed
  { name: 'horizontal line - all removed', part: 2, input: '@@@@@', expected: 5 },
  
  // Vertical line - all have ≤2 neighbors, all removed
  { name: 'vertical line - all removed', part: 2, input: g([
    '@',
    '@',
    '@',
    '@',
    '@',
  ]), expected: 5 },
  
  // L-shape - all accessible, all removed
  { name: 'L-shape - all removed', part: 2, input: g([
    '@@...',
    '@....',
    '.....',
  ]), expected: 3 },
  
  // 5x5 grid - only corners removable (edges have 4 neighbors after)
  // Same as 4x4: dense grids only lose corners
  { name: '5x5 grid - only corners', part: 2, input: g([
    '@@@@@',
    '@@@@@',
    '@@@@@',
    '@@@@@',
    '@@@@@',
  ]), expected: 4 },
  
  // Diamond pattern - all eventually removable
  // Pass 1: 4 tips (3 neighbors)
  // Pass 2: 4 corners of inner diamond (now 3 neighbors)
  // Pass 3: 4 tips of plus (now 3 neighbors)
  // Pass 4: 1 center (now 0 neighbors)
  // Total: 4 + 4 + 4 + 1 = 13
  { name: 'diamond pattern', part: 2, input: g([
    '..@..',
    '.@@@.',
    '@@@@@',
    '.@@@.',
    '..@..',
  ]), expected: 13 },
  
  // Chain reaction - removing one unlocks the next
  // Single column of rolls - all accessible, all removed
  { name: 'chain column', part: 2, input: g([
    '@',
    '@',
    '@',
  ]), expected: 3 },
  
  // Donut shape - outer ring accessible, then inner becomes accessible
  { name: 'donut 5x5', part: 2, input: g([
    '@@@@@',
    '@...@',
    '@...@',
    '@...@',
    '@@@@@',
  ]), expected: 16 },
];

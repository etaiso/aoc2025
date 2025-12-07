// Advent of Code 2025 - Day 6
// https://adventofcode.com/2025/day/6

import { sum, product, lines } from '../../utils';

/**
 * Parse the worksheet and extract problems.
 * Each problem is a group of columns separated by full-space columns.
 * Numbers are stacked vertically, operator is at the bottom.
 */
function parseProblems(input: string): { numbers: number[]; operator: string }[] {
  const rows = lines(input);
  const height = rows.length;
  const width = Math.max(...rows.map(r => r.length));
  
  // Pad all rows to same width
  const paddedRows = rows.map(r => r.padEnd(width, ' '));
  
  // Check if a column is a separator (all spaces)
  const isSeparator = (col: number): boolean =>
    paddedRows.every(row => row[col] === ' ');
  
  const problems: { numbers: number[]; operator: string }[] = [];
  let currentCols: number[] = [];
  
  for (let col = 0; col < width; col++) {
    if (isSeparator(col)) {
      if (currentCols.length > 0) {
        // Extract problem from current columns
        const problem = extractProblem(paddedRows, currentCols, height);
        if (problem) problems.push(problem);
        currentCols = [];
      }
    } else {
      currentCols.push(col);
    }
  }
  
  // Handle last problem if it doesn't end with separator
  if (currentCols.length > 0) {
    const problem = extractProblem(paddedRows, currentCols, height);
    if (problem) problems.push(problem);
  }
  
  return problems;
}

/**
 * Extract a single problem from the given columns.
 */
function extractProblem(
  rows: string[],
  cols: number[],
  height: number
): { numbers: number[]; operator: string } | null {
  // Get operator from last row
  const lastRow = rows[height - 1];
  const operatorChar = cols
    .map(c => lastRow[c])
    .find(c => c === '+' || c === '*');
  
  if (!operatorChar) return null;
  
  // Extract numbers from all rows except the last (operator row)
  const numbers: number[] = [];
  for (let row = 0; row < height - 1; row++) {
    const numStr = cols.map(c => rows[row][c]).join('').trim();
    if (numStr && /^\d+$/.test(numStr)) {
      numbers.push(parseInt(numStr, 10));
    }
  }
  
  return { numbers, operator: operatorChar };
}

/**
 * Extract a single problem for Part 2 (column-based numbers).
 * Each column represents a number, read top-to-bottom.
 */
function extractProblemPart2(
  rows: string[],
  cols: number[],
  height: number
): { numbers: number[]; operator: string } | null {
  // Get operator from last row
  const lastRow = rows[height - 1];
  const operatorChar = cols
    .map(c => lastRow[c])
    .find(c => c === '+' || c === '*');
  
  if (!operatorChar) return null;
  
  // Each column forms a number by reading digits top-to-bottom
  const numbers: number[] = [];
  
  for (const col of cols) {
    let digits = '';
    for (let row = 0; row < height - 1; row++) {
      const char = rows[row][col];
      if (/\d/.test(char)) {
        digits += char;
      }
    }
    if (digits) {
      numbers.push(parseInt(digits, 10));
    }
  }
  
  return { numbers, operator: operatorChar };
}

/**
 * Parse the worksheet for Part 2 (column-based numbers).
 */
function parseProblemsPart2(input: string): { numbers: number[]; operator: string }[] {
  const rows = lines(input);
  const height = rows.length;
  const width = Math.max(...rows.map(r => r.length));
  
  // Pad all rows to same width
  const paddedRows = rows.map(r => r.padEnd(width, ' '));
  
  // Check if a column is a separator (all spaces)
  const isSeparator = (col: number): boolean =>
    paddedRows.every(row => row[col] === ' ');
  
  const problems: { numbers: number[]; operator: string }[] = [];
  let currentCols: number[] = [];
  
  for (let col = 0; col < width; col++) {
    if (isSeparator(col)) {
      if (currentCols.length > 0) {
        const problem = extractProblemPart2(paddedRows, currentCols, height);
        if (problem) problems.push(problem);
        currentCols = [];
      }
    } else {
      currentCols.push(col);
    }
  }
  
  // Handle last problem if it doesn't end with separator
  if (currentCols.length > 0) {
    const problem = extractProblemPart2(paddedRows, currentCols, height);
    if (problem) problems.push(problem);
  }
  
  return problems;
}

/**
 * Solve a problem by applying the operator to all numbers.
 */
function solveProblem(numbers: number[], operator: string): number {
  if (operator === '+') {
    return sum(numbers);
  } else {
    return product(numbers);
  }
}

export function part1(input: string): number {
  const problems = parseProblems(input);
  const results = problems.map(p => solveProblem(p.numbers, p.operator));
  return sum(results);
}

export function part2(input: string): number {
  const problems = parseProblemsPart2(input);
  const results = problems.map(p => solveProblem(p.numbers, p.operator));
  return sum(results);
}

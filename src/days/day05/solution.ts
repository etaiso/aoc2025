// Advent of Code 2025 - Day 5
// https://adventofcode.com/2025/day/5

import { lines, count } from '../../utils';

type Range = [start: number, end: number];

export function part1(input: string): number {
  const allLines = lines(input);
  
  // Find the blank line separator
  const blankIndex = allLines.findIndex(line => line.trim() === '');
  
  const rangeLines = allLines.slice(0, blankIndex);
  const idLines = allLines.slice(blankIndex + 1).filter(line => line.trim() !== '');
  
  // Parse all ranges as [start, end] tuples
  const ranges: Range[] = rangeLines.map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end];
  });
  
  // Check if an ID is fresh (falls within any range)
  const isFresh = (id: number): boolean => 
    ranges.some(([start, end]) => id >= start && id <= end);
  
  // Get available IDs and count how many are fresh
  const availableIds = idLines.map(Number);
  
  return count(availableIds, isFresh);
}

export function part2(input: string): number {
  const allLines = lines(input);
  
  // Find the blank line separator (if no blank line, use all non-empty lines)
  const blankIndex = allLines.findIndex(line => line.trim() === '');
  
  const rangeLines = blankIndex === -1 
    ? allLines.filter(line => line.trim() !== '')
    : allLines.slice(0, blankIndex);
  
  // Parse all ranges as [start, end] tuples
  const ranges: Range[] = rangeLines.map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end];
  });
  
  // Sort ranges by start position
  ranges.sort((a, b) => a[0] - b[0]);
  
  // Merge overlapping/adjacent ranges
  const merged: Range[] = [];
  for (const [start, end] of ranges) {
    if (merged.length === 0) {
      merged.push([start, end]);
    } else {
      const last = merged[merged.length - 1];
      // Check if current range overlaps or is adjacent to last merged range
      if (start <= last[1] + 1) {
        // Merge by extending the end if needed
        last[1] = Math.max(last[1], end);
      } else {
        // No overlap, add as new range
        merged.push([start, end]);
      }
    }
  }
  
  // Sum up sizes of all merged ranges
  let total = 0;
  for (const [start, end] of merged) {
    total += end - start + 1;
  }
  
  return total;
}

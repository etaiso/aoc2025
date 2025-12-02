// Advent of Code 2025 - Day 2
// https://adventofcode.com/2025/day/2

import { range, sum } from '../../utils';

type Range = { start: number; end: number };

// Parsing
const parseRange = (s: string): Range => {
  const [start, end] = s.split('-').map(Number);
  return { start, end };
};

const parseInput = (input: string): Range[] =>
  input.trim().split(',').map(parseRange);

// Core logic - doubled pattern generation (Part 1: exactly 2 repetitions)
const doublePattern = (base: number, len: number): number =>
  base * Math.pow(10, len) + base;

const generateDoubledNumbers = (maxDigits: number): number[] =>
  range(1, Math.floor(maxDigits / 2) + 1).flatMap(len => {
    const minBase = len === 1 ? 1 : Math.pow(10, len - 1);
    const maxBase = Math.pow(10, len) - 1;
    return range(minBase, maxBase + 1).map(base => doublePattern(base, len));
  });

// Part 2: patterns repeated at least twice
// Magic multiplier: (10^(len*reps) - 1) / (10^len - 1)
// e.g., for len=2, reps=3: (10^6 - 1) / (10^2 - 1) = 999999 / 99 = 10101
const repeatPattern = (base: number, len: number, reps: number): number =>
  base * ((Math.pow(10, len * reps) - 1) / (Math.pow(10, len) - 1));

const generateRepeatedPatterns = (maxDigits: number): number[] => {
  const results = new Set<number>();

  for (let len = 1; len <= Math.floor(maxDigits / 2); len++) {
    const minBase = len === 1 ? 1 : Math.pow(10, len - 1);
    const maxBase = Math.pow(10, len) - 1;

    for (let base = minBase; base <= maxBase; base++) {
      // reps from 2 up to max that fits in maxDigits
      for (let reps = 2; len * reps <= maxDigits; reps++) {
        results.add(repeatPattern(base, len, reps));
      }
    }
  }

  return [...results];
};

// Sum invalid IDs in a range
const sumInvalidInRange = (doubled: number[], { start, end }: Range): number =>
  sum(doubled.filter(n => n >= start && n <= end));

export function part1(input: string): number {
  const ranges = parseInput(input);
  const maxEnd = Math.max(...ranges.map(r => r.end));
  const maxDigits = maxEnd.toString().length;
  const allDoubled = generateDoubledNumbers(maxDigits);

  return sum(ranges.map(r => sumInvalidInRange(allDoubled, r)));
}

export function part2(input: string): number {
  const ranges = parseInput(input);
  const maxEnd = Math.max(...ranges.map(r => r.end));
  const maxDigits = maxEnd.toString().length;
  const allRepeated = generateRepeatedPatterns(maxDigits);

  return sum(ranges.map(r => sumInvalidInRange(allRepeated, r)));
}

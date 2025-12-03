// Advent of Code 2025 - Day 3
// https://adventofcode.com/2025/day/3

import { lines, sum } from '../../utils';

function maxJoltage(bank: string): number {
  // Step 1: Find the largest digit from [0, len-1) and its position
  let firstVal = 0;
  let firstIndex = 0;
  for (let i = 0; i < bank.length - 1; i++) {
    const digit = Number(bank[i]);
    if (digit > firstVal) {
      firstVal = digit;
      firstIndex = i;
    }
  }

  // Step 2: Find the largest digit from [firstIndex+1, len)
  let secVal = 0;
  for (let i = firstIndex + 1; i < bank.length; i++) {
    const digit = Number(bank[i]);
    if (digit > secVal) {
      secVal = digit;
    }
  }

  // Step 3: Return the two-digit joltage
  return firstVal * 10 + secVal;
}

export function part1(input: string): number {
  const banks = lines(input);
  return sum(banks.map(maxJoltage));
}

function maxJoltage12(bank: string): number {
  const digits: number[] = [];
  let lastIndex = -1;

  // Greedily pick 12 digits
  for (let i = 0; i < 12; i++) {
    const remaining = 12 - i;
    const endIndex = bank.length - remaining;

    // Find max digit from (lastIndex+1) to endIndex
    let maxDigit = 0;
    let maxPos = lastIndex + 1;
    for (let j = lastIndex + 1; j <= endIndex; j++) {
      const digit = Number(bank[j]);
      if (digit > maxDigit) {
        maxDigit = digit;
        maxPos = j;
      }
    }

    digits.push(maxDigit);
    lastIndex = maxPos;
  }

  // Convert 12 digits to a number
  return digits.reduce((acc, d) => acc * 10 + d, 0);
}

export function part2(input: string): number {
  const banks = lines(input);
  return sum(banks.map(maxJoltage12));
}

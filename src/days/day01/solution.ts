// Advent of Code 2025 - Day 1
// https://adventofcode.com/2025/day/1

import { lines } from '../../utils';

const START = 50;
const RANGE = 100;

const wrap = (n: number) => ((n % RANGE) + RANGE) % RANGE;

const parse = (line: string) => {
  const delta = parseInt(line.slice(1));
  return line[0] === 'R' ? delta : -delta;
};

export function part1(input: string): number {
  const { count } = lines(input).reduce(
    ({ value, count }, line) => {
      const next = wrap(value + parse(line));
      return { value: next, count: count + (next === 0 ? 1 : 0) };
    },
    { value: START, count: 0 }
  );
  return count;
}

export function part2(input: string): number {
  const countZeroPasses = (start: number, delta: number): number => {
    if (delta >= 0) {
      return Math.floor((start + delta) / RANGE);
    }
    const absDelta = Math.abs(delta);
    if (start === 0) return Math.floor(absDelta / RANGE);
    return absDelta >= start ? 1 + Math.floor((absDelta - start) / RANGE) : 0;
  };

  const { count } = lines(input).reduce(
    ({ value, count }, line) => {
      const delta = parse(line);
      const passes = countZeroPasses(value, delta);
      const next = wrap(value + delta);
      return { value: next, count: count + passes };
    },
    { value: START, count: 0 }
  );
  return count;
}

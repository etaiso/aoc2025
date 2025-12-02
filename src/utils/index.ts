// Common utilities for Advent of Code solutions

/** Parse input into array of numbers */
export const nums = (input: string): number[] =>
  input.match(/-?\d+/g)?.map(Number) ?? [];

/** Parse input into lines */
export const lines = (input: string): string[] => input.split("\n");

/** Parse input into grid of characters */
export const grid = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

/** Parse input into grid of numbers */
export const numGrid = (input: string): number[][] =>
  input.split("\n").map((line) => line.split("").map(Number));

/** Sum an array of numbers */
export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

/** Product of an array of numbers */
export const product = (arr: number[]): number => arr.reduce((a, b) => a * b, 1);

/** Min of an array of numbers */
export const min = (arr: number[]): number => Math.min(...arr);

/** Max of an array of numbers */
export const max = (arr: number[]): number => Math.max(...arr);

/** Count occurrences matching a predicate */
export const count = <T>(arr: T[], pred: (x: T) => boolean): number =>
  arr.filter(pred).length;

/** Range from start to end (exclusive) */
export const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start }, (_, i) => start + i);

/** GCD of two numbers */
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** LCM of two numbers */
export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

/** LCM of array of numbers */
export const lcmAll = (arr: number[]): number => arr.reduce(lcm, 1);

/** Manhattan distance between two points */
export const manhattan = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): number => Math.abs(x1 - x2) + Math.abs(y1 - y2);

/** 4-directional neighbors */
export const neighbors4 = (x: number, y: number): [number, number][] => [
  [x - 1, y],
  [x + 1, y],
  [x, y - 1],
  [x, y + 1],
];

/** 8-directional neighbors */
export const neighbors8 = (x: number, y: number): [number, number][] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

/** Transpose a 2D array */
export const transpose = <T>(grid: T[][]): T[][] =>
  grid[0].map((_, i) => grid.map((row) => row[i]));

/** Deep clone an object */
export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/** Memoize a function */
export const memo = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args) as ReturnType<T>);
    return cache.get(key)!;
  }) as T;
};




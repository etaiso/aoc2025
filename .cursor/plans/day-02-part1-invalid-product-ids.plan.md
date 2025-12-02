<!-- 59163130-71d2-4df8-8625-20edcbcafa86 ccaf353a-5f69-4f90-8031-fa82bcd228bc -->
# Day 02: Sum of Invalid Product IDs

## Key Insight

Instead of counting invalid IDs, we now sum them. Use the "generate invalid IDs directly" approach (Approach #3) to find all doubled patterns in each range, then sum them.

A doubled pattern is a number where the string representation is a pattern repeated twice: `base * 10^len + base`.

## Implementation Plan

### 1. Update Tests First (TDD)

Update [src/days/day02/tests.ts](src/days/day02/tests.ts) with expected sums:

```typescript
// Examples from problem statement - now expecting sums
{ name: '11-22 has 11 and 22', part: 1, input: '11-22', expected: 33 },        // 11 + 22
{ name: '95-115 has 99', part: 1, input: '95-115', expected: 99 },
{ name: '998-1012 has 1010', part: 1, input: '998-1012', expected: 1010 },
{ name: 'multiple ranges', part: 1, input: '11-22,95-115', expected: 132 },    // 33 + 99
```

### 2. Parsing Layer

In [src/days/day02/solution.ts](src/days/day02/solution.ts):

```typescript
type Range = { start: number; end: number };

const parseRange = (s: string): Range => {
  const [start, end] = s.split('-').map(Number);
  return { start, end };
};

const parseInput = (input: string): Range[] =>
  input.trim().split(',').map(parseRange);
```

### 3. Generate Doubled Numbers

```typescript
const doublePattern = (base: number, len: number): number =>
  base * Math.pow(10, len) + base;

const generateDoubledNumbers = (maxDigits: number): number[] =>
  range(1, Math.floor(maxDigits / 2) + 1).flatMap(len => {
    const minBase = len === 1 ? 1 : Math.pow(10, len - 1);
    const maxBase = Math.pow(10, len) - 1;
    return range(minBase, maxBase + 1).map(base => doublePattern(base, len));
  });
```

### 4. Sum Invalid IDs in Range (Changed from Count)

```typescript
const sumInvalidInRange = (doubled: number[], { start, end }: Range): number =>
  sum(doubled.filter(n => n >= start && n <= end));
```

### 5. Main Solution

```typescript
export function part1(input: string): number {
  const ranges = parseInput(input);
  const maxEnd = Math.max(...ranges.map(r => r.end));
  const maxDigits = maxEnd.toString().length;
  const allDoubled = generateDoubledNumbers(maxDigits);

  return sum(ranges.map(r => sumInvalidInRange(allDoubled, r)));
}
```

## Files to Modify

- [src/days/day02/tests.ts](src/days/day02/tests.ts) - Update expected values to sums
- [src/days/day02/solution.ts](src/days/day02/solution.ts) - Implement solution

### To-dos

- [ ] Implement parsing and part1 solution with doubled pattern generation
- [ ] Leave part2 as placeholder for future requirements
- [ ] Update tests with expected sums instead of counts
- [ ] Implement part1 using generation approach, returning sum of invalid IDs
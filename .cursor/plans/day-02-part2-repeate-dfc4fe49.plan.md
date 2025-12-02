<!-- dfc4fe49-2b5f-40be-b866-66039af31817 67a30d81-e588-4c9d-ae75-2ae4f72a5ea3 -->
# Day 02 Part 2: Repeated Patterns (At Least Twice)

## Problem Understanding

Part 2 changes the "invalid ID" definition:

- **Part 1**: Pattern repeated exactly 2x (`11`, `1212`, `123123`)
- **Part 2**: Pattern repeated 2+ times (`11`, `111`, `1111`, `1212`, `121212`, `123123123`, etc.)

## Why This Approach Works (Simple Explanation)

### What are "repeated pattern" numbers?

A repeated pattern number is when you take some digits and write them over and over:

- Take `5`, repeat it 3 times: `555`
- Take `12`, repeat it 2 times: `1212`
- Take `12`, repeat it 3 times: `121212`
- Take `123`, repeat it 2 times: `123123`

### How do we build these numbers with math?

Imagine you have building blocks. To make `121212`, you're placing the number `12` in three different "slots":

```
Slot 3    Slot 2    Slot 1
  12        12        12
  ↓         ↓         ↓
120000  +  1200   +   12   =  121212
```

Each slot shifts the number left by multiplying:

- Slot 1: `12 * 1` = 12
- Slot 2: `12 * 100` = 1200 (shifted 2 places because "12" has 2 digits)
- Slot 3: `12 * 10000` = 120000 (shifted 4 places)

Adding them up: `12 + 1200 + 120000 = 121212`

We can factor out the `12`: `12 * (1 + 100 + 10000) = 12 * 10101 = 121212`

### The Magic Multiplier

The number `10101` is the "magic multiplier" for a 2-digit pattern repeated 3 times. It tells us where to place copies of our pattern.

| Pattern Length | Repeats | Magic Multiplier | Example |

|---------------|---------|------------------|---------|

| 1 digit | 2 | 11 | 5 * 11 = 55 |

| 1 digit | 3 | 111 | 5 * 111 = 555 |

| 2 digits | 2 | 101 | 12 * 101 = 1212 |

| 2 digits | 3 | 10101 | 12 * 10101 = 121212 |

| 3 digits | 2 | 1001 | 123 * 1001 = 123123 |

The formula `(10^(len*reps) - 1) / (10^len - 1)` calculates this magic multiplier automatically.

### Why generate instead of check?

Instead of checking every number in a range ("Is 1? Is 2? Is 3?..."), we directly create only the special repeated-pattern numbers. This is like knowing exactly which houses have red doors instead of knocking on every house to check.

## Approach

Generalize the existing generation approach. For a base pattern of length `len` repeated `reps` times:

```typescript
// Repunit multiplier: 1 + 10^len + 10^(2*len) + ... + 10^((reps-1)*len)
// Formula: (10^(len*reps) - 1) / (10^len - 1)
const repeatPattern = (base: number, len: number, reps: number): number =>
  base * ((Math.pow(10, len * reps) - 1) / (Math.pow(10, len) - 1));
```

Example: `repeatPattern(12, 2, 3)` = 12 * 10101 = 121212

## Implementation Plan

### 1. Add Tests for Part 2

Update [src/days/day02/tests.ts](src/days/day02/tests.ts):

```typescript
// Part 2 tests - patterns repeated at least twice
{ name: '11-22 (same as part1)', part: 2, input: '11-22', expected: 33 },
{ name: '110-115 has 111', part: 2, input: '110-115', expected: 111 },
{ name: '1110-1115 has 1111', part: 2, input: '1110-1115', expected: 1111 },
{ name: '121210-121215 has 121212', part: 2, input: '121210-121215', expected: 121212 },
{ name: 'range with 11,111,1111', part: 2, input: '11-1111', expected: 1233 }, // 11+111+1111
```

### 2. Generalize Pattern Generation

In [src/days/day02/solution.ts](src/days/day02/solution.ts):

```typescript
// Generate repeated pattern number
const repeatPattern = (base: number, len: number, reps: number): number =>
  base * ((Math.pow(10, len * reps) - 1) / (Math.pow(10, len) - 1));

// Generate all repeated patterns up to maxDigits
const generateRepeatedPatterns = (maxDigits: number): number[] => {
  const results: number[] = [];
  
  for (let len = 1; len <= Math.floor(maxDigits / 2); len++) {
    const minBase = len === 1 ? 1 : Math.pow(10, len - 1);
    const maxBase = Math.pow(10, len) - 1;
    
    for (let base = minBase; base <= maxBase; base++) {
      // reps from 2 up to max that fits in maxDigits
      for (let reps = 2; len * reps <= maxDigits; reps++) {
        results.push(repeatPattern(base, len, reps));
      }
    }
  }
  
  return results;
};
```

### 3. Implement part2

```typescript
export function part2(input: string): number {
  const ranges = parseInput(input);
  const maxEnd = Math.max(...ranges.map(r => r.end));
  const maxDigits = maxEnd.toString().length;
  const allRepeated = generateRepeatedPatterns(maxDigits);

  return sum(ranges.map(r => sumInvalidInRange(allRepeated, r)));
}
```

## Files to Modify

- [src/days/day02/solution.ts](src/days/day02/solution.ts) - Add `generateRepeatedPatterns` and implement `part2`
- [src/days/day02/tests.ts](src/days/day02/tests.ts) - Add part 2 test cases

### To-dos

- [ ] Add part 2 test cases covering 2+ repetitions
- [ ] Add repeatPattern and generateRepeatedPatterns functions
- [ ] Implement part2 using the generalized pattern generator